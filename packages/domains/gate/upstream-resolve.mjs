/**
 * Resolve hook for `npm run gate:upstream`: every import of @lokascript/framework, semantic or intent
 * resolves as if made from GATE_UPSTREAM_ROOT, whose node_modules holds those packages unpacked from
 * tarballs (an unpublished hyperfixi build). Everything else resolves as usual, so the repo's own built
 * dist runs on the other framework: the aggregate keeps all three external.
 */
const NAMES = ['@lokascript/framework', '@lokascript/semantic', '@lokascript/intent'];

let parentURL;

export function initialize(data) {
  parentURL = new URL('resolver.js', data.root).href;
}

export function resolve(specifier, context, nextResolve) {
  if (NAMES.some(name => specifier === name || specifier.startsWith(`${name}/`)))
    return nextResolve(specifier, { ...context, parentURL });
  return nextResolve(specifier, context);
}
