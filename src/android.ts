import { Templater } from "./vscode.interfaces";
import * as fs from 'fs';

export interface IAndroid {
  createLayout(path: string, packageName: string, title: string): Promise<android.Layout>;
  createActivity(path: string, packageName: string, activityName: string): Promise<android.Activity>
}

export class Android implements IAndroid {

  constructor(private template: Templater) { }

  async createLayout(path: string, packageName: string, title: string): Promise<android.Layout> {
    return new Promise(async (res, rej) => {
      const activityName = Android.getActivityName(title);
      const layoutName = Android.getLayoutName(title);
      const layout = await this.template.renderTemplateFile(`${__dirname}/templates/new-layout`, { activityName, packageName });
      path = `${path}/${layoutName}.xml`;
      fs.writeFile(path, layout, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  async createActivity(path: string, packageName: string, title: string): Promise<android.Activity> {
    return new Promise(async (res, rej) => {
      const activityName = Android.getActivityName(title);
      const layoutName = Android.getLayoutName(title);
      const activity = await this.template.renderTemplateFile(`${__dirname}/templates/new-activity`, { activityName, packageName, layoutName });
      path = `${path}/${activityName}.java`;

      fs.writeFile(path, activity, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  static getActivityName(name: string): string {
    return `${name.replace(/(Activity)$/, '')}Activity`;
  }
  static getLayoutName(name: string): string {
    return `activity_${name.toLocaleLowerCase().replace(/(activity)$/, '')}`;
  }
}


