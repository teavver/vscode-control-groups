import * as vscode from "vscode"
import { MarkData } from "./types"

export class Mark {
  readonly data: MarkData

  constructor(data: MarkData) {
    this.data = data
  }

  static getMarkTabGroup(mark: MarkData): vscode.TabGroup | undefined {
    const allTabGroups = vscode.window.tabGroups.all
    const activeGroup = vscode.window.tabGroups.activeTabGroup

    for (const group of allTabGroups) {
      if (group.viewColumn === activeGroup.viewColumn) {
        continue // Same tab group, don't jump
      }

      const activeTab = group.activeTab
      if (!activeTab) {
        continue // No tab group found
      }

      const input = activeTab.input
      if (typeof input === "object" && input !== null && "uri" in input) {
        const tabUri = (input as any).uri as vscode.Uri
        if (tabUri.toString() === mark.uri) {
          return group
        }
      }
    }
    return undefined
  }

  static reveal(editor: vscode.TextEditor, markData: MarkData) {
    const pos = new vscode.Position(markData.line, markData.char)
    const sel = new vscode.Selection(pos, pos)
    editor.selection = sel
    editor.revealRange(new vscode.Range(pos, pos))
  }

  static async jump(mark: Mark, options?: vscode.TextDocumentShowOptions) {
    const uri = vscode.Uri.parse(mark.data.uri)
    const document = await vscode.workspace.openTextDocument(uri)
    const editor = await vscode.window.showTextDocument(document, options)
    this.reveal(editor, mark.data)
  }
}
