import { Mark } from "./mark";

export interface MarkData {
  uri: string
  line: number
  char: number
}

export interface Map<T> {
  [key: string]: T
}

export interface ExtensionState {
  activeGroupId: number
}

export interface ControlGroupData {
  marks: Mark[]
  lastMarkId: number
}
