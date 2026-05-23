import { gunzip, gzip } from 'fflate'

const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function getKeyFromSecret(secret) {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(secret))
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

function getRandomBase62Key(length) {
  const randomInts = Array.from(crypto.getRandomValues(new Uint32Array(length)))
  return randomInts.map((int) => base62[int % 62]).join('')
}

export function getRandomSecret() {
  return getRandomBase62Key(43)
}

export function getRandomId() {
  return getRandomBase62Key(22)
}

export async function getComposedId(...parts) {
  const joined = parts
    .map((part) => String(part))
    .sort()
    .join('\n')
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(joined))
  const hashHex = Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('')
  let hashBigInt = BigInt('0x' + hashHex)
  let base62Chars = []
  while (hashBigInt > 0n) {
    base62Chars.push(base62[Number(hashBigInt % 62n)])
    hashBigInt = hashBigInt / 62n
  }
  return base62Chars.reverse().join('').padStart(22, '0').slice(0, 22)
}

function encodeBase62(value) {
  if (value === 0) return '0'
  let result = []
  while (value > 0) {
    const remainder = value % 62
    result.push(base62[remainder])
    value = Math.floor(value / 62)
  }
  return result.reverse().join('')
}

function timestampToBase62(timestamp) {
  return encodeBase62(timestamp).padStart(6, '0')
}

export function getNonce(timestamp = undefined) {
  return [
    timestampToBase62(timestamp ?? Math.floor(Date.now() / 1000)),
    getRandomBase62Key(22)
  ].join('')
}

export async function getCipher(secret, ...salts) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  )
  const message = encoder.encode(salts.join('\n'))
  const signature = await crypto.subtle.sign('HMAC', key, message)
  const signatureBytes = Array.from(new Uint8Array(signature))
  return Array.from(signatureBytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function packValue(data, secret) {
  const encoder = new TextEncoder()
  const stringified = JSON.stringify(data)
  const compressed = await new Promise((resolve, reject) => {
    gzip(encoder.encode(stringified), (err, result) => (err ? reject(err) : resolve(result)))
  })
  const key = await getKeyFromSecret(secret)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, compressed)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)
  return combined.toBase64()
}

export async function unpackValue(data, secret) {
  const combined = Uint8Array.fromBase64(data)
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  const key = await getKeyFromSecret(secret)
  const compressed = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
  const decompressed = await new Promise((resolve, reject) => {
    gunzip(new Uint8Array(compressed), (err, result) => (err ? reject(err) : resolve(result)))
  })
  const stringified = decoder.decode(decompressed)
  return JSON.parse(stringified)
}
