import { InputBoxOptions, CancellationToken } from "vscode";

export interface VSCodeWindow {
  showInputBox(options?: InputBoxOptions, token?: CancellationToken): Thenable<string | undefined>
}

export interface Templater {
  renderTemplateFile(path: string, options: any): Promise<string>
}