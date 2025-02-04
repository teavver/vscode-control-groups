import { Mark } from './mark';
import { Map, ControlGroupData, ExtensionState, MarkData } from './types';
import { isEmpty, isNullish } from './util';

export class StateManager {

  groups: Map<ControlGroupData>;
  state: ExtensionState;
  
  constructor() {
    this.groups = {};
    this.state = {
      activeGroupId: -1,
    }
  }

  jumpToGroup(id: number) {
    const target = this.groups[id]
    if (isNullish(target) || isEmpty(target.marks)) return
    this.state.activeGroupId = id
    // TODO: jump to last visited (active), not first
    const first = this.groups[id].marks[0]
    first.jump()
  }

  addToGroup(id: number, data: MarkData, createGroup: boolean = false) {
    this.state.activeGroupId = id
    const mark = new Mark(data)
    const target = this.groups[id.toString()]
    // Create mode
    if (createGroup || !target) {
      return this.groups[id.toString()] = {
        lastMarkId: 1,
        marks: [mark]
      }
    }
    // Add mode
    const existingMarks = target.marks
    return this.groups[id.toString()] = {
      lastMarkId: existingMarks.length + 1,
      marks: [...existingMarks, mark]
    }
  }
}
