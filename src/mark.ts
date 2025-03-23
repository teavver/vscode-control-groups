import * as vscode from 'vscode';
import { MarkData } from './types';

export class Mark {

  readonly data: MarkData

  constructor(data: MarkData) {
    this.data = data
  }

  async jump() {
    const uri = vscode.Uri.parse(this.data.uri)
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    const pos = new vscode.Position(this.data.line, this.data.char);
    const sel = new vscode.Selection(pos, pos);
    editor.selection = sel;
    editor.revealRange(new vscode.Range(pos, pos));
  }
}