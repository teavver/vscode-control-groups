import * as vscode from 'vscode';
import { statusEmitter } from './events';

export class StatusText implements vscode.Disposable {

  public status

  constructor() {
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER)
    this.status.text = '| CG |'
    this.status.name = 'Control Groups Status'
    this.status.show()

    statusEmitter.event((newStatus: string) => {
      this.update(newStatus)
    })
  }

  update(text: string) {
    this.status.text = text
  }

  dispose() {
    this.status.dispose();
  }
}