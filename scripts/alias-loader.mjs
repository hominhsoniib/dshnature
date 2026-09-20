import path from 'node:path'
import { pathToFileURL } from 'node:url'

const SRC_DIR = path.resolve(process.cwd(), 'src')

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = pathToFileURL(path.join(SRC_DIR, specifier.slice(2))).href
    return nextResolve(target, context)
  }
  return nextResolve(specifier, context)
}
