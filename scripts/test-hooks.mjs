import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

const srcRoot = new URL('../src/', import.meta.url).href;

function alias(specifier) {
  if (!specifier.startsWith('@/')) return null;
  return new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
}

export async function resolve(specifier, context, nextResolve) {
  const mapped = alias(specifier);
  if (mapped) return nextResolve(mapped.href, context);
  if (specifier.startsWith('.') && context.parentURL?.startsWith(srcRoot)) {
    const target = new URL(specifier, context.parentURL);
    if (!target.pathname.endsWith('.ts') && !target.pathname.endsWith('.js') && !target.pathname.endsWith('.mjs')) {
      target.pathname += '.ts';
    }
    return nextResolve(target.href, context);
  }
  if (isAbsolute(specifier)) return nextResolve(pathToFileURL(specifier).href, context);
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (url.startsWith('file:') && /\.(png|jpe?g|gif|webp)$/.test(new URL(url).pathname)) {
    return { format: 'module', source: 'export default 1;', shortCircuit: true };
  }
  return nextLoad(url, context);
}
