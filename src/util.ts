import * as vscode from "vscode"
import { MarkData, Logger } from "./types"

export const logMod = (name: string) => `[${name}]:`

export const obj = (json: object) => JSON.stringify(json, null, 4)

export const isInEnum = <T extends object>(
  _enum: T,
  val: unknown,
): val is T[keyof T] => Object.values(_enum).includes(val)

export const isEmpty = <T>(arr: Array<T>) => !Array.isArray(arr) || !arr.length

export const isError = <T>(val: T | Error): val is Error => val instanceof Error

export const isNullish = (val: any): val is undefined | null =>
  val === undefined || val === null

export const compareObj = (obj1: object, obj2: object) =>
  JSON.stringify(obj1) === JSON.stringify(obj2)

export const createDebugLogger = (context: vscode.ExtensionContext): Logger => {
  const logger: Logger = (...args: any) => {
    if (context.extensionMode !== vscode.ExtensionMode.Development) return
    console.log(args)
  }
  return logger
}

export const createMarkFromPos = (): Error | MarkData => {
  try {
    const editor = vscode.window.activeTextEditor
    if (!editor) return new Error("cannot getPosition - no editor open")
    const sel = editor.selection
    const pos = sel.active
    return {
      uri: editor.document.uri.toString(),
      line: pos.line,
      char: pos.character,
    }
  } catch (err) {
    return err as Error
  }
}
