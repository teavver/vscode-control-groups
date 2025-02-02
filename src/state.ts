import { Map, ControlGroupData, ExtensionState } from './types';
import { isEmpty } from './util';

export class StateManager {

  public groups: Map<ControlGroupData>;
  public state: ExtensionState;
  
  constructor() {
    this.groups = {};
    this.state = {
      activeGroupId: -1,
    }
  }
  public focusGroup(id: number) {
    if (isEmpty(this.groups[id].marks)) return
    this.state = {
      ...this.state,
      activeGroupId: id,
    }
  }

  public createGroup(id: number) {
    this.groups[id.toString()] = {
      marks: [`CONTROL GROUP ${id}`]
    }
  }

}
