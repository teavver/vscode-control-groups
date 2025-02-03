import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';

export function activate(context: vscode.ExtensionContext) {

    const vim = vscode.extensions.getExtension('vscodevim.vim')
    if (!vim) {
        throw new Error('VSCODE vimExt EERROR')
    }

    const sm = new StateManager();

    // setInterval(() => {
    //     console.log('==========')
    //     console.log(sm.state)
    //     console.log('==========')
    // }, 2000)

    const createControlGroup = vscode.commands.registerCommand('extension.createControlGroup', async (args) => {

        const { id } = args
        console.log(`Start > Crekte conlrol group: ${id}`)

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const position = selection.active;

            const mark: MarkData = {
                uri: document.uri.toString(),
                line: position.line,
                char: position.character,
            };
            console.log('End > create ctrl group ', JSON.stringify(mark, null, 2))
            sm.createGroup(id, mark)
        } else {
            console.error('No active text editor found.');
        }
    });

    const focusControlGroup = vscode.commands.registerCommand('extension.setActiveControlGroup', (args) => {
        const { id } = args
        console.log(`> JUMP ${id}`)
        sm.jumpToGroup(id)
    });

    context.subscriptions.push(...[createControlGroup, focusControlGroup]);
}

export function deactivate() {}
