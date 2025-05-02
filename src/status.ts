import * as vscode from "vscode"
import { ExtensionCommand } from "./enums"

export class StatusBar implements vscode.Disposable {
  static readonly DEFAULT_LABEL_ON = "(CG)"
  static readonly DEFAULT_LABEL_OFF = "(CG OFF)"
  status: vscode.StatusBarItem

  constructor() {
    this.status = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      Number.MAX_VALUE,
    )
    this.status.text = StatusBar.DEFAULT_LABEL_ON
    this.status.name = "Sc2 Control Groups Status"
    this.status.command = `${ExtensionCommand.TOGGLE_EXTENSION}`
    this.status.show()
  }

  update(text: string) {
    this.status.text = text
    this.status.show()
  }

  dispose() {
    this.status.dispose()
  }
}
