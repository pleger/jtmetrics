import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'
import { calculateMetrics } from '../../src/index.js'

const HOST = process.env.JTM_BRIDGE_HOST || '127.0.0.1'
const PORT = Number(process.env.JTM_BRIDGE_PORT || 43110)

function writeJson (res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
  })
  res.end(JSON.stringify(payload))
}

function sanitizeSourcePath (sourcePath) {
  const normalized = sourcePath.replace(/^\/+/, '')
  if (!normalized || normalized === '.') return '.'
  return normalized
}

async function readRequestBody (req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks).toString('utf-8')
  return body ? JSON.parse(body) : {}
}

async function downloadZipball ({ owner, repo, ref, githubToken }) {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/zipball/${encodeURIComponent(ref || 'HEAD')}`
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'JTMetrics-Bridge'
  }

  if (githubToken) headers.Authorization = `Bearer ${githubToken}`

  const response = await fetch(endpoint, { headers })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GitHub zipball request failed (${response.status}): ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function extractRepository (zipBuffer) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jtmetrics-bridge-'))
  const zipPath = path.join(tempDir, 'repo.zip')
  await fs.writeFile(zipPath, zipBuffer)

  const zip = new AdmZip(zipPath)
  zip.extractAllTo(tempDir, true)

  const entries = await fs.readdir(tempDir, { withFileTypes: true })
  const extractedRootEntry = entries.find(entry => entry.isDirectory())
  if (!extractedRootEntry) {
    throw new Error('Could not locate extracted repository directory')
  }

  const extractedRoot = path.join(tempDir, extractedRootEntry.name)
  return { tempDir, extractedRoot }
}

function resolveCodePath (repoRoot, sourcePath) {
  const relative = sanitizeSourcePath(sourcePath || '.')
  const absolute = path.resolve(repoRoot, relative)
  if (!absolute.startsWith(repoRoot)) {
    throw new Error('Invalid source path. It must stay inside the repository root.')
  }
  return absolute
}

async function analyzeRepository ({ owner, repo, ref, sourcePath, githubToken }) {
  const zipBuffer = await downloadZipball({ owner, repo, ref, githubToken })
  const { tempDir, extractedRoot } = await extractRepository(zipBuffer)

  try {
    const codePath = resolveCodePath(extractedRoot, sourcePath)
    const stats = await fs.stat(codePath).catch(() => null)
    if (!stats || !stats.isDirectory()) {
      throw new Error(`Source path "${sourcePath}" does not exist as a directory in ${owner}/${repo}@${ref || 'HEAD'}`)
    }

    return await calculateMetrics({ codePath })
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

async function handleAnalyze (req, res) {
  const body = await readRequestBody(req)
  const { owner, repo, ref = 'HEAD', sourcePath, githubToken = '' } = body

  if (!owner || !repo || !sourcePath) {
    writeJson(res, 400, {
      error: 'Missing required fields: owner, repo, sourcePath'
    })
    return
  }

  const result = await analyzeRepository({
    owner,
    repo,
    ref,
    sourcePath,
    githubToken
  })

  writeJson(res, 200, result)
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      writeJson(res, 200, { ok: true })
      return
    }

    if (req.method === 'GET' && req.url === '/health') {
      writeJson(res, 200, { ok: true, service: 'jtmetrics-bridge' })
      return
    }

    if (req.method === 'POST' && req.url === '/analyze') {
      await handleAnalyze(req, res)
      return
    }

    writeJson(res, 404, { error: 'Not found' })
  } catch (error) {
    writeJson(res, 500, { error: error.message })
  }
})

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`JTMetrics bridge listening on http://${HOST}:${PORT}`)
})
