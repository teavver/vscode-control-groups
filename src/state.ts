import * as vscode from 'vscode';
import { Map, ControlGroupData, ExtensionState } from './types';

export class StateManager {

  private FOCUS_TIMEOUT_MS = 300
  public groups: Map<ControlGroupData>;
  public state: ExtensionState;
  
  constructor() {
    this.groups = {};
    this.state = {
      active: -1,
      selected: -1,
    }
  }

  private revokeActiveStatus(id: number) {
    if (this.state.active === id) {
      this.state.active = -1
    }
  }

  public focusGroup(id: number) {
    this.state = {
      ...this.state,
      active: id,
      selected: id,
    }
    setTimeout(() => this.revokeActiveStatus(id), this.FOCUS_TIMEOUT_MS)
  }

  public createGroup(id: number) {
    this.groups[id.toString()] = {
      marks: [`CONTROL GROUP ${id}`]
    }
  }

}
