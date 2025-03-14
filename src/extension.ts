import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { StatusBar } from './status';
import { isError, createMarkFromPos, isNullish, logMod, createDebugLogger } from './util';
import { Configuration } from './configuration';

export function activate(context: vscode.ExtensionContext) {
  const vim = vscode.extensions.getExtension('vscodevim.vim')
  if (!vim) throw new Error('vscode-vim extension is not installed')
  let enabled = true
  const sb = new StatusBar()
  const dlog = createDebugLogger(context)
  const conf = new Configuration(dlog)
  const sm = new StateManager(dlog, conf, sb)

  const updateStatusBar = () => {
    enabled ? sb.update(sm.formatState()) : sb.update(StatusBar.DEFAULT_LABEL_OFF)
  }

  const toggleExtension = vscode.commands.registerCommand(
    'sc2.toggle', () => {
      enabled = !enabled
      updateStatusBar()
    }
  )

  const addToControlGroup = vscode.commands.registerCommand(
    'sc2.addToControlGroup',
    async (args: any) => {
      if (!enabled) return
      const id: number | undefined = args.id
      const createGroup: boolean | undefined = args.createGroup
      const mark = createMarkFromPos()
      if (isNullish(id) || isNullish(createGroup))
        throw new Error(`${logMod('addToControlGroup')} Missing 'id' or 'createGroup' arg`)
      if (isError<MarkData>(mark)) throw new Error(`${logMod('addToControlGroup')} ${mark.message}`)
      sm.addToGroup(id, mark, createGroup)
    }
  )

  const jumpToControlGroup = vscode.commands.registerCommand(
    'sc2.jumpToControlGroup',
    (args: any) => {
      if (!enabled) return
      const { id } = args
      if (isNullish(id)) throw new Error(`${logMod('jumpToControlGroup')} Missing 'id' arg`)
      sm.jumpToGroup(id)
    }
  )

  const cycleControlGroup = vscode.commands.registerCommand(
    'sc2.cycle',
    (args: any) => {
      if (!enabled) return
      const { backwards } = args
      if (isNullish(backwards)) throw new Error(`${logMod('cycleControlGroup')} Missing 'backwards' arg`)
      sm.cycle(backwards)
    }
  )

  vscode.workspace.onDidChangeConfiguration(event => {
    conf.handleConfigChanges(event)
  }, null, context.subscriptions)

  const handleTextEditorChange = async () => {
    updateStatusBar()
    const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab
    if (activeTab?.input instanceof vscode.TabInputTextDiff) return
    if (conf.get(Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE)) {
      await vscode.commands.executeCommand('vim.remap', { after: ['<Esc>'] }) // Switch to normal mode
    }
  }

  context.subscriptions.push(
    sb.status,
    addToControlGroup,
    jumpToControlGroup,
    cycleControlGroup,
    toggleExtension,
    vscode.window.onDidChangeActiveTextEditor(handleTextEditorChange),
    vscode.workspace.onDidChangeTextDocument(updateStatusBar)
  )
}

export function deactivate() { }
