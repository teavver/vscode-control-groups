![](./assets/shade_32.png) <b>vscode-control-groups</b>

---

sc2 control group bindings for vscode-vim extension

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

`sc2.controlGroupStealing` | `boolean` | default = `false`

Assigning a Mark to a new Control Group removes it from the previous one

`sc2.preferTabFocusInSplit` | `boolean` | default = `true`

If a destination Mark is in multiple Vscode Tabs, open it in a Tab group other than the current one

`sc2.updateMarkBeforeJump` | `boolean` | default = `false`

Update current Mark location before jumping to another Control Group (File-scoped).

---

### defaults

```json
      "keybindings": [

          // Ctrl + <1..6> add to group or create one if empty (1-6)
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
              "key": "ctrl+6",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 6, "createGroup": false }
          },
          // group 0 = dump group by default (non-jumpable)
          {
              "command": "sc2.addToControlGroup",
              "key": "ctrl+space",
              "when": "editorTextFocus && vim.mode == 'Normal'",
              "args": { "id": 0, "createGroup": false }
          },
          // Shift + <1..6> delete current group and add current mark to new group (1-6)
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
            "key": "shift+6",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "id": 6, "createGroup": true }
          },
          // Tab = cycle through marks in group (in the order they were set)
          {
            "command": "sc2.cycle",
            "key": "Tab",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "backwards": false }
          },
          // Tab + Shift = cycle backwards
          {
            "command": "sc2.cycle",
            "key": "shift+Tab",
            "when": "editorTextFocus && vim.mode == 'Normal'",
            "args": { "backwards": true }
          }
      ]
```

### todo

- fix statusbar text sometimes disappearing when jumping files
