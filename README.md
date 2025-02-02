# vscode-control-groups
sc2 control group bindings for vscode vim extension

### keybindings.json

```
  {
    "key": "1",
    "command": "extension.jumpToControlGroup",
    "when": "editorTextFocus && vim.mode == 'Normal'"
  },
  // ...
```