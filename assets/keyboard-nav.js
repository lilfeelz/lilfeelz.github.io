let rowIdx = -1;
let colIdx = 1;

function rows() {
  return [...document.querySelectorAll('tbody tr')];
}

function curCell() {
  const r = rows();
  if (rowIdx < 0 || rowIdx >= r.length) return null;
  return r[rowIdx].children[colIdx];
}

/** @param {Element | null} el */
function linkIn(el) {
  return el?.querySelector('a');
}

function clearHl() {
  document.querySelectorAll('.nav-active').forEach((el) => el.classList.remove('nav-active'));
}

/** @param {Element | null} el */
function hl(el) {
  if (!el) return;
  clearHl();
  el.classList.add('nav-active');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** @param {number} d */
function navRow(d) {
  const r = rows();
  if (!r.length) return;
  rowIdx = (rowIdx + d + r.length) % r.length;
  hl(curCell());
}

/** @param {number} d */
function navCol(d) {
  const c = colIdx + d;
  if (c < 0 || c > 1) return;
  colIdx = c;
  hl(curCell());
}

/**
 * @param {number} r
 * @param {number} c
 */
function focus(r, c) {
  const all = rows();
  if (r < 0 || r >= all.length) return;
  if (c < 0 || c > 1) c = 1;
  rowIdx = r;
  colIdx = c;
  hl(curCell());
}

function follow() {
  const a = linkIn(curCell());
  if (a) window.open(a.href, '_blank');
}

const input = /** @type {HTMLInputElement} */ (document.getElementById('filter'));

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey) return;
  const target = /** @type {HTMLElement} */ (e.target);
  if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
    if (e.key === 'Escape') target.blur();
    return;
  }

  switch (e.key) {
    case '/':
      e.preventDefault();
      input.focus();
      break;
    case 'j':
    case 'ArrowDown':
      e.preventDefault();
      navRow(1);
      break;
    case 'k':
    case 'ArrowUp':
      e.preventDefault();
      navRow(-1);
      break;
    case 'h':
    case 'ArrowLeft':
      e.preventDefault();
      navCol(-1);
      break;
    case 'l':
    case 'ArrowRight':
      e.preventDefault();
      navCol(1);
      break;
    case 'Enter':
      e.preventDefault();
      follow();
      break;
    case 'Escape':
      clearHl();
      rowIdx = -1;
      break;
  }
});

document.addEventListener('click', (e) => {
  const link = /** @type {Element} */ (e.target).closest('a');
  if (!link) return;
  const td = link.closest('td');
  if (!td) return;
  const tr = td.closest('tr');
  if (!tr) return;
  const r = rows().indexOf(tr);
  if (r === -1) return;
  const c = [...tr.children].indexOf(td);
  focus(r, c);
});
