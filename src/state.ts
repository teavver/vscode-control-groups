import { Mark } from './mark';
import { Map, ControlGroupData, ExtensionState, MarkData } from './types';
import { isEmpty } from './util';

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
    if (isEmpty(this.groups[id].marks)) return
    this.state.activeGroupId = id
    const first = this.groups[id].marks[0]
    first.jump()
  }

  createGroup(id: number, data: MarkData) {
    this.state.activeGroupId = id
    const mark = new Mark(data)
    this.groups[id.toString()] = {
      marks: [mark]
    }
  }

}
