import * as vscode from 'vscode';
import { ConfigurationChangeEvent } from 'vscode';
import { Config, ConfigVal, Logger } from './types';
import { logMod, obj } from './util';

export class Configuration {

  dlog: Logger
  public config: Config = {}

  public static readonly SETTINGS = {
    GROUP_STEALING: 'controlGroupStealing',
    NORMAL_MODE_ON_FILE_CHANGE: 'normalModeOnFileChange',
  }

  constructor(dlog: Logger) {
    this.dlog = dlog
    const config = vscode.workspace.getConfiguration('sc2')
    for (const key of Object.keys(config)) {
      if (typeof key === 'string' && Object.values(Configuration.SETTINGS).includes(key)) {
        this.set(key, config[key])
      }
    }
    this.dlog(`Configuration: ${obj(this.config)}`)
  }

  handleConfigChanges(event: ConfigurationChangeEvent) {
    // control group stealing
    if (event.affectsConfiguration(`sc2.${Configuration.SETTINGS.GROUP_STEALING}`)) {
      const newVal = vscode.workspace.getConfiguration('sc2').get<boolean>(Configuration.SETTINGS.GROUP_STEALING)
      this.set(Configuration.SETTINGS.GROUP_STEALING, newVal)
      this.dlog(`${logMod(this.handleConfigChanges.name)} (${Configuration.SETTINGS.GROUP_STEALING}) changed to: ${newVal}`)
    }

    if (event.affectsConfiguration(`sc2.${Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE}`)) {
      const newVal = vscode.workspace.getConfiguration('sc2').get<boolean>(Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE)
      this.set(Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE, newVal)
      this.dlog(`${logMod(this.handleConfigChanges.name)} (${Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE}) changed to: ${newVal}`)
    }
  }

  get(key: string): ConfigVal | undefined {
    return this.config[key]
  }

  set(key: string, val: ConfigVal | undefined) {
    this.config[key] = val
  }
}