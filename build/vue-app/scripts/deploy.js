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

const rootWrangler = path.join(dest, 'wrangler.toml')
fs.writeFileSync(
  rootWrangler,
  [
    'name = "jetcpppages"',
    'compatibility_date = "2024-11-01"',
    'pages_build_output_dir = "build/vue-app/dist"',
    '',
    '[vars]',
    'WRANGLER_CFG_MARK = "yes"',
    '',
    '[[d1_databases]]',
    'binding = "DB"',
    'database_name = "snishaper-web"',
    'database_id = "35660f49-87c6-46a3-9215-f2518733ab27"',
    '',
  ].join('\n'),
)
console.log('Deployed wrangler.toml (pages root)')

console.log(`Deployed ${src} -> ${dest}`)
