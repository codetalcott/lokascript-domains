#!/usr/bin/env node
/**
 * Set one version across every package in the workspace.
 *
 * Sets each package's `version`, the root `version`, AND rewrites every
 * internal workspace dependency range to `^<version>`. npm has no `workspace:`
 * protocol: caret ranges are how the aggregate and domain-config reach the
 * private workspace packages, and npm links to the workspace copy ONLY while
 * the range is satisfied. A stale range (`^2.11.0` against a 3.0.0 workspace
 * package) makes npm silently fetch the deprecated 2.10.0 tarball from the
 * registry instead — nothing in the build notices until pack-smoke or a
 * consumer does. Keeping the ranges in lockstep with the version here closes
 * that hazard.
 *
 * Upstream ranges (@lokascript/framework, /semantic, /intent,
 * @hyperfixi/patterns-reference) are NOT touched: they track hyperfixi's
 * major deliberately, see README "Versioning".
 *
 * Ported from hyperfixi/scripts/set-version.cjs (minus its runtime
 * version.ts regeneration and lerna sync, neither of which exists here).
 *
 * Usage: node scripts/set-version.cjs <version>
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: node scripts/set-version.cjs <version>');
  console.error('Example: node scripts/set-version.cjs 3.0.0');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/.test(version)) {
  console.error(`Invalid version format: ${version}`);
  console.error('Expected format: X.Y.Z or X.Y.Z-alpha.1');
  process.exit(1);
}

const range = `^${version}`;
const DEP_FIELDS = ['dependencies', 'peerDependencies', 'devDependencies'];

const packagesDir = path.join(__dirname, '../packages');
const packages = fs
  .readdirSync(packagesDir)
  .filter(dir => fs.existsSync(path.join(packagesDir, dir, 'package.json')));

// Pass 1: collect the names of all workspace packages.
const internalNames = new Set();
for (const dir of packages) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(packagesDir, dir, 'package.json'), 'utf8'));
    if (pkg.name) internalNames.add(pkg.name);
  } catch {
    /* reported in pass 2 */
  }
}

let updated = 0;
let errors = 0;
let depsRewritten = 0;

console.log(`Setting version to ${version} for ${packages.length} packages...\n`);

// Pass 2: set each package's version and rewrite its internal dep ranges.
for (const dir of packages) {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const oldVersion = pkg.version;
    pkg.version = version;

    for (const field of DEP_FIELDS) {
      const deps = pkg[field];
      if (!deps) continue;
      for (const name of Object.keys(deps)) {
        if (internalNames.has(name) && deps[name] !== range) {
          deps[name] = range;
          depsRewritten++;
        }
      }
    }

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ ${pkg.name}: ${oldVersion} → ${version}`);
    updated++;
  } catch (err) {
    console.error(`❌ ${dir}: ${err.message}`);
    errors++;
  }
}

// Root package.json (version only — it has no internal deps).
const rootPkgPath = path.join(__dirname, '../package.json');
try {
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  const oldVersion = rootPkg.version;
  rootPkg.version = version;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
  console.log(`✅ root package.json: ${oldVersion} → ${version}`);
  updated++;
} catch (err) {
  console.error(`❌ root package.json: ${err.message}`);
  errors++;
}

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated} files`);
console.log(`   Internal dependency ranges rewritten: ${depsRewritten}`);
console.log(`   Errors: ${errors} files`);
console.log(`\nNext: npm install (refresh package-lock.json), then npm run version:validate`);

if (errors > 0) process.exit(1);
