import * as vscode from 'vscode';
import Manifest from './android/manifest';

export default class ExtensionProperties {
  private static instance: ExtensionProperties;

  private constructor(public workspacePath: string, public manifest: Manifest, private packageName: string ) { }

  public static getInstance(): ExtensionProperties {
    return ExtensionProperties.instance;
  }

  public getPackageName(): string {
    return this.packageName;
  }

  public static async build() {
    if (!ExtensionProperties.instance) {
      const workspacePath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri?.fsPath : '';
      const manifestPath = `${workspacePath}/app/src/main/AndroidManifest.xml`;
      const manifest = new Manifest(manifestPath);
      const packageName = await manifest.getPackageName() || '';
      ExtensionProperties.instance = new ExtensionProperties(workspacePath, manifest, packageName);
    }
    return ExtensionProperties.instance;
  }
}