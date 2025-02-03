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
    },
    {
      "before": ["2", "2"],
      "after": ["<Esc>"],
      "commands": [
        {
          "command": "extension.setActiveControlGroup",
          "args": { "id": 2 }
        }
      ]
    },
    {
      "before": ["3", "3"],
      "after": ["<Esc>"],
      "commands": [
        {
          "command": "extension.setActiveControlGroup",
          "args": { "id": 3 }
        }
      ]
    },
    {
      "before": ["4", "4"],
      "after": ["<Esc>"],
      "commands": [
        {
          "command": "extension.setActiveControlGroup",
          "args": { "id": 4 }
        }
      ]
    }
  ]
```