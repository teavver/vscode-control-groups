export const EXTENSION_PREFIX = "sc2"

export enum ExtensionCommand {
  TOGGLE_EXTENSION = `${EXTENSION_PREFIX}.toggle`,
  RESET_CTRL_GROUPS = `${EXTENSION_PREFIX}.resetGroups`,
  ADD_TO_CTRL_GROUP = `${EXTENSION_PREFIX}.addToControlGroup`,
  JUMP_TO_CTRL_GROUP = `${EXTENSION_PREFIX}.jumpToControlGroup`,
  CYCLE_CTRL_GROUP = `${EXTENSION_PREFIX}.cycle`,
}

export enum ExtensionConfig {
  GROUP_STEALING = "controlGroupStealing",
  PREFER_TAB_FOCUS_SPLIT = "preferTabFocusInSplit",
  UPDATE_MARK_BEFORE_JUMP = "updateMarkBeforeJump",
}
