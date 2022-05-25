import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  try {
    await build({
      bundle: true,
      sourcemap: true,
      platform: 'node',
      format: 'esm',
      target: 'esnext',
      entryPoints: [path.join(__dirname, 'src', 'worker', 'handler.ts')],
      outdir: path.join(__dirname, 'dist-worker'),
    })
  } catch (e) {
    console.log(e)
    process.exitCode = 1
  }
}

main().then()
