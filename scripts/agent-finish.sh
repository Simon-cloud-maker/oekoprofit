#!/usr/bin/env bash
# End-of-agent-run: transparency check, commit, optional push.
# See prompts/templates/git-automation-policy.md

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMMIT_MSG="${*:-chore(agent): session checkpoint}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
AUTO_PUSH="${OEKOPROFIT_AUTO_PUSH:-1}"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "agent:finish — nothing to commit."
  exit 0
fi

echo "agent:finish — running transparency check (working tree)…"
node scripts/check-agent-transparency.js --working

# Stage changes but never secrets / deps
git add -A
git reset HEAD -- .env .env.* node_modules 2>/dev/null || true
git reset HEAD -- .vercel 2>/dev/null || true

if [[ -z "$(git diff --cached --name-only)" ]]; then
  echo "agent:finish — no staged files after exclusions."
  exit 0
fi

if [[ "$BRANCH" == "main" && "${OEKOPROFIT_ALLOW_MAIN_COMMIT:-0}" != "1" ]]; then
  echo "agent:finish — refusing commit on main."
  echo "Create a feature branch: git checkout -b feature/<topic>"
  echo "Or set OEKOPROFIT_ALLOW_MAIN_COMMIT=1 if you really intend main."
  exit 1
fi

git commit -m "$COMMIT_MSG"
echo "agent:finish — committed on $BRANCH."

if [[ "$AUTO_PUSH" == "1" ]]; then
  if [[ "$BRANCH" == "main" && "${OEKOPROFIT_ALLOW_MAIN_PUSH:-0}" != "1" ]]; then
    echo "agent:finish — skip push on main (set OEKOPROFIT_ALLOW_MAIN_PUSH=1 to override)."
    exit 0
  fi
  git push -u origin HEAD
  echo "agent:finish — pushed to origin/$BRANCH."
else
  echo "agent:finish — push skipped (OEKOPROFIT_AUTO_PUSH=0)."
fi
