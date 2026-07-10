---
name: keyboard-nav
description: Vim-style keyboard navigation for the repo table. h/j/k/l navigation, Enter to open, Escape to clear, click sync.
---

# Keyboard Navigation

File: `assets/keyboard-nav.js`

## State

- `rowIdx`: current row index (-1 when no selection)
- `colIdx`: current column index (0=icon, 1=name, 2=desc)

## Navigation

- `j`/`k`: row +1/-1 with wrap-around
- `h`/`l`: column -1/+1, clamped to {0,1} (0=icon is skip, 1=name, 2=desc)
- `Enter`: calls `linkIn(curCell())` → `window.open(href, '_blank')`
- `Escape`: clear highlight, reset rowIdx to -1

## Click Sync

Click a table cell → finds the `tr` index, sets `rowIdx` + `colIdx` to match, highlights the cell. This keeps keyboard state in sync after mouse interaction.

## Highlights

Uses CSS class `nav-active` on the `<td>`. Clears previous via `querySelectorAll('.nav-active')` before applying.
