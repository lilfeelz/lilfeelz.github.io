// Keyboard navigation over the repo table: / filters, hjkl or arrows move, Enter opens.
let rowIdx = -1
let colIdx = 1

/** @returns {HTMLTableRowElement[]} the rendered repo rows */
function rows() {
  return [...document.querySelectorAll('tbody tr')].filter((r) => r instanceof HTMLTableRowElement)
}

/** @returns {Element | null} the highlighted cell, if any */
function curCell() {
  const r = rows()
  if (rowIdx < 0 || rowIdx >= r.length) return null
  return r[rowIdx].children[colIdx] ?? null
}

/**
 * @param {Element | null} el the cell to search
 * @returns {HTMLAnchorElement | null} the first link inside el
 */
function linkIn(el) {
  return el?.querySelector('a') ?? null
}

/** Removes the highlight from every cell. */
function clearHl() {
  document.querySelectorAll('.nav-active').forEach((el) => el.classList.remove('nav-active'))
}

/**
 * Highlights el and scrolls it into view.
 * @param {Element | null} el the cell to highlight; null does nothing
 */
function hl(el) {
  if (!el) return
  clearHl()
  el.classList.add('nav-active')
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/**
 * Moves the highlight d rows, wrapping around.
 * @param {number} d rows to move, negative moves up
 */
function navRow(d) {
  const r = rows()
  if (!r.length) return
  rowIdx = (rowIdx + d + r.length) % r.length
  hl(curCell())
}

/**
 * Moves the highlight d columns between the icon and name columns.
 * @param {number} d columns to move, negative moves left
 */
function navCol(d) {
  const c = colIdx + d
  if (c < 0 || c > 1) return
  colIdx = c
  hl(curCell())
}

/**
 * Highlights the cell at row r, column c.
 * @param {number} r row index
 * @param {number} c column index, out of range falls back to the name column
 */
function focus(r, c) {
  const all = rows()
  if (r < 0 || r >= all.length) return
  if (c < 0 || c > 1) c = 1
  rowIdx = r
  colIdx = c
  hl(curCell())
}

/** Opens the highlighted cell's link in a new tab. */
function follow() {
  const a = linkIn(curCell())
  if (a) window.open(a.href, '_blank')
}

const input = /** @type {HTMLInputElement} */ (document.getElementById('filter'))

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey) return
  const t = e.target
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) {
    if (e.key === 'Escape') t.blur()
    return
  }

  switch (e.key) {
    case '/':
      e.preventDefault()
      input.focus()
      break
    case 'j':
    case 'ArrowDown':
      e.preventDefault()
      navRow(1)
      break
    case 'k':
    case 'ArrowUp':
      e.preventDefault()
      navRow(-1)
      break
    case 'h':
    case 'ArrowLeft':
      e.preventDefault()
      navCol(-1)
      break
    case 'l':
    case 'ArrowRight':
      e.preventDefault()
      navCol(1)
      break
    case 'Enter':
      e.preventDefault()
      follow()
      break
    case 'Escape':
      clearHl()
      rowIdx = -1
      break
  }
})

document.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return
  const td = e.target.closest('a')?.closest('td')
  const tr = td?.closest('tr')
  if (!td || !tr) return
  const r = rows().indexOf(tr)
  if (r === -1) return
  focus(r, [...tr.children].indexOf(td))
})
