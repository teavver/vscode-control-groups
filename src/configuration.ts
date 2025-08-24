import * as vscode from "vscode"
import { ConfigurationChangeEvent } from "vscode"
import { Config, ConfigVal, Logger } from "./types"
import { EXTENSION_PREFIX, ExtensionConfig } from "./enums"
import { isInEnum, logMod, obj } from "./util"

export class Configuration {
  dlog: Logger
  config: Config = {}

  constructor(dlog: Logger) {
    this.dlog = dlog
    const config = vscode.workspace.getConfiguration(EXTENSION_PREFIX)
    dlog(`loaded configuration: ${obj(config)}`)
    for (const key of Object.keys(config)) {
      if (typeof key === "string" && isInEnum(ExtensionConfig, key)) {
        dlog("config: setting ", config[key], " with: ", key)
        this.set(key, config[key])
      }
    }
    this.dlog(`Configuration: ${obj(this.config)}`)
  }

  private handleConfigChange(
    event: ConfigurationChangeEvent,
    configSetting: ExtensionConfig,
  ) {
    if (event.affectsConfiguration(`${EXTENSION_PREFIX}.${configSetting}`)) {
      const newVal = vscode.workspace
        .getConfiguration("sc2")
        .get<boolean>(configSetting)
      this.set(configSetting, newVal)
      this.dlog(
        `${logMod(this.handleConfigChange.name)} (${configSetting})'s new value is: ${newVal}`,
      )
    }
  }

  handleConfigChanges(event: ConfigurationChangeEvent) {
    // Control Group Stealing
    this.handleConfigChange(event, ExtensionConfig.GROUP_STEALING)
    // Prefer Tab Focus In Split Views
    this.handleConfigChange(event, ExtensionConfig.PREFER_TAB_FOCUS_SPLIT)
    // Update Current Mark Before Jumping
    this.handleConfigChange(event, ExtensionConfig.UPDATE_MARK_BEFORE_JUMP)
  }

  get(key: string): ConfigVal | undefined {
    return this.config[key]
  }

  set(key: string, val: ConfigVal | undefined) {
    this.config[key] = val
  }
}
