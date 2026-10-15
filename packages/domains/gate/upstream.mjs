/**
 * `node --import ./gate/upstream.mjs …` registers the resolve hook in `upstream-resolve.mjs` when
 * GATE_UPSTREAM_ROOT is set (scripts/gate-upstream.sh sets it). Without it, this does nothing.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = process.env.GATE_UPSTREAM_ROOT;
if (root) {
  register('./upstream-resolve.mjs', import.meta.url, {
    data: { root: pathToFileURL(`${root.replace(/\/$/, '')}/`).href },
  });
}
