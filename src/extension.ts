import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { StatusBar } from './status';
import { isError, createMarkFromPos, isNullish, logMod, createDebugLogger } from './util';

let enabled = true

export function activate(context: vscode.ExtensionContext) {
  const vim = vscode.extensions.getExtension('vscodevim.vim')
  if (!vim) throw new Error('vscode-vim extension is not installed')

  const dlog = createDebugLogger(context)
  const st = new StatusBar()
  const sm = new StateManager(dlog, st)

  const updateStatusBar = () => {
    enabled ? st.update(sm.formatState()) : st.update(StatusBar.DEFAULT_LABEL_OFF)
  }

  const toggleExtension = vscode.commands.registerCommand(
    'sc2.toggle', () => {
      enabled = !enabled
      updateStatusBar()
    }
  )

  const addToControlGroup = vscode.commands.registerCommand(
    'sc2.addToControlGroup',
    async (args) => {
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
    (args) => {
      if (!enabled) return
      const { id } = args
      if (isNullish(id)) throw new Error(`${logMod('jumpToControlGroup')} Missing 'id' arg`)
      sm.jumpToGroup(id)
    }
  )

  const cycleControlGroup = vscode.commands.registerCommand(
    'sc2.cycle',
    (args) => {
      if (!enabled) return
      const { backwards } = args
      if (isNullish(backwards)) throw new Error(`${logMod('cycleControlGroup')} Missing 'backwards' arg`)
      sm.cycle()
    }
  )

  context.subscriptions.push(
    ...[addToControlGroup, jumpToControlGroup, cycleControlGroup, toggleExtension, st.status]
  )
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
}

export function deactivate() {}
