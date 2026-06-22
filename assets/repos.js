const GH = 'https://api.github.com';
const USER = 'lilfeelz';
const DOCS = `https://docs.${USER}.org`;

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
  const tbody = document.getElementById('repos');
  const filtered = filter ? allRepos.filter(r => fuzzy(filter, r.name)) : allRepos;
  tbody.innerHTML = filtered.map(r => {
    const name = r.name.replace(/&/g, '&amp;');
    const desc = (r.description || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<tr><td class="col-gh"><a href="https://github.com/${USER}/${r.name}"><img src="https://img.shields.io/badge/-181717?logo=github" alt="github"></a></td><td class="col-name"><a href="${DOCS}/${r.name}">${name}</a></td><td class="col-desc">${desc}</td></tr>`;
  }).join('');
}

fetch(`${GH}/users/${USER}/repos?sort=updated&per_page=100&type=owner`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(repos => {
    allRepos = repos.filter(r => !r.fork && !r.archived && !r.private && r.name !== 'witchblades.org')
      .sort((a, b) => a.name.localeCompare(b.name));
    const input = document.getElementById('filter');
    input.addEventListener('input', () => render(input.value));
    render('');
  })
  .catch(() => {
    document.getElementById('repos').innerHTML =
      '<tr><td colspan="3">failed to load repos</td></tr>';
  });
