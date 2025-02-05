import { Mark } from './mark';
import { Map, ControlGroupData, ExtensionState, MarkData } from './types';
import { isEmpty, isNullish,  } from './util';

export class StateManager {

  private FIRST_MARK_ID = 0
  groups: Map<ControlGroupData>
  state: ExtensionState
  
  constructor() {
    this.groups = {}
    this.state = {
      activeGroupId: -1,
    }
  }

  jumpToGroup(id: number, markId?: number) {
    const target = this.groups[id.toString()]
    if (isNullish(target) || isEmpty(target.marks)) return
    this.state.activeGroupId = id
    // Jump to most-recent mark in group by default
    const idx = markId ?? this.groups[id.toString()].lastMarkId
    const mark = this.groups[id].marks[idx]
    this.groups[id].lastMarkId = idx
    mark.jump()
  }

  addToGroup(id: number, data: MarkData, createGroup: boolean = false) {
    this.state.activeGroupId = id
    const mark = new Mark(data)
    const target = this.groups[id.toString()]
    // Create mode
    if (createGroup || !target) {
      return this.groups[id.toString()] = {
        lastMarkId: this.FIRST_MARK_ID,
        marks: [mark]
      }
    }
    // Add mode
    return this.groups[id.toString()] = {
      lastMarkId: target.marks.length,
      marks: [...target.marks, mark]
    }
  }

  cycle(backwards: boolean = false) {
    // TODO : handle backwards (shift + tab)
    const activeGroupId = this.state.activeGroupId
    const target = this.groups[activeGroupId]
    if (isNullish(target) || isEmpty(target.marks)) {
      console.log('[CYCLE] ---- cannot cycle --- ')
      return
    }
    const isSingleMarkGroup = target.marks.length <= 1
    if (isSingleMarkGroup) return
    const nextId = target.lastMarkId + 1
    const nextMark = target.marks[nextId]
    if (!nextMark) {
      console.log('[CYCLE] no next mark - jump to start')
      target.lastMarkId = this.FIRST_MARK_ID
      return this.jumpToGroup(activeGroupId, this.FIRST_MARK_ID)
    }
    console.log('[CYCLE] nextid: ', nextId)
    target.lastMarkId = nextId
    this.jumpToGroup(activeGroupId, nextId)
  }
}
