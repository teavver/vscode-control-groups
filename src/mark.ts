import * as vscode from 'vscode';
import { MarkData } from './types';

export class Mark {

  readonly data: MarkData

  constructor(data: MarkData) {
    this.data = data
  }

  static async jump(mark: Mark) {
    const uri = vscode.Uri.parse(mark.data.uri)
    const document = await vscode.workspace.openTextDocument(uri)
    const editor = await vscode.window.showTextDocument(document)
    const pos = new vscode.Position(mark.data.line, mark.data.char)
    const sel = new vscode.Selection(pos, pos)
    editor.selection = sel
    editor.revealRange(new vscode.Range(pos, pos))
  }
}