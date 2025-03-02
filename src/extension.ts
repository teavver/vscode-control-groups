import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { StatusBar } from './status';
import { isError, createMarkFromPos, isNullish, logMod, createDebugLogger } from './util';
import { Configuration } from './configuration';

let enabled = true
let sb = new StatusBar()

export function activate(context: vscode.ExtensionContext) {
  const vim = vscode.extensions.getExtension('vscodevim.vim')
  if (!vim) throw new Error('vscode-vim extension is not installed')

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
      const { id, createGroup } = args
      const mark = createMarkFromPos()
      if (isNullish(id) || isNullish(createGroup))
        throw new Error(`${logMod('addToControlGroup')} Missing 'id' or 'createGroup' arg`)
      if (isError<MarkData>(mark)) throw new Error(`${logMod('addToControlGroup')} ${mark.message}`)
      if (createGroup) {
        return sm.addToGroup(id, mark, true)
      }
      sm.addToGroup(id, mark)
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
    if (conf.get(Configuration.SETTINGS.NORMAL_MODE_ON_FILE_CHANGE)) {
      await vscode.commands.executeCommand('vim.remap', { after: ['<Esc>'] }) // Switch to normal mode
    }
  }

  context.subscriptions.push(sb, addToControlGroup, jumpToControlGroup, cycleControlGroup, toggleExtension)
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(handleTextEditorChange))
}

export function deactivate() {
  if (sb) sb.dispose()
}
