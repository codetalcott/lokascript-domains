#!/usr/bin/env node
/**
 * Validate that every workspace package, the root, and every internal
 * dependency range agree on one version. Runs in CI and as the first step
 * of the publish workflow, so a publish can never run from a tree that
 * set-version.cjs did not produce.
 *
 * Checks:
 *   1. All package versions (packages/* + root) are identical.
 *   2. Every internal (workspace) dependency range is exactly `^<version>`.
 *      A stale range makes npm fetch the deprecated registry copy of a
 *      private package instead of linking the workspace — silently.
 *   3. The upstream ranges (@lokascript/framework, /semantic, /intent) agree
 *      on ONE major across all packages, and it is the major the aggregate's
 *      OWN version targets. The aggregate's major tracks the framework major
 *      it is built against (see README "Versioning"). A range may also accept
 *      the NEXT major (`^3.1.0 || ^4.0.0`) when that major is the same
 *      contract renumbered; the FIRST alternative is the major it is built
 *      against, and every later one must be a caret range on a higher major.
 *
 * Ported from hyperfixi/scripts/validate-versions.cjs, extended with 2 and 3.
 */

const fs = require('fs');
const path = require('path');

const UPSTREAM = ['@lokascript/framework', '@lokascript/semantic', '@lokascript/intent'];
const DEP_FIELDS = ['dependencies', 'peerDependencies', 'devDependencies'];

const root = path.join(__dirname, '..');
const packagesDir = path.join(root, 'packages');
const manifests = fs
  .readdirSync(packagesDir)
  .filter(dir => fs.existsSync(path.join(packagesDir, dir, 'package.json')))
  .map(dir => ({
    label: dir,
    pkg: JSON.parse(fs.readFileSync(path.join(packagesDir, dir, 'package.json'), 'utf8')),
  }));
const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const internalNames = new Set(manifests.map(m => m.pkg.name));
const problems = [];

// 1. One version everywhere.
const versions = new Map(manifests.map(m => [m.pkg.name, m.pkg.version]));
versions.set('root', rootPkg.version);
const unique = [...new Set(versions.values())];
if (unique.length !== 1) {
  problems.push('Version mismatch:');
  for (const v of unique) {
    problems.push(`  ${v}:`);
    for (const [name, pv] of versions) if (pv === v) problems.push(`    - ${name}`);
  }
}
const version = rootPkg.version;
const expectedRange = `^${version}`;

// 2. Internal ranges are exactly ^version.
for (const { label, pkg } of manifests) {
  for (const field of DEP_FIELDS) {
    for (const [name, r] of Object.entries(pkg[field] ?? {})) {
      if (internalNames.has(name) && r !== expectedRange) {
        problems.push(`${label} ${field}.${name} = "${r}" (expected "${expectedRange}")`);
      }
    }
  }
}

// 3. Upstream majors agree, and match the aggregate's own major.
// The major a range is built against: its first `||` alternative's. Later
// alternatives (a bridge to the next major) must be carets on higher majors.
const majorOf = r => {
  const [first, ...rest] = r.split('||').map(a => a.trim());
  const m = /^[\^~]?(\d+)\./.exec(first);
  if (!m) return null;
  for (const alt of rest) {
    const n = /^\^(\d+)\.\d+\.\d+$/.exec(alt);
    if (!n || Number(n[1]) <= Number(m[1])) return null;
  }
  return Number(m[1]);
};
const upstreamMajors = new Map();
for (const { label, pkg } of manifests) {
  for (const field of DEP_FIELDS) {
    for (const [name, r] of Object.entries(pkg[field] ?? {})) {
      if (!UPSTREAM.includes(name)) continue;
      const major = majorOf(r);
      if (major === null) {
        problems.push(`${label} ${field}.${name} = "${r}" is not a caret/tilde semver range (or a "^X || ^X+1" bridge)`);
        continue;
      }
      if (!upstreamMajors.has(major)) upstreamMajors.set(major, []);
      upstreamMajors.get(major).push(`${label} ${field}.${name} = "${r}"`);
    }
  }
}
if (upstreamMajors.size > 1) {
  problems.push('Upstream (@lokascript/framework|semantic|intent) ranges span more than one major:');
  for (const [major, refs] of upstreamMajors) {
    problems.push(`  ${major}.x:`);
    for (const ref of refs) problems.push(`    - ${ref}`);
  }
} else if (upstreamMajors.size === 1) {
  const [upstreamMajor] = upstreamMajors.keys();
  const ownMajor = majorOf(version);
  if (upstreamMajor !== ownMajor) {
    problems.push(
      `Aggregate version ${version} (major ${ownMajor}) targets framework major ${upstreamMajor}; ` +
        `the aggregate's major must equal the framework major it is built against.`
    );
  }
}

if (problems.length === 0) {
  console.log(`✅ All ${versions.size} packages at version ${version}; internal ranges ${expectedRange}; upstream major ${[...upstreamMajors.keys()][0] ?? '(none)'}.x`);
  process.exit(0);
}

console.error('❌ Version validation failed\n');
for (const p of problems) console.error(p);
console.error('\n💡 Run: node scripts/set-version.cjs <version> && npm install');
process.exit(1);
