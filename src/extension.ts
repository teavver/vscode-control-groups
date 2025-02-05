import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { isError, createMarkFromPos, isNullish } from './util';

export function activate(context: vscode.ExtensionContext) {

    const vim = vscode.extensions.getExtension('vscodevim.vim')
    if (!vim) throw new Error('VSCODE vimExt EERROR')

    const sm = new StateManager();

    // setInterval(() => {
    //     console.log('==========')
    //     console.log(sm.state)
    //     console.log('==========')
    // }, 2000)

    const addToControlGroup = vscode.commands.registerCommand('sc2.addToControlGroup', async (args) => {
        const { id, createGroup } = args
        console.log(`[addToControlGroup]: id: ${id} , createGroup: ${createGroup}`)
        const mark = createMarkFromPos()
        if (isNullish(id) || isNullish(createGroup)) throw new Error(`[addToControlGroup] Missing 'id' or 'createGroup' argument`)
        if (isError<MarkData>(mark)) throw new Error(mark.message)
        if (createGroup) {
            sm.addToGroup(id, mark, true)
            return console.log(sm.groups[id])
        }
        sm.addToGroup(id, mark)
        console.log(sm.groups[id])
    });

    const jumpToControlGroup = vscode.commands.registerCommand('sc2.jumpToControlGroup', (args) => {
        const { id } = args
        console.log(`[jumpToControlGroup]: id: ${id}`)
        sm.jumpToGroup(id)
    });

    const cycleControlGroup = vscode.commands.registerCommand('sc2.cycleControlGroup', (args) => {
        const { id, direction } = args
        // console.log(`[]: id: ${id}`)
    });

    context.subscriptions.push(...[addToControlGroup, jumpToControlGroup]);
}

export function deactivate() {}
