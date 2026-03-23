const JT_TAB_ID = 'jtmetrics-tab-link'
const JT_PANEL_ID = 'jtmetrics-panel'
const JT_STATUS_ID = 'jtmetrics-status'
const JT_PATH_ID = 'jtmetrics-source-path'
const JT_CALCULATE_ID = 'jtmetrics-calculate-btn'
const JT_DOWNLOAD_ID = 'jtmetrics-download-btn'
const JT_ICON_PATH = 'icons/icon16.png'
const JT_VERSION = chrome.runtime.getManifest().version

let latestResult = null
let latestRepoContext = null
let previousHref = location.href

const RESERVED_FIRST_SEGMENTS = new Set([
  'features',
  'topics',
  'collections',
  'trending',
  'events',
  'marketplace',
  'pricing',
  'search',
  'notifications',
  'pulls',
  'issues',
  'codespaces',
  'sponsors',
  'settings',
  'orgs',
  'enterprise',
  'about',
  'contact'
])

function parseRepoContext () {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  if (RESERVED_FIRST_SEGMENTS.has(parts[0])) return null

  const owner = parts[0]
  const repo = parts[1]
  if (!owner || !repo) return null

  let ref = 'HEAD'
  if ((parts[2] === 'tree' || parts[2] === 'blob') && parts[3]) {
    ref = decodeURIComponent(parts[3])
  }

  return { owner, repo, ref }
}

function getRepoNavigation () {
  const selectors = [
    'nav[aria-label="Repository"] .UnderlineNav-body',
    'nav[aria-label="Repository"]',
    '.js-repo-nav .UnderlineNav-body',
    '.js-repo-nav',
    '[data-pjax="#repo-content-pjax-container"] nav',
    '.UnderlineNav-body'
  ]

  for (const selector of selectors) {
    const node = document.querySelector(selector)
    if (node) return node
  }

  return null
}

function findRepoSettingsLink (repoContext) {
  const targetPath = `/${repoContext.owner}/${repoContext.repo}/settings`
  const allAnchors = [...document.querySelectorAll('a[href]')]

  return allAnchors.find((anchor) => {
    try {
      const url = new URL(anchor.href, window.location.origin)
      return url.pathname === targetPath || url.pathname === `${targetPath}/`
    } catch {
      return false
    }
  }) || null
}

function findLastRepoTabLink (repoContext) {
  const nav = getRepoNavigation()

  const repoPrefix = `/${repoContext.owner}/${repoContext.repo}`
  const scopedAnchors = nav ? [...nav.querySelectorAll('a[href]')] : []
  const globalAnchors = [
    ...document.querySelectorAll(
      'nav[aria-label="Repository"] a[href], a.UnderlineNav-item[href], .js-repo-nav a[href]'
    )
  ]

  const anchors = [...new Set([...scopedAnchors, ...globalAnchors])]
    .filter((anchor) => anchor.id !== JT_TAB_ID && anchor.getAttribute('data-jtmetrics') !== 'true')
    .filter((anchor) => {
      try {
        const url = new URL(anchor.href, window.location.origin)
        return url.pathname.startsWith(repoPrefix)
      } catch {
        return false
      }
    })

  return anchors.length > 0 ? anchors[anchors.length - 1] : null
}

function resolveTabClassName (referenceLink, nav) {
  if (referenceLink?.className) return referenceLink.className
  const firstLink = nav?.querySelector('a[href]')
  return firstLink?.className || ''
}

function createTabLink (className = '') {
  const tab = document.createElement('a')
  tab.id = JT_TAB_ID
  tab.href = '#'
  tab.className = className
  tab.setAttribute('data-jtmetrics', 'true')

  const icon = document.createElement('img')
  icon.src = chrome.runtime.getURL(JT_ICON_PATH)
  icon.alt = ''
  icon.className = 'jtmetrics-tab-icon'
  icon.width = 14
  icon.height = 14

  const text = document.createElement('span')
  text.textContent = 'JTMetrics'

  const wrapper = document.createElement('span')
  wrapper.className = 'jtmetrics-tab-content'
  wrapper.appendChild(icon)
  wrapper.appendChild(text)
  tab.appendChild(wrapper)

  tab.addEventListener('click', (event) => {
    event.preventDefault()
    openPanel()
  })
  return tab
}

function mountTab () {
  const repoContext = parseRepoContext()
  if (!repoContext) return

  if (document.getElementById(JT_TAB_ID)) return

  const settingsLink = findRepoSettingsLink(repoContext)
  const targetLink = settingsLink || findLastRepoTabLink(repoContext)
  const nav = getRepoNavigation() || targetLink?.closest('nav') || targetLink?.parentElement
  if (!targetLink && !nav) return

  const tab = createTabLink(resolveTabClassName(targetLink, nav))

  if (targetLink?.parentElement && targetLink.parentElement.tagName === 'LI') {
    const wrapper = document.createElement('li')
    wrapper.className = targetLink.parentElement.className
    wrapper.appendChild(tab)
    targetLink.parentElement.insertAdjacentElement('afterend', wrapper)
    return
  }

  if (targetLink) {
    targetLink.insertAdjacentElement('afterend', tab)
    return
  }

  const lastLi = nav.querySelector('li:last-child')
  if (lastLi?.parentElement) {
    const wrapper = document.createElement('li')
    wrapper.className = lastLi.className
    wrapper.appendChild(tab)
    lastLi.insertAdjacentElement('afterend', wrapper)
    return
  }

  nav.appendChild(tab)
}

function findPanelContainer () {
  return document.querySelector('main') || document.body
}

function setStatus (text, type = 'info') {
  const status = document.getElementById(JT_STATUS_ID)
  if (!status) return
  status.textContent = text
  status.dataset.type = type
}

function setCalculateBusy (isBusy) {
  const btn = document.getElementById(JT_CALCULATE_ID)
  const input = document.getElementById(JT_PATH_ID)
  if (!btn || !input) return
  btn.disabled = isBusy
  input.disabled = isBusy
  btn.textContent = isBusy ? 'Calculating...' : 'Calculate metrics'
}

function savePathForRepo (repoContext, sourcePath) {
  const key = `jtmetrics:path:${repoContext.owner}/${repoContext.repo}`
  localStorage.setItem(key, sourcePath)
}

function loadPathForRepo (repoContext) {
  const key = `jtmetrics:path:${repoContext.owner}/${repoContext.repo}`
  return localStorage.getItem(key) || ''
}

function downloadLatestResult () {
  if (!latestResult || !latestRepoContext) return
  const filename = `${latestRepoContext.owner}-${latestRepoContext.repo}-jtmetrics.json`
  const content = JSON.stringify(latestResult, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

async function calculateMetrics () {
  const repoContext = parseRepoContext()
  if (!repoContext) {
    setStatus('This page is not a repository view.', 'error')
    return
  }

  const input = document.getElementById(JT_PATH_ID)
  const downloadBtn = document.getElementById(JT_DOWNLOAD_ID)
  if (!input || !downloadBtn) return

  const sourcePath = input.value.trim()
  if (!sourcePath) {
    setStatus('Please enter a source path (for example: src).', 'error')
    return
  }

  setCalculateBusy(true)
  setStatus('Running all available metrics...', 'info')
  savePathForRepo(repoContext, sourcePath)

  chrome.runtime.sendMessage(
    {
      type: 'JTMETRICS_CALCULATE',
      payload: {
        owner: repoContext.owner,
        repo: repoContext.repo,
        ref: repoContext.ref,
        sourcePath
      }
    },
    (response) => {
      setCalculateBusy(false)

      if (chrome.runtime.lastError) {
        setStatus(`Runtime error: ${chrome.runtime.lastError.message}`, 'error')
        return
      }

      if (!response?.ok) {
        setStatus(`Failed: ${response?.error || 'Unknown error'}`, 'error')
        return
      }

      latestResult = response.data
      latestRepoContext = repoContext
      downloadBtn.hidden = false
      setStatus('Done. You can now download the JSON result.', 'success')
    }
  )
}

function buildPanelHtml (repoContext) {
  const defaultPath = loadPathForRepo(repoContext) || 'src'
  return `
    <div class="jtmetrics-card">
      <h2>JTMetrics <span class="jtmetrics-version">v${JT_VERSION}</span></h2>
      <p>Enter the JavaScript/TypeScript source path inside this repository, then run all available metrics.</p>
      <label for="${JT_PATH_ID}">Source path</label>
      <input id="${JT_PATH_ID}" type="text" value="${defaultPath}" placeholder="src" />
      <div class="jtmetrics-actions">
        <button id="${JT_CALCULATE_ID}" type="button">Calculate metrics</button>
        <button id="${JT_DOWNLOAD_ID}" type="button" hidden>Download JSON</button>
      </div>
      <p id="${JT_STATUS_ID}" data-type="info">Ready.</p>
      <p class="jtmetrics-note">
        Metrics run directly in your browser. Configure optional GitHub token in extension options.
      </p>
    </div>
  `
}

function openPanel () {
  const repoContext = parseRepoContext()
  if (!repoContext) return

  const container = findPanelContainer()
  if (!container) return

  let panel = document.getElementById(JT_PANEL_ID)
  if (!panel) {
    panel = document.createElement('section')
    panel.id = JT_PANEL_ID
    panel.className = 'jtmetrics-panel'
    container.prepend(panel)
  }

  panel.innerHTML = buildPanelHtml(repoContext)
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const calculateBtn = document.getElementById(JT_CALCULATE_ID)
  const downloadBtn = document.getElementById(JT_DOWNLOAD_ID)

  calculateBtn?.addEventListener('click', calculateMetrics)
  downloadBtn?.addEventListener('click', downloadLatestResult)
}

function removePanelAndTabIfNeeded () {
  if (parseRepoContext()) return
  document.getElementById(JT_TAB_ID)?.remove()
  document.getElementById(JT_PANEL_ID)?.remove()
}

function bootstrap () {
  const repoContext = parseRepoContext()
  if (repoContext) {
    mountTab()
  } else {
    removePanelAndTabIfNeeded()
  }
}

const observer = new MutationObserver(() => {
  if (location.href !== previousHref) {
    previousHref = location.href
    latestResult = null
    latestRepoContext = null
  }
  bootstrap()
})

observer.observe(document.documentElement, { subtree: true, childList: true })
bootstrap()
