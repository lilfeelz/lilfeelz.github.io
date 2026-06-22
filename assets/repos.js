const GH = 'https://api.github.com';
const USER = 'lilfeelz';
const DOCS = `https://docs.${USER}.org`;

function render(repos) {
  const tbody = document.getElementById('repos');
  tbody.innerHTML = repos.map(r => {
    const name = r.name.replace(/&/g, '&amp;');
    const desc = (r.description || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<tr><td class="col-gh"><a href="https://github.com/${USER}/${r.name}"><img src="https://img.shields.io/badge/-181717?logo=github" alt="github"></a></td><td class="col-name"><a href="${DOCS}/${r.name}">${name}</a></td><td class="col-desc">${desc}</td></tr>`;
  }).join('');
}

fetch(`${GH}/users/${USER}/repos?sort=updated&per_page=100&type=owner`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(repos => {
    render(repos.filter(r => !r.fork && !r.archived && !r.private && r.name !== 'witchblades.org')
      .sort((a, b) => a.name.localeCompare(b.name)));
  })
  .catch(() => {
    document.getElementById('repos').innerHTML =
      '<tr><td colspan="3">failed to load repos</td></tr>';
  });
