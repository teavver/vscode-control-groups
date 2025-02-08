import * as vscode from 'vscode';
import { StateManager } from './state';
import { MarkData } from './types';
import { statusEmitter } from './events';
import { StatusText } from './status';
import { isError, createMarkFromPos, isNullish, logMod, createDebugLogger } from './util';

let enabled = true

export function activate(context: vscode.ExtensionContext) {
  const vim = vscode.extensions.getExtension('vscodevim.vim')
  if (!vim) throw new Error('vscode-vim extension is not installed')

  const dlog = createDebugLogger(context)
  const sm = new StateManager(dlog)
  const st = new StatusText()

  const toggleExtension = vscode.commands.registerCommand(
    'sc2.toggle', () => {
      enabled ? statusEmitter.fire(StatusText.DEFAULT_LABEL_OFF) : statusEmitter.fire(sm.formatState())
      enabled = !enabled
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
}

export function deactivate() {}
