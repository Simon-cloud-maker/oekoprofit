# Git automation policy (agent runs)

Use with **`npm run agent:finish`** at the end of every completed agent run (see `prompts/agent-runs/*.md`).

## Default behavior

1. Run **`npm run check:transparency:working`** (uncommitted diff vs `HEAD`).
2. Stage all changes **except** `.env*`, `node_modules/`, `.vercel/`.
3. **Commit** with the message you pass on the command line.
4. **Push** to `origin` on the current branch — **except on `main`** (blocked by default).

## Commands

```bash
# Commit + push on feature branch (default)
npm run agent:finish -- "feat(benchmark): stronger ampel bar colors"

# Commit only, no push
OEKOPROFIT_AUTO_PUSH=0 npm run agent:finish -- "docs: update memory"

# Explicit override for main (discouraged)
OEKOPROFIT_ALLOW_MAIN_COMMIT=1 OEKOPROFIT_ALLOW_MAIN_PUSH=1 npm run agent:finish -- "..."
```

## Safety rules

| Rule | Why |
|------|-----|
| No auto push to **`main`** | Avoid breaking production / Vercel without review |
| Transparency check before commit | Same contract as CI |
| Never stage **`.env*`** | Secrets stay local |
| Feature branch preferred | `feature/<topic>` matches existing workflow |

## CI alignment

After push, GitHub Action **Agent transparency** validates the commit on `main` / PRs.

Local preflight:

```bash
npm run check:transparency:working   # before commit
npm run check:transparency           # last commit vs previous
```

## Agent instruction

When executing an **`prompts/agent-runs/*`** file, step **Finish** is mandatory:

```bash
npm run agent:finish -- "<type>(scope): short why-focused message"
```

Do **not** wait for the user to say „commit“ or „push“ unless they set `OEKOPROFIT_AUTO_PUSH=0` for that session.
