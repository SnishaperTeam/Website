import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(__dirname, '..', 'dist')
const dest = path.join(__dirname, '..', '..', '..')

if (!fs.existsSync(src)) { console.error('dist not found'); process.exit(1) }

fs.cpSync(src, dest, { recursive: true, force: true })

const projectRoot = path.join(__dirname, '..')
for (const dir of ['functions', 'db']) {
  const from = path.join(projectRoot, dir)
  const to = path.join(dest, dir)
  if (fs.existsSync(from)) {
    fs.cpSync(from, to, { recursive: true, force: true })
    console.log(`Deployed ${from} -> ${to}`)
  }
}

const wranglerFrom = path.join(projectRoot, 'wrangler.toml')
if (fs.existsSync(wranglerFrom)) {
  fs.copyFileSync(wranglerFrom, path.join(dest, 'wrangler.toml'))
  console.log('Deployed wrangler.toml')
}

console.log(`Deployed ${src} -> ${dest}`)
