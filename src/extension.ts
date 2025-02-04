import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { isError, getMarkData } from './util';

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

    const createControlGroup = vscode.commands.registerCommand('sc2.createControlGroup', async (args) => {
        const { id } = args
        console.log(`Start > Crekte conlrol group: ${id}`)
        const mark = getMarkData()
        if (isError<MarkData>(mark)) throw new Error(mark.message)
        sm.createGroup(id, mark)
    });

    const newControlGroup = vscode.commands.registerCommand('sc2.newControlGroup', async (args) => {

    })

    const focusControlGroup = vscode.commands.registerCommand('sc2.setActiveControlGroup', (args) => {
        const { id } = args
        console.log(`> JUMP ${id}`)
        sm.jumpToGroup(id)
    });

    context.subscriptions.push(...[createControlGroup, newControlGroup, focusControlGroup]);
}

export function deactivate() {}
