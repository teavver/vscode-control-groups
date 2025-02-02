import * as vscode from 'vscode';
import { StateManager } from './state';

export function activate(context: vscode.ExtensionContext) {

    const storage = context.workspaceState;
    const sm = new StateManager();

    const disposableCtrl1 = vscode.commands.registerCommand('extension.createControlGroup', async () => {
        console.log('Control Group Created');
        sm.createGroup(1)
        console.log(sm.state)
    });

    const disposableJump = vscode.commands.registerCommand('extension.jumpToControlGroup', () => {
        if (sm.state.active === 1 && sm.state.selected === 1)  {
            console.log("JUMP 1")
        }
        else {
            sm.focusGroup(1)
            console.log("SET FOCUSED 1")
        }
    });

    context.subscriptions.push(...[disposableCtrl1, disposableJump]);
}

export function deactivate() {}
