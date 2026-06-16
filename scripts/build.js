import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const baseArg = process.argv.find((arg) => arg.startsWith('--base='))
const base = baseArg ? baseArg.slice('--base='.length) : process.env.VITE_BASE_PATH || '/'

const __dirname = dirname(fileURLToPath(import.meta.url))
const viteBin = resolve(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js')

const result = spawnSync(process.execPath, [viteBin, 'build', '--config', 'vite.config.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_BASE_PATH: base
  }
})

if (result.status !== 0) {
  process.exit(result.status || 1)
}

const notFoundSource = resolve('404.html')
const notFoundTarget = resolve('dist', '404.html')

if (existsSync(notFoundSource)) {
  copyFileSync(notFoundSource, notFoundTarget)
}

console.log(`Built Clearview Square with base path: ${base}`)
