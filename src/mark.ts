import * as vscode from 'vscode';
import { MarkData } from './types';

export class Mark {

  readonly data: MarkData

  constructor(data: MarkData) {
    this.data = data
  }

  jump() {
    const uri = vscode.Uri.parse(this.data.uri)
    vscode.workspace.openTextDocument(uri).then(document => {
        vscode.window.showTextDocument(document).then(editor => {
            const pos = new vscode.Position(this.data.line, this.data.char)
            const sel = new vscode.Selection(pos, pos)
            editor.selection = sel
            editor.revealRange(new vscode.Range(pos, pos))
        })
    })
  }
}