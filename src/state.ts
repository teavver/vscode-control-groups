import * as vscode from "vscode"
import { Mark } from "./mark"
import { Logger, ExtensionState, MarkData } from "./types"
import { isEmpty, isNullish, obj, logMod, compareObj } from "./util"
import { StatusBar } from "./status"
import { Configuration } from "./configuration"
import { ExtensionConfig } from "./enums"

export class StateManager {
  private readonly dlog: Logger
  private readonly config: Configuration
  private readonly status: StatusBar

  private readonly DISK_STATE_KEY = "sc2.groups"
  private readonly FIRST_MARK_ID = 0
  private readonly MAX_MARKS_PER_GROUP = 9 // if you're cycling through 9+ marks you're really missing the point
  private readonly SUB: { [k: number]: string } = {
    0: "",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  }

  private context: vscode.ExtensionContext
  state: ExtensionState

  constructor(
    extContext: vscode.ExtensionContext,
    dlog: Logger,
    config: Configuration,
    status: StatusBar,
  ) {
    this.context = extContext
    this.status = status
    this.config = config
    this.dlog = dlog
    const diskState = this.context.workspaceState.get(
      this.DISK_STATE_KEY,
    ) as ExtensionState
    if (isNullish(diskState) || Object.keys(diskState).length < 1) {
      this.state = {
        activeGroupId: -1,
        groups: {},
      }
    } else {
      this.state = diskState
      this.status.update(this.formatState())
    }
  }

  /**
   * For control group stealing;
   * Jumping to a mark in group 2 and adding it to group 3
   * will remove it from group 2 and add it to group 3 instead of having the same location in two groups.
   * @returns id of group & idx of mark to delete
   */
  private getMarkToSteal(mark: Mark): [string, number] | null {
    let groupId: string | null = null
    let markIdx: number | null = null
    for (const [gId, gData] of Object.entries(this.state.groups)) {
      const isValidGroup = Array.isArray(gData.marks) && gData.marks.length > 0
      if (isValidGroup) {
        const idx = gData.marks.findIndex((m) => compareObj(m.data, mark.data))
        if (idx !== -1) {
          markIdx = idx
          groupId = gId
          break
        }
      }
    }
    if (isNullish(groupId) || isNullish(markIdx)) return null
    return [groupId, markIdx]
  }

  formatState() {
    const groups = Object.keys(this.state.groups)
    if (groups.length === 0) return StatusBar.DEFAULT_LABEL_ON
    const activeGroup = this.state.activeGroupId.toString()
    const groupMarkCounts = groups.map(
      (id) => this.state.groups[id].marks.length,
    )
    return `${groups
      .map((gId, idx) =>
        gId === activeGroup
          ? ` *${gId}${this.SUB[groupMarkCounts[idx]] ?? ""} `
          : ` ${gId}${this.SUB[groupMarkCounts[idx]] ?? ""} `,
      )
      .join(" ")}`
  }

  async jumpToGroup(id: number, markId?: number) {
    const groups = this.state.groups
    const target = groups[id.toString()]
    if (isNullish(target) || isEmpty(target.marks)) return
    this.state.activeGroupId = id
    const idx = isNullish(markId) ? groups[id.toString()].lastMarkId : markId
    this.dlog(
      `${logMod(this.jumpToGroup.name)} Args: ${[id, markId]} Jump idx: ${idx}`,
    )
    const mark = groups[id].marks[idx]
    groups[id].lastMarkId = idx

    // Handle Vscode split layout focus
    // Configuration: sc2.preferTabFocusInSplit
    // E.g. If you have a vertical split in Vscode, mark 2 in left tab and mark 3 in the right one,
    // Jumping from mark 2 to mark 3 will switch focus from left tab to right instead of jumping to mark 3 in the left tab.
    const tabGroups = vscode.window.tabGroups.all
    if (
      tabGroups.length > 1 &&
      this.config.get(ExtensionConfig.PREFER_TAB_FOCUS_SPLIT)
    ) {
      const targetGroup = Mark.getMarkTabGroup(mark.data)
      if (!isNullish(targetGroup)) {
        return await Mark.jump(mark, {
          viewColumn: targetGroup.viewColumn,
          preserveFocus: false,
          preview: false,
        })
      }
    }

    // Normal scenario (only one tab group opened)
    // Jump to most-recently visited/added mark in group by default
    await Mark.jump(mark)
    const newState: ExtensionState = { ...this.state, groups }
    this.context.workspaceState
      .update(this.DISK_STATE_KEY, newState)
      .then(() => this.status.update(this.formatState()))
  }

  addToGroup(id: number, data: MarkData, createGroup: boolean = false) {
    const groups = this.state.groups
    const mark = new Mark(data)
    this.dlog(
      `${logMod(this.addToGroup.name)} Args: ${[id, obj(data), createGroup]}`,
    )
    // Handle Control Group Stealing
    // Configuration: sc2.controlGroupStealing
    if (this.config.get(ExtensionConfig.GROUP_STEALING)) {
      const stealMark = this.getMarkToSteal(mark)
      if (Array.isArray(stealMark)) {
        const [groupId, markIdx] = stealMark
        this.dlog(
          `${logMod(this.addToGroup.name)} Stealing mark, groupId: ${groupId}, markIdx: ${markIdx}`,
        )
        groups[groupId] = {
          lastMarkId: this.FIRST_MARK_ID, // reset to first after stealing from the group
          marks: groups[groupId].marks.filter((_, i) => i !== markIdx),
        }
        if (groups[groupId].marks.length === 0) {
          delete groups[groupId]
        }
      }
    }
    this.state.activeGroupId = id
    const target = groups[id.toString()]
    // Create mode (delete entire group and add this mark to it)
    if (createGroup || !target) {
      groups[id.toString()] = {
        lastMarkId: this.FIRST_MARK_ID,
        marks: [mark],
      }
      const newState: ExtensionState = { activeGroupId: id, groups }
      this.context.workspaceState
        .update(this.DISK_STATE_KEY, newState)
        .then(() => this.status.update(this.formatState()))
      return
    }
    const duplicate = target.marks.find((m) => compareObj(m.data, data))
    if (duplicate) return
    if (target.marks.length === this.MAX_MARKS_PER_GROUP) return
    // Add mode
    groups[id.toString()] = {
      lastMarkId: target.marks.length,
      marks: [...target.marks, mark],
    }
    const newState: ExtensionState = { activeGroupId: id, groups }
    this.context.workspaceState
      .update(this.DISK_STATE_KEY, newState)
      .then(() => this.status.update(this.formatState()))
  }

  async cycle(backwards: boolean = false) {
    const activeGroupId = this.state.activeGroupId
    const target = this.state.groups[activeGroupId]
    this.dlog(`${logMod(this.cycle.name)} Args: ${[backwards]}`)
    if (isNullish(target) || isEmpty(target.marks)) return
    const isSingleMarkGroup = target.marks.length <= 1
    if (isSingleMarkGroup) return
    const nextId = backwards ? target.lastMarkId - 1 : target.lastMarkId + 1
    const nextMark = target.marks[nextId]
    if (!nextMark) {
      this.dlog(`${logMod(this.cycle.name)} no next, back to 1st`)
      const fullCycleId = backwards
        ? target.marks.length - 1
        : this.FIRST_MARK_ID
      target.lastMarkId = fullCycleId
      return await this.jumpToGroup(activeGroupId, fullCycleId)
    }
    this.dlog(
      `${logMod(this.cycle.name)} OK (${target.lastMarkId} -> ${nextId})`,
    )
    target.lastMarkId = nextId
    await this.jumpToGroup(activeGroupId, nextId)
  }

  async resetGroups() {
    // Command: sc2.resetGroups
    this.dlog(`${logMod(this.resetGroups.name)} resetting all groups...`)
    const newState: ExtensionState = { activeGroupId: -1, groups: {} }
    this.state = newState
    this.context.workspaceState
      .update(this.DISK_STATE_KEY, newState)
      .then(() => this.status.update(this.formatState()))
  }
}
