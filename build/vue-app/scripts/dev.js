import { spawn } from 'child_process'

const procs = [
  spawn('bun', ['run', '--bun', 'vite'], { stdio: 'inherit', shell: true }),
  spawn('bun', ['scripts/dev-api.js'], { stdio: 'inherit', shell: true }),
]

for (const proc of procs) {
  proc.on('exit', (code) => {
    for (const other of procs) {
      if (other !== proc) other.kill()
    }
    process.exit(code ?? 0)
  })
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    for (const proc of procs) proc.kill()
    process.exit(0)
  })
}
