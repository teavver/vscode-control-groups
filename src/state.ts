import { Mark } from './mark';
import { statusEmitter } from './events';
import { Map, ControlGroupData, ExtensionState, MarkData } from './types';
import { isEmpty, isNullish, obj, logMod } from './util';

export class StateManager {

  private DEBUG
  private FIRST_MARK_ID = 0
  public groups: Map<ControlGroupData>
  public state: ExtensionState
  
  constructor(DEBUG: boolean) {
    this.DEBUG = DEBUG
    this.groups = {}
    this.state = {
      activeGroupId: -1,
    }
  }

  private logState() {
    console.log(`State: ${JSON.stringify(this.state, null, 4)}\nGroups: ${JSON.stringify(this.groups, null, 4)}`)
  }

  formatState(): string {
    const nonEmptyGroups = Object.keys(this.groups)
    const activeGroup = this.state.activeGroupId.toString()
    // TODO: nice looking status, align properly
    return `-${nonEmptyGroups.map((group) => group === activeGroup ? `[ ${group} ]` : ` ${group} `)}-`
  }

  jumpToGroup(id: number, markId?: number) {
    const target = this.groups[id.toString()]
    if (isNullish(target) || isEmpty(target.marks)) return
    this.state.activeGroupId = id
    // Jump to most-recently visited/added mark in group by default
    const idx = isNullish(markId) ? this.groups[id.toString()].lastMarkId : markId
    if (this.DEBUG) console.log(`${logMod(this.jumpToGroup.name)} Args: ${[id, markId]} Jump idx: ${idx}`)
    const mark = this.groups[id].marks[idx]
    this.groups[id].lastMarkId = idx
    mark.jump()
    statusEmitter.fire(this.formatState())
  }

  addToGroup(id: number, data: MarkData, createGroup: boolean = false) {
    this.state.activeGroupId = id
    const mark = new Mark(data)
    const target = this.groups[id.toString()]
    // Create mode (Override existing)
    if (this.DEBUG) console.log(`${logMod(this.addToGroup.name)} Args: ${[id, obj(data), createGroup]}`)
    if (createGroup || !target) {
      this.groups[id.toString()] = {
        lastMarkId: this.FIRST_MARK_ID,
        marks: [mark]
      }
      return statusEmitter.fire(this.formatState())
    }
    // Add mode
    this.groups[id.toString()] = {
      lastMarkId: target.marks.length,
      marks: [...target.marks, mark]
    }
    return statusEmitter.fire(this.formatState())
  }

  cycle(backwards: boolean = false) {
    const activeGroupId = this.state.activeGroupId
    const target = this.groups[activeGroupId]
    if (this.DEBUG) console.log(`${logMod(this.cycle.name)} Args: ${[backwards]}`)
    if (isNullish(target) || isEmpty(target.marks)) return
    const isSingleMarkGroup = target.marks.length <= 1
    if (isSingleMarkGroup) return
    const nextId = backwards
      ? target.lastMarkId - 1
      : target.lastMarkId + 1
    const nextMark = target.marks[nextId]
    if (!nextMark) {
      if (this.DEBUG) console.log(`${logMod(this.cycle.name)} no next, back to 1st`)
      target.lastMarkId = this.FIRST_MARK_ID
      return this.jumpToGroup(activeGroupId, this.FIRST_MARK_ID)
    }
    if (this.DEBUG) console.log(`${logMod(this.cycle.name)} OK (${target.lastMarkId} -> ${nextId})`)
    target.lastMarkId = nextId
    this.jumpToGroup(activeGroupId, nextId)
  }
}
