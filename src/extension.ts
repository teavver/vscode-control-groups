import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {

	const state = context.globalState;
	console.log(state.keys(), typeof state)

	// const disposable = vscode.commands.registerCommand('d.helloWorld', () => {
	// 	vscode.window.showInformationMessage(`res: ${JSON.stringify(a, null, 2)}, type ${typeof a}`);
	// });

	// context.subscriptions.push(disposable);
}

export function deactivate() {}
