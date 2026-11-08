import { readFileSync } from 'fs'
import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const varsPath = join(root, '.dev.vars')

const args = ['pages', 'dev', 'dist', '--port', '8788', '--d1', 'DB=35660f49-87c6-46a3-9215-f2518733ab27']

try {
  const lines = readFileSync(varsPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue
    args.push('-b', `${trimmed.slice(0, idx)}=${trimmed.slice(idx + 1)}`)
  }
} catch {}

const child = spawn('bunx', ['wrangler', ...args], { cwd: root, stdio: 'inherit', shell: true })
child.on('exit', (code) => process.exit(code ?? 0))
