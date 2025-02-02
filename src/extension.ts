import * as vscode from 'vscode';
import { StateManager } from './state';

export function activate(context: vscode.ExtensionContext) {

    // const storage = context.workspaceState;
    const sm = new StateManager();

    // setInterval(() => {
    //     console.log('==========')
    //     console.log(sm.state)
    //     console.log(sm.groups)
    //     console.log('==========')
    // }, 500)

    const createControlGroup = vscode.commands.registerCommand('extension.createControlGroup', async (args) => {
        const { id } = args
        console.log(`Crekte conlrol group: ${id}`)
        sm.createGroup(id)
    });

    const focusControlGroup = vscode.commands.registerCommand('extension.setActiveControlGroup', (args) => {
        console.log('>>>>>>>>> FOCUS CONTROLK GROUP')
        const { id } = args
        if (sm.state.activeGroupId === 1) {
            console.log(`JUMP ${id}`)
        }
        else {
            sm.focusGroup(1)
            console.log(`SET ACTIVE ${id}`)
        }
    });

    context.subscriptions.push(...[createControlGroup, focusControlGroup]);
}

export function deactivate() {}
