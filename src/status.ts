import * as vscode from 'vscode';
import { statusEmitter } from './events';

export class StatusText {

  public status

  constructor() {
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER -1)
    this.status.text = '| CG |'
    this.status.show()

    statusEmitter.event((newStatus: string) => {
      this.update(newStatus)
    })
  }

  update(text: string) {
    this.status.text = text
    this.status.show()
  }
}