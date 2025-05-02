import { Mark } from "./mark"

export type Logger = (...args: any) => void

export type ConfigVal = string | boolean | undefined

export type Config = Record<string, ConfigVal>

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
  groups: Map<ControlGroupData>
}

export interface ControlGroupData {
  marks: Mark[]
  lastMarkId: number
}
