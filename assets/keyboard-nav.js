let navIdx = -1;

function navItems() {
  const rows = [...document.querySelectorAll('tbody tr')];
  const links = [...document.querySelectorAll('footer nav a')];
  return [...rows, ...links];
}

function linkIn(el) {
  return el.tagName === 'A' ? el : el.querySelector('a');
}

function clearHl() {
  document.querySelectorAll('.nav-active').forEach(el => el.classList.remove('nav-active'));
  document.querySelectorAll('tr.nav-active td').forEach(td => td.classList.remove('nav-active'));
  document.querySelectorAll('tbody tr').forEach(tr => tr.classList.remove('nav-active'));
}

function hl(el) {
  if (!el) return;
  clearHl();
  if (el.tagName === 'TR') {
    el.classList.add('nav-active');
    el.querySelectorAll('td').forEach(td => td.classList.add('nav-active'));
  } else {
    el.classList.add('nav-active');
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nav(d) {
  const items = navItems();
  if (!items.length) return;
  navIdx = (navIdx + d + items.length) % items.length;
  hl(items[navIdx]);
}

function follow() {
  const items = navItems();
  if (navIdx < 0 || navIdx >= items.length) return;
  const a = linkIn(items[navIdx]);
  if (a) window.open(a.href, '_blank');
}

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case 'j':
    case 'ArrowDown':
      e.preventDefault();
      nav(1);
      break;
    case 'k':
    case 'ArrowUp':
      e.preventDefault();
      nav(-1);
      break;
    case 'Enter':
      e.preventDefault();
      follow();
      break;
    case 'Escape':
      clearHl();
      navIdx = -1;
      break;
  }
});

document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const el = link.closest('tr') || link;
  const items = navItems();
  const i = items.indexOf(el);
  if (i !== -1) { navIdx = i; hl(el); }
});
