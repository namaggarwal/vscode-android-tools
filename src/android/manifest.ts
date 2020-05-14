import * as fs from 'fs';
import * as vscode from 'vscode';

export default class Manifest {
  constructor(private path: string) { }

  private async getManifestText(): Promise<string> {
    const manifestFile = vscode.Uri.file(this.path);
    const document = await vscode.workspace.openTextDocument(manifestFile);
    return document.getText();
  }

  async getPackageName(): Promise<string | null> {
    const text = await this.getManifestText();
    const packageReg = /package=\"(.*)\"/;
    const res = packageReg.exec(text);
    return Promise.resolve(res && res[1]);
  }

  async addActivity(packageName: string, activityName: string) {
    let text = await this.getManifestText();
    const reg = /<activity/;
    const res = reg.exec(text);
    if (!res) { return; }

    const actIndex = res.index;
    text = `${text.substr(0, actIndex)}<activity android:name="${packageName}.${activityName}"></activity>\n${text.substr(actIndex)}`;
    fs.writeFileSync(this.path, text);
  }
}

