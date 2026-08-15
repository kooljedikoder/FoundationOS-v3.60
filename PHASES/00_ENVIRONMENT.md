# Phase 00 — Environment

## Preconditions (human operator, not Claude)

- PHP, Composer, MySQL installed
- MySQL database + user created
- `.env` configured with DB credentials

## Prompt

```
You are working on FoundationOS v3.60, Phase 00 — Environment.

First read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md,
AI/DECISIONS.md, AI/DO_NOT_CHANGE.md, and AI/ACTIVE_PHASE.md. Do not rely on previous
conversation history.

Your task this phase is ONLY to get a working local development environment. Do not build
FoundationOS features yet.

1. Verify PHP, Composer, and MySQL versions and connectivity from .env.
2. Install the Aureus ERP starting codebase into 01-SOURCES/AUREUS (read-only from this point on).
3. composer require laravel/boost --dev, then php artisan boost:install. Verify Boost's MCP tools
   are reachable from Claude Code.
4. Run existing migrations against the configured database — do not modify schema yet.
5. Confirm the app boots (php artisan serve or equivalent) and the Filament admin panel loads.
6. Do NOT install ERPKit or Liberu yet — that happens for reference during Phase 01.

Write a short environment report to AI/CURRENT_STATE.md (versions, what booted, what didn't) and
update AI/ACTIVE_PHASE.md to Phase 01 only if everything above passes.

STOP after reporting. Do not continue into Phase 01.
```

## Definition of Done

- [ ] PHP/Composer/MySQL versions confirmed and recorded
- [ ] Aureus checked out under `01-SOURCES/AUREUS`
- [ ] Laravel Boost installed and its MCP tools reachable
- [ ] Migrations run cleanly against the configured DB
- [ ] App boots; Filament admin panel loads
- [ ] `AI/CURRENT_STATE.md` updated
