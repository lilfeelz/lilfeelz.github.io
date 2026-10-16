// Site config sits on <body data-user data-docs data-skip>, so this file is the same on every site.
const { user, docs, skip = '' } = document.body.dataset
const hidden = skip.split(' ')
const GH = 'https://api.github.com'

/**
 * @typedef {object} Repo The fields of a GitHub API repository this page reads.
 * @property {string} name repo name
 * @property {string | null} description repo description
 * @property {boolean} has_pages whether the repo publishes a Pages site under docs
 * @property {boolean} fork whether the repo is a fork
 * @property {boolean} archived whether the repo is archived
 * @property {boolean} private whether the repo is private
 */

/** @type {Repo[]} */
let allRepos = []

const list = /** @type {HTMLTableSectionElement} */ (document.getElementById('repos'))

/**
 * @param {string} q the query
 * @param {string} s the candidate
 * @returns {boolean} whether the characters of q appear in s in order, ignoring case
 */
function fuzzy(q, s) {
  q = q.toLowerCase()
  s = s.toLowerCase()
  let qi = 0
  for (let si = 0; si < s.length && qi < q.length; si++) if (q[qi] === s[si]) qi++
  return qi === q.length
}

/**
 * Renders the repos whose name fuzzy-matches filter, or all of them.
 * @param {string} filter the query, empty shows every repo
 */
function render(filter) {
  const tpl = /** @type {HTMLTemplateElement} */ (document.getElementById('row'))
  const row = /** @type {Element} */ (tpl.content.firstElementChild)
  const filtered = filter ? allRepos.filter((r) => fuzzy(filter, r.name)) : allRepos
  list.replaceChildren(
    ...filtered.map((r) => {
      const tr = /** @type {Element} */ (row.cloneNode(true))
      const [gh, name] = tr.querySelectorAll('a')
      const seg = encodeURIComponent(r.name)
      gh.href = `https://github.com/${user}/${seg}`
      name.href = `${r.has_pages ? docs : `https://github.com/${user}`}/${seg}`
      name.textContent = r.name
      const desc = /** @type {Element} */ (tr.querySelector('.col-desc'))
      desc.textContent = r.description || ''
      return tr
    }),
  )
}

/**
 * Fetches every repo of the owner, sorted by name so pages stay stable while paging.
 * @returns {Promise<Repo[]>} all repos of the owner
 */
async function load() {
  const repos = []
  for (let page = 1; ; page++) {
    const r = await fetch(
      `${GH}/users/${user}/repos?sort=full_name&per_page=100&type=owner&page=${page}`,
      { signal: AbortSignal.timeout(10000) },
    )
    if (!r.ok) throw new Error(String(r.status))
    /** @type {Repo[]} */
    const batch = await r.json()
    repos.push(...batch)
    if (batch.length < 100) return repos
  }
}

load()
  .then((repos) => {
    allRepos = repos
      .filter((r) => !r.fork && !r.archived && !r.private && !hidden.includes(r.name))
      .sort((a, b) => a.name.localeCompare(b.name))
    const input = /** @type {HTMLInputElement} */ (document.getElementById('filter'))
    input.addEventListener('input', () => render(input.value))
    render('')
  })
  .catch(() => {
    list.innerHTML = '<tr><td colspan="3">failed to load repos</td></tr>'
  })
