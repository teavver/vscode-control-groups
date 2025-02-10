![](./assets/shade_32.png) <b>vscode-control-groups</b>

---

sc2 control group bindings for vscode vim extension

### settings.json

add this to your `settings.json` vscode file:

```json
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["1", "1"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 1 }
        }
      ]
    },
    {
      "before": ["2", "2"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 2 }
        }
      ]
    },
    {
      "before": ["3", "3"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 3 }
        }
      ]
    },
    {
      "before": ["4", "4"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 4 }
        }
      ]
    },
    {
      "before": ["5", "5"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 5 }
        }
      ]
    },
    {
      "before": ["6", "6"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 6 }
        }
      ]
    },
    {
      "before": ["7", "7"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 7 }
        }
      ]
    },
    {
      "before": ["8", "8"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 8 }
        }
      ]
    },
    {
      "before": ["9", "9"],
      "after": ["<Esc>"],
      "silent": true,
      "commands": [
        {
          "command": "sc2.jumpToControlGroup",
          "args": { "id": 9 }
        }
      ]
    }
  ],
```

### defaults

those are the keybinds the extension comes with:

```json
      "keybindings": [

          // add to group or create one if empty
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+1",
              "when": "editorTextFocus",
              "args": { "id": 1, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+2",
              "when": "inputFocus && vim.mode == 'Normal'",
              "args": { "id": 2, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+3",
              "when": "editorTextFocus",
              "args": { "id": 3, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+4",
              "when": "editorTextFocus",
              "args": { "id": 4, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+5",
              "when": "editorTextFocus",
              "args": { "id": 5, "createGroup": false }
          },

          // delete current group and add current mark to new group
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+1",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "id": 1, "createGroup": true }
          },
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+2",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "id": 2, "createGroup": true }
          },
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+3",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "id": 3, "createGroup": true }
          },
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+4",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "id": 4, "createGroup": true }
          },
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+5",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "id": 5, "createGroup": true }
          },

          // cycle through marks in group
          {
            "command": "sc2.cycle",
            "key": "Tab",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "backwards": false }
          },

          // cycle backwards (WIP)
          {
            "command": "sc2.cycle",
            "key": "shift+Tab",
            "when": "inputFocus && vim.mode == 'Normal'",
            "args": { "backwards": true }
          }
      ]
```

reserved keys by default:

- some numeric arguments (11, 22, 33..99), tab and shift+tab
- ctrl + 1..9 and shift + 1..9

### notes

- sc2 also allows `0` for control groups, i did not add it to the deafult binds since `0` is useful in vim

### todo

- cycle through group backwards (shift+tab)
- save state to disk (per workspace)
- steal control groups option
- readonly dump group (0 or space)