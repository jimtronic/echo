import type { CustomPack } from '../ScenarioBuilder'

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function createPackLink(pack: CustomPack): Promise<string> {
  const input = new TextEncoder().encode(JSON.stringify(pack))
  const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('gzip'))
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer())
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = `pack=${bytesToBase64(compressed)}`
  return url.toString()
}

export async function packFromCurrentLink(): Promise<CustomPack | null> {
  const encoded = new URLSearchParams(window.location.hash.slice(1)).get('pack')
  if (!encoded || encoded.length > 100_000) return null
  try {
    const bytes = base64ToBytes(encoded)
    const buffer = new ArrayBuffer(bytes.byteLength)
    new Uint8Array(buffer).set(bytes)
    const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))
    const pack = JSON.parse(await new Response(stream).text()) as CustomPack
    if (!pack.id || !pack.title || !pack.locale || !Array.isArray(pack.lessons) || pack.lessons.length === 0) return null
    return pack
  } catch {
    return null
  }
}

export async function copyLink(link: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(link)
    return true
  } catch {
    const field = document.createElement('textarea')
    field.value = link
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.append(field)
    field.select()
    const copied = document.execCommand('copy')
    field.remove()
    return copied
  }
}

export function showPackLinkInAddressBar(link: string): void {
  history.replaceState(null, '', link)
}

export function clearPackLink(): void {
  if (window.location.hash) history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
}
