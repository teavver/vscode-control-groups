# vscode-control-groups
sc2 control group bindings for vscode vim extension

### settings.json

```
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["1", "1"],
      "after": ["<Esc>"],
      "commands": [
        {
          "command": "extension.setActiveControlGroup",
          "args": { "id": 1 }
        }
      ]
    }
  ]
```