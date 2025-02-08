import * as vscode from 'vscode';
import { statusEmitter } from './events';

export class StatusText implements vscode.Disposable {

  public static readonly DEFAULT_LABEL_ON = '| CG |'
  public static readonly DEFAULT_LABEL_OFF = '| CG OFF |'
  public status: vscode.StatusBarItem

  constructor() {
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER)
    this.status.text = StatusText.DEFAULT_LABEL_ON
    this.status.name = 'Control Groups Status'
    this.status.command = 'sc2.toggle'
    this.status.show()

    statusEmitter.event((newStatus: string) => {
      this.update(newStatus)
    })
    return this
  }

  update(text: string) {
    this.status.text = text
    this.status.show()
  }

  dispose() {
    this.status.dispose()
  }
}