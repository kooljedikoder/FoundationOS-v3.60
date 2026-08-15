# FoundationOS v3.60

FoundationOS is a reusable **Business Application OS** built on Laravel 13 + Filament 5, designed
to be developed phase-by-phase with Claude Code without the AI wandering off-architecture between
sessions.

This repository is the **build pack**: the permanent constitution, the AI memory system, and the
disposable phase-by-phase execution prompts. It does not yet contain the application itself —
donor sources and the FoundationOS codebase are added starting at Phase 00.

## Start here

1. Read [`FOUNDATIONOS_MASTER.md`](./FOUNDATIONOS_MASTER.md) — the permanent architecture and rules.
2. Read [`QUICKSTART.md`](./QUICKSTART.md) — how to run a phase with Claude Code.
3. Open [`AI/ACTIVE_PHASE.md`](./AI/ACTIVE_PHASE.md) to see what phase we're on.
4. Paste [`AI/SESSION_START.md`](./AI/SESSION_START.md) as your first message, then copy the
   matching prompt from [`PHASES/`](./PHASES) into Claude Code.

## Structure

| Path | Purpose |
|---|---|
| `FOUNDATIONOS_MASTER.md` | Vision, stack, architecture rules, phase roadmap, definition of done |
| `QUICKSTART.md` | How to run a Claude Code session against this pack |
| `AI/` | Persistent project memory — read by Claude at the start of every session |
| `PHASES/` | 15 disposable phase prompts (00–14), run one at a time |
| `SPECS/` | Detailed specs for subsystems referenced by phases |
| `LICENCES/` | Third-party / donor licence tracking |

Donor source code (Aureus, ERPKit, Liberu, plus candidates FilaKit and Lara Dashboard — see
`AI/DECISIONS.md` ADR-008) and the live FoundationOS application are added as
separate folders (`01-SOURCES/`, `04-FOUNDATIONOS/`, etc. — see `FOUNDATIONOS_MASTER.md` §Folder
System) once Phase 00 begins. This initial commit is docs-and-memory only, by design — see
`PHASES/01_AUDIT.md`.
