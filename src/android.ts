import { Templater } from "./vscode.interfaces";
import * as fs from 'fs';
import Activity from "./android/activity";
import Layout from "./android/layout";
import Manifest from "./android/manifest";

export interface IAndroid {
  createLayout(path: string, packageName: string, title: string): Promise<Layout>;
  createActivity(path: string, packageName: string, activityName: string, manifest: Manifest): Promise<Activity>
}

export class Android implements IAndroid {

  constructor(private template: Templater) { }

  async createLayout(path: string, packageName: string, title: string): Promise<Layout> {
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

  async createActivity(path: string, packageName: string, title: string, manifest: Manifest): Promise<Activity> {
    return new Promise(async (res, rej) => {
      const activityName = Android.getActivityName(title);
      const layoutName = Android.getLayoutName(title);
      const activity = await this.template.renderTemplateFile(`${__dirname}/templates/new-activity`, { activityName, packageName, layoutName });
      path = `${path}/${activityName}.java`;

      fs.writeFile(path, activity, async (err) => {
        if (err) {
          rej(err);
          return;
        }
        await manifest.addActivity(packageName, activityName);
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


