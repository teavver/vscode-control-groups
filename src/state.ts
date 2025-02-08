import { Mark } from "./mark";
import { Map, Logger, ControlGroupData, ExtensionState, MarkData } from "./types";
import { isEmpty, isNullish, obj, logMod, compareObj } from "./util";
import { StatusBar } from "./status";

export class StateManager {
  private readonly dlog: Logger
  private readonly status: StatusBar
  private readonly FIRST_MARK_ID = 0
  private readonly MAX_MARKS_PER_GROUP = 9 // if you're cycling through 9+ marks you're really missing the point
  private readonly SUP: { [k: number]: string } = {
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

  constructor(dlog: Logger, status: StatusBar) {
    this.dlog = dlog
    this.status = status
    this.groups = {}
    this.state = {
      activeGroupId: -1,
    }
  }

  formatState() {
    const nonEmptyGroups = Object.keys(this.groups)
    if (nonEmptyGroups.length === 0) return StatusBar.DEFAULT_LABEL_ON
    const activeGroup = this.state.activeGroupId.toString()
    const groupMarkCounts = nonEmptyGroups.map((id) => this.groups[id].marks.length)
    return `| ${nonEmptyGroups.map((group, idx) =>
      group === activeGroup
        ? ` *${group}${this.SUP[groupMarkCounts[idx]]} `
        : ` ${group}${this.SUP[groupMarkCounts[idx]]} `
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
    this.state.activeGroupId = id
    const mark = new Mark(data)
    const target = this.groups[id.toString()]
    this.dlog(`${logMod(this.addToGroup.name)} Args: ${[id, obj(data), createGroup]}`)
    // create mode (delete entire group and add this mark to it)
    if (createGroup || !target) {
      this.groups[id.toString()] = {
        lastMarkId: this.FIRST_MARK_ID,
        marks: [mark],
      }
      return this.status.update(this.formatState())
    } else {
      const duplicate = target.marks.find((mark) =>
        compareObj(mark.data, data)
      )
      if (duplicate) return
      if (target.marks.length === this.MAX_MARKS_PER_GROUP) return
      // add mode
      this.groups[id.toString()] = {
        lastMarkId: target.marks.length,
        marks: [...target.marks, mark],
      }
    }
    return this.status.update(this.formatState())
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
      target.lastMarkId = this.FIRST_MARK_ID
      return this.jumpToGroup(activeGroupId, this.FIRST_MARK_ID)
    }
    this.dlog(`${logMod(this.cycle.name)} OK (${target.lastMarkId} -> ${nextId})`)
    target.lastMarkId = nextId
    this.jumpToGroup(activeGroupId, nextId)
  }
}
