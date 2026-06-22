const GH = 'https://api.github.com';
const USER = 'lilfeelz';

fetch(`${GH}/users/${USER}/repos?sort=updated&per_page=100&type=owner`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(repos => {
    const tbody = document.getElementById('repos');
    const filtered = repos
      .filter(r => !r.fork && !r.archived && !r.private)
      .sort((a, b) => a.name.localeCompare(b.name));
    tbody.innerHTML = filtered
      .map(r => {
        const name = r.name.replace(/&/g, '&amp;');
        const desc = (r.description || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        const deploy = r.name === 'cv' ? 'https://melchard.pages.dev' : `https://docs.lilfeelz.org/${r.name}`;
        return `<tr><td class="col-gh"><a href="https://github.com/${USER}/${r.name}"><img src="https://img.shields.io/badge/-181717?logo=github" alt="github"></a></td><td class="col-name"><a href="${deploy}">${name}</a></td><td class="col-desc">${desc}</td></tr>`;
      })
      .join('');
  })
  .catch(e => {
    document.getElementById('repos').innerHTML =
      '<tr><td colspan="3">failed to load repos</td></tr>';
  });
