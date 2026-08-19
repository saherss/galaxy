/**
 * Minimal GitHub contents-API client.
 *
 * GitHub Pages serves static files and cannot write anything, so the admin page
 * saves by committing straight to the repo; the deploy workflow then rebuilds
 * and republishes. That needs a token, which the owner pastes in at runtime and
 * which lives only in this browser's localStorage — it is never bundled,
 * committed, or sent anywhere but api.github.com.
 */

const REPO = 'saherss/galaxy'
const PATH = 'src/menu.json'
const TOKEN_KEY = 'gx-gh-token'

export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? ''
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t.trim())
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
})

/** Base64 that survives Arabic — btoa alone throws on non-Latin-1. */
const toBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary)
}

const fromBase64 = (b64: string) => {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export type LoadedFile = { text: string; sha: string }

/** Read the live menu.json. Cache-busted so an edit made a minute ago shows. */
export async function loadMenu(token: string): Promise<LoadedFile> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${PATH}?ref=main&t=${Date.now()}`,
    { headers: headers(token), cache: 'no-store' },
  )
  if (!res.ok) throw new Error(await describe(res))
  const body = await res.json()
  return { text: fromBase64(body.content), sha: body.sha }
}

/**
 * Commit a new menu.json. `sha` is the version this edit was based on; GitHub
 * rejects the write if someone else has committed since, so two people editing
 * at once get an error instead of silently overwriting each other.
 */
export async function saveMenu(token: string, text: string, sha: string, message: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: toBase64(text), sha, branch: 'main' }),
  })
  if (!res.ok) throw new Error(await describe(res))
  const body = await res.json()
  return body.content.sha as string
}

async function describe(res: Response) {
  let detail = ''
  try { detail = (await res.json()).message ?? '' } catch { /* body wasn't json */ }
  if (res.status === 401) return 'التوكن غير صالح أو منتهي'
  if (res.status === 403) return 'التوكن لا يملك صلاحية الكتابة على هذا المستودع'
  if (res.status === 404) return 'لم يتم العثور على الملف — تأكد من صلاحية التوكن للمستودع'
  if (res.status === 409) return 'تم تعديل الملف من مكان آخر — أعد التحميل ثم احفظ'
  return `خطأ ${res.status}${detail ? ': ' + detail : ''}`
}
