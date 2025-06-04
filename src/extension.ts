import * as vscode from "vscode"
import { StateManager } from "./state"
import { MarkData } from "./types"
import { StatusBar } from "./status"
import {
  isError,
  createMarkFromPos,
  isNullish,
  logMod,
  createDebugLogger,
} from "./util"
import { Configuration } from "./configuration"
import { ExtensionCommand, ExtensionConfig } from "./enums"

export function activate(context: vscode.ExtensionContext) {
  const vimExtName = "vscodevim.vim"
  const vim = vscode.extensions.getExtension(vimExtName)
  if (!vim) throw new Error(`${vimExtName} extension is not installed`)
  let enabled = true
  const sb = new StatusBar()
  const dlog = createDebugLogger(context)
  const conf = new Configuration(dlog)
  const sm = new StateManager(context, dlog, conf, sb)

  const updateStatusBar = () => {
    enabled
      ? sb.update(sm.formatState())
      : sb.update(StatusBar.DEFAULT_LABEL_OFF)
  }

  const toggleExtensionCommand = vscode.commands.registerCommand(
    ExtensionCommand.TOGGLE_EXTENSION,
    () => {
      enabled = !enabled
      updateStatusBar()
    },
  )

  const resetGroupsCommand = vscode.commands.registerCommand(
    ExtensionCommand.RESET_CTRL_GROUPS,
    async () => {
      await sm.resetGroups()
    },
  )

  const addToControlGroup = vscode.commands.registerCommand(
    ExtensionCommand.ADD_TO_CTRL_GROUP,
    async (args: any) => {
      if (!enabled) return
      const id: number | undefined = args.id
      const createGroup: boolean | undefined = args.createGroup
      const mark = createMarkFromPos()
      if (isNullish(id) || isNullish(createGroup))
        throw new Error(
          `${logMod(ExtensionCommand.ADD_TO_CTRL_GROUP)} Missing 'id' or 'createGroup' arg`,
        )
      if (isError<MarkData>(mark))
        throw new Error(
          `${logMod(ExtensionCommand.ADD_TO_CTRL_GROUP)} ${mark.message}`,
        )
      sm.addToGroup(id, mark, createGroup)
    },
  )

  const jumpToControlGroup = vscode.commands.registerCommand(
    ExtensionCommand.JUMP_TO_CTRL_GROUP,
    async (args: any) => {
      if (!enabled) return
      const { id } = args
      if (isNullish(id))
        throw new Error(
          `${logMod(ExtensionCommand.JUMP_TO_CTRL_GROUP)} Missing 'id' arg`,
        )
      await sm.jumpToGroup(id)
    },
  )

  const cycleControlGroup = vscode.commands.registerCommand(
    ExtensionCommand.CYCLE_CTRL_GROUP,
    async (args: any) => {
      if (!enabled) return
      const { backwards } = args
      if (isNullish(backwards))
        throw new Error(
          `${logMod(ExtensionCommand.CYCLE_CTRL_GROUP)} Missing 'backwards' arg`,
        )
      await sm.cycle(backwards)
    },
  )

  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      conf.handleConfigChanges(event)
    },
    null,
    context.subscriptions,
  )

  const handleTextEditorChange = async () => {
    updateStatusBar()
    const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab
    if (activeTab?.input instanceof vscode.TabInputTextDiff) return
    if (conf.get(ExtensionConfig.NORMAL_MODE_ON_FILE_CHANGE)) {
      await vscode.commands.executeCommand("vim.remap", { after: ["<C-c>"] }) // Switch to normal mode
    }
  }

  context.subscriptions.push(
    sb.status,
    addToControlGroup,
    jumpToControlGroup,
    cycleControlGroup,
    toggleExtensionCommand,
    resetGroupsCommand,
    vscode.window.onDidChangeActiveTextEditor(handleTextEditorChange),
    vscode.workspace.onDidChangeTextDocument(updateStatusBar),
  )
}
