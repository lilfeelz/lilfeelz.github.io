// Site config sits on <body data-user data-docs data-skip>, so this file is the same on every site.
const { user, docs, skip = '' } = document.body.dataset;
const hidden = skip.split(' ');
const GH = 'https://api.github.com';

let allRepos = [];

function fuzzy(q, s) {
  q = q.toLowerCase();
  s = s.toLowerCase();
  let qi = 0;
  for (let si = 0; si < s.length && qi < q.length; si++)
    if (q[qi] === s[si]) qi++;
  return qi === q.length;
}

function render(filter) {
  const tpl = document.getElementById('row').content.firstElementChild;
  const filtered = filter ? allRepos.filter(r => fuzzy(filter, r.name)) : allRepos;
  document.getElementById('repos').replaceChildren(...filtered.map(r => {
    const tr = tpl.cloneNode(true);
    const [gh, name] = tr.querySelectorAll('a');
    const seg = encodeURIComponent(r.name);
    gh.href = `https://github.com/${user}/${seg}`;
    name.href = `${r.has_pages ? docs : `https://github.com/${user}`}/${seg}`;
    name.textContent = r.name;
    tr.querySelector('.col-desc').textContent = r.description || '';
    return tr;
  }));
}

// Sorted by name so pages stay stable while paging.
async function load() {
  const repos = [];
  for (let page = 1; ; page++) {
    const r = await fetch(`${GH}/users/${user}/repos?sort=full_name&per_page=100&type=owner&page=${page}`,
      { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error(r.status);
    const batch = await r.json();
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

load()
  .then(repos => {
    allRepos = repos.filter(r => !r.fork && !r.archived && !r.private && !hidden.includes(r.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    const input = document.getElementById('filter');
    input.addEventListener('input', () => render(input.value));
    render('');
  })
  .catch(() => {
    document.getElementById('repos').innerHTML =
      '<tr><td colspan="3">failed to load repos</td></tr>';
  });
