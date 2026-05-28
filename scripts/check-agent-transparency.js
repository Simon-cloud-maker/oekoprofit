#!/usr/bin/env node
/**
 * CI / pre-commit guard for agent transparency logs.
 * See prompts/templates/agent-transparency-contract.md
 */

const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const TRIGGER_PREFIXES = [
  'index.html',
  'benchmarks.js',
  'api/',
  'prompts/stages/',
  'prompts/personas/',
];

const REQUIRED_ON_TRIGGER = ['logs/actions.md', 'memory/short_term.md'];

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function parseArgs() {
  const args = process.argv.slice(2);
  let base = process.env.TRANSPARENCY_BASE || 'HEAD~1';
  let head = process.env.TRANSPARENCY_HEAD || 'HEAD';
  let working = false;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--base' && args[i + 1]) {
      base = args[++i];
    } else if (args[i] === '--head' && args[i + 1]) {
      head = args[++i];
    } else if (args[i] === '--working') {
      working = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`Usage: node scripts/check-agent-transparency.js [--base REF] [--head REF] [--working]

Modes:
  default     Compare git diff REF..HEAD (CI / last commit)
  --working   Compare uncommitted changes vs HEAD (before agent:finish commit)

If trigger paths changed, requires: ${REQUIRED_ON_TRIGGER.join(', ')}

Env: TRANSPARENCY_BASE, TRANSPARENCY_HEAD`);
      process.exit(0);
    }
  }

  return { base, head, working };
}

function listChangedFiles(base, head) {
  try {
    const out = git(['diff', '--name-only', `${base}...${head}`]);
    if (!out) return [];
    return out.split('\n').filter(Boolean);
  } catch {
    try {
      const out = git(['diff', '--name-only', base, head]);
      if (!out) return [];
      return out.split('\n').filter(Boolean);
    } catch (err) {
      console.warn('Could not compute git diff; skipping transparency check.');
      console.warn(String(err.message || err));
      return null;
    }
  }
}

function listWorkingTreeFiles() {
  try {
    const tracked = git(['diff', '--name-only', 'HEAD']);
    const untracked = git(['ls-files', '--others', '--exclude-standard']);
    const all = new Set([
      ...(tracked ? tracked.split('\n') : []),
      ...(untracked ? untracked.split('\n') : []),
    ]);
    return [...all].filter(Boolean);
  } catch (err) {
    console.warn('Could not list working tree changes; skipping transparency check.');
    console.warn(String(err.message || err));
    return null;
  }
}

function matchesTrigger(file) {
  return TRIGGER_PREFIXES.some((prefix) => file === prefix || file.startsWith(prefix));
}

function runCheck(changed, label) {
  if (changed === null) {
    process.exit(0);
  }

  if (changed.length === 0) {
    console.log(`Agent transparency (${label}): no changed files — OK.`);
    process.exit(0);
  }

  const triggered = changed.some(matchesTrigger);
  if (!triggered) {
    console.log(`Agent transparency (${label}): no trigger paths changed — OK.`);
    console.log(`Checked ${changed.length} file(s).`);
    process.exit(0);
  }

  const missing = REQUIRED_ON_TRIGGER.filter((req) => !changed.includes(req));
  if (missing.length === 0) {
    console.log(`Agent transparency (${label}): trigger paths changed and required logs present — OK.`);
    process.exit(0);
  }

  console.error(`Agent transparency check FAILED (${label}).\n`);
  console.error('Substantive files changed (examples):');
  changed.filter(matchesTrigger).forEach((f) => console.error(`  - ${f}`));
  console.error('\nMissing updates (required by agent-transparency-contract):');
  missing.forEach((f) => console.error(`  - ${f}`));
  console.error('\nUpdate logs/actions.md and memory/short_term.md before commit.');
  console.error('See prompts/templates/agent-transparency-contract.md');
  process.exit(1);
}

function main() {
  const { base, head, working } = parseArgs();

  if (working) {
    runCheck(listWorkingTreeFiles(), 'working tree');
    return;
  }

  runCheck(listChangedFiles(base, head), `${base}...${head}`);
}

main();
