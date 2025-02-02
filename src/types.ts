
export interface Map<T> {
  [key: string]: T
}

export interface ExtensionState {
  activeGroupId: number
}

export interface ControlGroupData {
  marks: string[]; // Vscode-vim ids
}
