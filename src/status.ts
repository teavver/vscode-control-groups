import * as vscode from 'vscode';

export class StatusBar implements vscode.Disposable {

  public static readonly DEFAULT_LABEL_ON = '| CG |'
  public static readonly DEFAULT_LABEL_OFF = '| CG OFF |'
  public status: vscode.StatusBarItem

  constructor() {
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER)
    this.status.text = StatusBar.DEFAULT_LABEL_ON
    this.status.name = 'Control Groups Status'
    this.status.command = 'sc2.toggle'
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