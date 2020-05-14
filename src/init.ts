import * as vscode from 'vscode';
import * as xml from 'xml-js';

export default class ExtensionProperties {
  private static instance: ExtensionProperties;
  readonly package: string;
  readonly workspacePath: string;

  private constructor(workspacePath: string, document: vscode.TextDocument) {
    const result = xml.xml2js(document.getText());
    this.package  = result.elements[0].attributes.package;
    this.workspacePath = workspacePath;
  }

  public static getInstance(): ExtensionProperties {
    return ExtensionProperties.instance;
  }

  public static async build() {
    if (!ExtensionProperties.instance) {
      const workspacePath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri?.fsPath : '';
      const manifestFile = vscode.Uri.file(`${workspacePath}/app/src/main/AndroidManifest.xml`);
      const document = await vscode.workspace.openTextDocument(manifestFile);
      ExtensionProperties.instance = new ExtensionProperties(workspacePath, document);
    }
    return ExtensionProperties.instance;
  }
}