import * as vscode from "vscode";
import { StateManager } from "./state";
import { MarkData } from "./types";
import { StatusText } from "./status";
import { isError, createMarkFromPos, isNullish, logMod, createDebugLogger } from "./util";

export function activate(context: vscode.ExtensionContext) {
  const vim = vscode.extensions.getExtension("vscodevim.vim")
  if (!vim) throw new Error("VSCODE vimExt EERROR")

  const dlog = createDebugLogger(context)
  const sm = new StateManager(dlog)
  new StatusText()

  const addToControlGroup = vscode.commands.registerCommand(
    "sc2.addToControlGroup",
    async (args) => {
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
    "sc2.jumpToControlGroup",
    (args) => {
      const { id } = args
      if (isNullish(id)) throw new Error(`${logMod('jumpToControlGroup')} Missing 'id' arg`)
      sm.jumpToGroup(id)
    }
  )

  const cycleControlGroup = vscode.commands.registerCommand(
    "sc2.cycle",
    (args) => {
      const { backwards } = args
      if (isNullish(backwards)) throw new Error(`${logMod('cycleControlGroup')} Missing 'backwards' arg`)
      sm.cycle()
    }
  )

  context.subscriptions.push(
    ...[addToControlGroup, jumpToControlGroup, cycleControlGroup]
  )
}

export function deactivate() {}
