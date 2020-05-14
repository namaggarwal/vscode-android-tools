import * as vscode from 'vscode';
import ExtensionProperties from '../init';
import { Command } from './commands.interface';
import { VSCodeWindow } from '../vscode.interfaces';
import { IAndroid } from '../android';

export class NewActivity implements Command {
	constructor(
		private window: VSCodeWindow,
		private properties: ExtensionProperties,
		private android: IAndroid,
	) { }

	async execute(): Promise<void> {
		const title = await this.window.showInputBox({
			value: 'MainActivity',
			valueSelection: [0, 20],
			placeHolder: 'Activity Name'
		});

		if (!title) {
			return;
		}
		const basePath = vscode.Uri.parse(this.properties.workspacePath);
		const activityPath = vscode.Uri.joinPath(basePath, `app/src/main/java`, ...this.properties.package.split('.'));
		const layoutPath = vscode.Uri.joinPath(basePath, 'app/src/main/res/layout');

		await this.android.createActivity(activityPath.fsPath, this.properties.package, title);
		await this.android.createLayout(layoutPath.fsPath,this.properties.package, title);

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from android-tools!');

	}

}
