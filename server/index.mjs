import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { generatePack } from './generate-pack.mjs'

const port = Number(process.env.PORT ?? 5173)
const dev = process.argv.includes('--dev')
const vite = dev ? await (await import('vite')).createServer({ server: { middlewareMode: true }, appType: 'spa' }) : null
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' }
const generationWindows = new Map()

function checkGenerationLimit(request) {
  const client = String(request.headers['x-forwarded-for'] ?? request.socket.remoteAddress ?? 'unknown').split(',')[0].trim()
  const now = Date.now()
  const recent = (generationWindows.get(client) ?? []).filter((time) => now - time < 60 * 60 * 1000)
  if (recent.length >= 10) throw new Error('You have reached the hourly custom-pack limit. Please try again later.')
  generationWindows.set(client, [...recent, now])
}

async function jsonBody(request) {
  let body = ''
  for await (const chunk of request) { body += chunk; if (body.length > 30_000) throw new Error('Request is too large.') }
  return JSON.parse(body || '{}')
}

const server = createServer(async (request, response) => {
  try {
    if (request.url === '/health') { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end('{"status":"ok"}'); return }
    if (request.url === '/api/generate-pack' && request.method === 'POST') {
      checkGenerationLimit(request)
      const pack = await generatePack(await jsonBody(request))
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(pack)); return
    }
    if (request.url?.startsWith('/api/')) { response.writeHead(404); response.end(); return }
    if (vite) { vite.middlewares(request, response, () => {}); return }
    const pathname = decodeURIComponent((request.url ?? '/').split('?')[0])
    const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
    let filePath = join(process.cwd(), 'dist', safePath === '/' ? 'index.html' : safePath)
    try { if (!(await stat(filePath)).isFile()) throw new Error() } catch { filePath = join(process.cwd(), 'dist', 'index.html') }
    const content = await readFile(filePath)
    response.writeHead(200, { 'Content-Type': mime[extname(filePath)] ?? 'application/octet-stream' }); response.end(content)
  } catch (error) {
    response.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error.' }))
  }
})

server.listen(port, () => console.log(`Echo running at http://localhost:${port}`))
