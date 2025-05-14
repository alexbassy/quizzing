import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isWatch = process.argv.includes('--watch')

try {
  await build({
    bundle: true,
    sourcemap: true,
    platform: 'browser',
    conditions: ['worker', 'browser'],
    format: 'esm',
    target: 'es2020',
    outExtension: { '.js': '.mjs' },
    entryPoints: [path.join(__dirname, 'src', 'worker', 'handler.ts')],
    outdir: path.join(__dirname, 'dist-worker'),
    define: {
      'process.env.NODE_ENV': process.env.NODE_ENV,
    },
    watch: isWatch && {
      onRebuild(error, result) {
        if (error) {
          console.error('Rebuild failed:', error)
        } else {
          console.log('Rebuild succeeded')
        }
      },
    },
  })
  if (isWatch) {
    console.log('Watching for changes...')
  }
} catch (e) {
  console.log(e)
  process.exitCode = 1
}
