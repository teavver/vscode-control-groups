import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const disposableCtrl1 = vscode.commands.registerCommand('extension.createControlGroup', () => {
        console.log('Control Group Created');
    });

    const disposableJump = vscode.commands.registerCommand('extension.jumpToControlGroup', () => {
        console.log('Jumped to Control Group');
    });

    context.subscriptions.push(...[disposableCtrl1, disposableJump]);
}

export function deactivate() {}
