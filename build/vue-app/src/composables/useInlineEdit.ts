export type EditOverrides = Record<string, string>

const CANDIDATE = 'h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote,span,div,strong,em,label,figcaption'
const SKIP =
  'a,button,input,textarea,select,code,pre,svg,script,style,nav,footer,header,' +
  '.geek-nav,.btn-geek,.tag-pill,.badge-geek,.no-edit,.typewriter,.typewriter-cursor,' +
  '.search-modal,.modal-mask,.inline-edit-toolbar,.toast,.foot,.status'

export function collectEditable(root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = []
  for (const node of Array.from(root.querySelectorAll('*'))) {
    if (!(node instanceof HTMLElement)) continue
    if (node.closest(SKIP)) continue
    if (node.children.length > 0) continue
    const text = node.textContent || ''
    if (!text.trim()) continue
    if (!node.matches(CANDIDATE)) continue
    out.push(node)
  }
  return out
}

function stableClass(el: HTMLElement): string {
  if (typeof el.className !== 'string') return ''
  const parts = el.className
    .trim()
    .split(/\s+/)
    .filter((c) => c && !c.startsWith('inline-'))
    .slice(0, 2)
  return parts.length ? '.' + parts.join('.') : ''
}

export function keyOf(root: HTMLElement, el: HTMLElement): string {
  const parts: string[] = []
  let cur: HTMLElement | null = el
  while (cur && cur !== root) {
    const parent = cur.parentElement
    if (!parent) break
    const index = Array.from(parent.children).indexOf(cur)
    parts.unshift(`${cur.tagName.toLowerCase()}${stableClass(cur)}@${index}`)
    cur = parent
  }
  return parts.join('>')
}

export function applyOverrides(root: HTMLElement, overrides: EditOverrides) {
  for (const el of collectEditable(root)) {
    const value = overrides[keyOf(root, el)]
    if (typeof value === 'string' && el.textContent !== value) el.textContent = value
  }
}

export function enableEditing(root: HTMLElement) {
  for (const el of collectEditable(root)) {
    if (el.dataset.inlineEdit === '1') continue
    el.dataset.inlineEdit = '1'
    el.classList.add('inline-editable')
    try {
      el.contentEditable = 'plaintext-only'
    } catch {
      el.contentEditable = 'true'
    }
    if (!el.isContentEditable) el.contentEditable = 'true'
    el.spellcheck = false
  }
}

export function disableEditing(root: HTMLElement) {
  for (const el of Array.from(root.querySelectorAll('[data-inline-edit]'))) {
    if (!(el instanceof HTMLElement)) continue
    el.contentEditable = 'false'
    el.removeAttribute('contenteditable')
    el.classList.remove('inline-editable')
    delete el.dataset.inlineEdit
  }
}

export function readOverrides(root: HTMLElement): EditOverrides {
  const out: EditOverrides = {}
  for (const el of collectEditable(root)) {
    out[keyOf(root, el)] = el.textContent || ''
  }
  return out
}

export async function loadEdits(path: string): Promise<EditOverrides> {
  try {
    const res = await fetch(`/api/page-edits?path=${encodeURIComponent(path)}`)
    const data = await res.json()
    if (!res.ok || !data.overrides || typeof data.overrides !== 'object') return {}
    if (Array.isArray(data.overrides)) return {}
    return data.overrides as EditOverrides
  } catch {
    return {}
  }
}

export async function saveEdits(
  path: string,
  overrides: EditOverrides,
  headers: Record<string, string>,
): Promise<void> {
  const res = await fetch('/api/page-edits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ path, overrides }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || '保存失败')
  }
}
