import { Mark } from "./mark";
import { Map, Logger, ControlGroupData, ExtensionState, MarkData } from "./types";
import { isEmpty, isNullish, obj, logMod, compareObj } from "./util";
import { StatusBar } from "./status";
import { Configuration } from "./configuration";

export class StateManager {
  private readonly dlog: Logger
  private readonly config: Configuration
  private readonly status: StatusBar
  private readonly FIRST_MARK_ID = 0
  private readonly MAX_MARKS_PER_GROUP = 9 // if you're cycling through 9+ marks you're really missing the point
  private readonly SUP: { [k: number]: string } = {
    0: '',
    1: '₁',
    2: '₂',
    3: '₃',
    4: '₄',
    5: '₅',
    6: '₆',
    7: '₇',
    8: '₈',
    9: '₉',
  }

  public groups: Map<ControlGroupData>
  public state: ExtensionState

  constructor(dlog: Logger, config: Configuration, status: StatusBar) {
    this.dlog = dlog
    this.status = status
    this.config = config
    this.groups = {}
    this.state = {
      activeGroupId: -1,
    }
  }

  /**
   * Find the duplicate mark and get its previous group (if exists)
   * @returns id of group & idx of mark to delete
   */
  private getMarkToSteal(mark: Mark): [string, number] | null {
    let groupId: string | null = null
    let markIdx: number | null = null
    for (const [gId, gData] of Object.entries(this.groups)) {
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
    const groups = Object.keys(this.groups)
    if (groups.length === 0) return StatusBar.DEFAULT_LABEL_ON
    const activeGroup = this.state.activeGroupId.toString()
    const groupMarkCounts = groups.map((id) => this.groups[id].marks.length)
    return `| ${groups.map((gId, idx) =>
      gId === activeGroup
        ? ` *${gId}${this.SUP[groupMarkCounts[idx]] ?? ''} `
        : ` ${gId}${this.SUP[groupMarkCounts[idx]] ?? ''} `
    ).join(' ')} |`
  }

  jumpToGroup(id: number, markId?: number) {
    const target = this.groups[id.toString()]
    if (isNullish(target) || isEmpty(target.marks)) return
    this.state.activeGroupId = id
    // Jump to most-recently visited/added mark in group by default
    const idx = isNullish(markId)
      ? this.groups[id.toString()].lastMarkId
      : markId
    this.dlog(`${logMod(this.jumpToGroup.name)} Args: ${[id, markId,]} Jump idx: ${idx}`)
    const mark = this.groups[id].marks[idx]
    this.groups[id].lastMarkId = idx
    mark.jump()
    this.status.update(this.formatState())
  }

  addToGroup(id: number, data: MarkData, createGroup: boolean = false) {
    const mark = new Mark(data)
    this.dlog(`${logMod(this.addToGroup.name)} Args: ${[id, obj(data), createGroup]}`)
    // handle 'controlGroupStealing' setting
    if (this.config.get(Configuration.SETTINGS.GROUP_STEALING)) {
      const stealMark = this.getMarkToSteal(mark)
      if (Array.isArray(stealMark)) {
        const [groupId, markIdx] = stealMark
        this.dlog(`${logMod(this.addToGroup.name)} Stealing mark, groupId: ${groupId}, markIdx: ${markIdx}`)
        this.groups[groupId] = {
          lastMarkId: this.FIRST_MARK_ID, // reset to first after stealing from the group
          marks: this.groups[groupId].marks.filter((_, i) => i !== markIdx)
        }
        if (this.groups[groupId].marks.length === 0) {
          delete this.groups[groupId]
        }
      }
    }
    this.state.activeGroupId = id
    const target = this.groups[id.toString()]
    // create mode (delete entire group and add this mark to it)
    if (createGroup || !target) {
      this.groups[id.toString()] = {
        lastMarkId: this.FIRST_MARK_ID,
        marks: [mark],
      }
      return this.status.update(this.formatState())
    }
    const duplicate = target.marks.find((m) => compareObj(m.data, data))
    if (duplicate) return
    if (target.marks.length === this.MAX_MARKS_PER_GROUP) return
    // add mode
    this.groups[id.toString()] = {
      lastMarkId: target.marks.length,
      marks: [...target.marks, mark],
    }
    this.status.update(this.formatState())
  }

  cycle(backwards: boolean = false) {
    const activeGroupId = this.state.activeGroupId
    const target = this.groups[activeGroupId]
    this.dlog(`${logMod(this.cycle.name)} Args: ${[backwards]}`)
    if (isNullish(target) || isEmpty(target.marks)) return
    const isSingleMarkGroup = target.marks.length <= 1
    if (isSingleMarkGroup) return
    const nextId = backwards ? target.lastMarkId - 1 : target.lastMarkId + 1
    const nextMark = target.marks[nextId]
    if (!nextMark) {
      this.dlog(`${logMod(this.cycle.name)} no next, back to 1st`)
      const fullCycleId = backwards ? target.marks.length - 1 : this.FIRST_MARK_ID
      target.lastMarkId = fullCycleId
      return this.jumpToGroup(activeGroupId, fullCycleId)
    }
    this.dlog(`${logMod(this.cycle.name)} OK (${target.lastMarkId} -> ${nextId})`)
    target.lastMarkId = nextId
    this.jumpToGroup(activeGroupId, nextId)
  }
}
