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

  cycleGroup(id: number) {
    // WIP
    const target = this.groups[id.toString()]
    const isTargetActive = this.state.activeGroupId === id
    const isSingleMarkGroup = target.marks.length <= 1
    if (
      isNullish(target)
      || isEmpty(target.marks)
      || !isTargetActive
      || isSingleMarkGroup
    ) return
    const nextId = target.lastMarkId + 1
    const nextMark = target.marks[nextId]
    if (!nextMark) {
      console.log('[CYCLE] no next mark - jump to start')
      this.jumpToGroup(id, this.FIRST_MARK_ID)
    }
    console.log('[CYCLE] nextid: ', nextId)
    this.jumpToGroup(id, nextId)
  }
}
