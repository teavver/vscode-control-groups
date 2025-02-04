import * as vscode from "vscode";
import { MarkData } from "./types";

export const isEmpty = <T>(arr: Array<T>) => (!Array.isArray(arr) || !arr.length);

export const isError = <T>(val: T | Error): val is Error => val instanceof Error

export const getMarkData = (): Error | MarkData => {
  try {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return new Error(`cannot getPosition - no editor open`)
    const sel = editor.selection;
    const pos = sel.active;
    return {
      uri: editor.document.uri.toString(),
      line: pos.line,
      char: pos.character,
    }
  } catch (err) {
    return err as Error
  }
}