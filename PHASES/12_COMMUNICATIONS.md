# Phase 12 — Communications + FormFlow

## Prompt

```
FoundationOS v3.60, Phase 12 — Communications + FormFlow.

Read AI/CLAUDE.md, AI/PROJECT_MEMORY.md, AI/ARCHITECTURE.md, AI/CURRENT_STATE.md, AI/DECISIONS.md,
AI/DO_NOT_CHANGE.md, AI/ACTIVE_PHASE.md, SPECS/COMMUNICATIONS.md, and SPECS/FORMFLOW.md.

Goal, in order:
1. Build FoundationOS Communications core: conversations, participants, messages, attachments
   (reuse Media Library), internal chat, notifications.
2. Build ONE channel plugin (web chat) on top of core — prove channels are plugins, not
   architecture, per AI/DO_NOT_CHANGE.md.
3. Extend the Phase 08 FormFlow engine with a chat-form renderer, using the same JSON schema.
4. WhatsApp integration is a channel plugin stub only in this phase — do not build a production
   WhatsApp integration without explicit confirmation; note it as a follow-up.

Follow the Claude Loop. Update SPECS/COMMUNICATIONS.md, SPECS/FORMFLOW.md, AI/ARCHITECTURE.md,
AI/CURRENT_STATE.md.

STOP after Definition of Done passes.
```

## Definition of Done

- [ ] Communications core built (conversations/messages/participants/attachments/notifications)
- [ ] Web chat channel plugin works end-to-end
- [ ] FormFlow renders a chat form from the same schema as web/mobile
- [ ] WhatsApp noted as follow-up, not built without separate confirmation
- [ ] Docs + memory updated
