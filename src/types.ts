
export interface Map<T> {
  [key: string]: T
}

export interface ExtensionState {
  selected: number // single press = select
  active: number // active = wait threshold for jump
}

export interface ControlGroupData {
  marks: string[]; // Vscode-vim ids
}
