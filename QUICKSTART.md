# Quickstart — running a phase with Claude Code

FoundationOS is built one phase at a time. Each Claude Code session should only ever be working
on **one** phase, and should stop at the end of it.

## Every session, in order

1. Point Claude Code at this repository.
2. Paste `AI/SESSION_START.md` as your first message (or manually have it read, in this order):
   - `AI/CLAUDE.md`
   - `AI/PROJECT_MEMORY.md`
   - `AI/ARCHITECTURE.md`
   - `AI/CURRENT_STATE.md`
   - `AI/DECISIONS.md`
   - `AI/DO_NOT_CHANGE.md`
   - `AI/ACTIVE_PHASE.md`
3. Do **not** rely on prior conversation history — the files above are the memory, not the chat.
4. Copy the prompt from the matching `PHASES/NN_*.md` file into the session.
5. Let Claude work through the phase's 15-step loop (see `AI/CLAUDE.md` §Claude Loop).
6. When Claude reports back and stops, verify the phase's Definition of Done checklist.
7. If it passes: update `AI/ACTIVE_PHASE.md` to the next phase, commit, and start a **new**
   session for the next phase. If it fails: fix in place before advancing — do not skip ahead.

## Token/spend discipline

- Never load all of `SPECS/` or all of `PHASES/` in one session — only the active phase file and
  the specs it explicitly references.
- The AI memory files (`AI/`) are intentionally short. If one is growing past a page or two,
  split detail out into a `SPECS/` file and leave a pointer.
- Donor sources (`01-SOURCES/`) are read for audit/reference, not loaded wholesale into context —
  grep/search for the specific thing being adapted.

## First session — Phase 00

Phase 00 sets up the local dev environment. Phase 01 (Audit) is the very first phase that touches
the codebase, and it is explicitly read-only — see `PHASES/01_AUDIT.md`. Do not let Claude build
before that audit is committed.
