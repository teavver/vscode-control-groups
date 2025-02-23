![](./assets/shade_32.png) <b>vscode-control-groups</b>

---

sc2 control group bindings for vscode vim extension

vsocode-vim is required for control groups to work properly: https://marketplace.visualstudio.com/items?itemName=vscodevim.vim

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

### extension configuration

`sc2.controlGroupStealing` | `boolean` | default = `true`

Enable to remove units from previous control groups when assigning them to a new one

---

### defaults

those are the keybinds the extension comes with:

```json
      "keybindings": [

          // add to group or create one if empty (1-9)
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+1",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 1, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+2",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 2, "createGroup": false }
          },
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+3",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 3, "createGroup": false }
          },
          // ...
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+9",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 9, "createGroup": false }
          },
          // delete current group and add current mark to new group (1-9)
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+1",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "id": 1, "createGroup": true }
          },
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+2",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "id": 2, "createGroup": true }
          },
          // ...
          {
            "command": "sc2.addToControlGroup",
            "key": "shift+9",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "id": 9, "createGroup": true }
          },
          // cycle through marks in group (in the order they were set)
          {
            "command": "sc2.cycle",
            "key": "Tab",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "backwards": false }
          },

          // cycle backwards
          {
            "command": "sc2.cycle",
            "key": "shift+Tab",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "backwards": true }
          }
      ]
```

reserved keys by default (only in NORMAL mode):

- some numeric arguments (11, 22, 33..99), tab and shift+tab
- ctrl + 1..9 and shift + 1..9

### todo

- save state to disk (per workspace)
- add 'readonly group ids' to configuration