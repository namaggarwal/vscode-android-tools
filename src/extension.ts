// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ExtensionProperties from './init';
import { NewActivity } from './commands/new-activity';
import { Android } from './android';
import * as template from 'template-file';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	const properties = await ExtensionProperties.build();
	const android = new Android(template);
	let disposable = vscode.commands.registerCommand('android.newActivity', () => {
		new NewActivity(vscode.window, properties,android).execute();
	});

	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() { }
