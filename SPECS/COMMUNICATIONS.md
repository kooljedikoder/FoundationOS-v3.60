# SPECS/COMMUNICATIONS.md — Communications spec

Status: initial design captured at project planning time; finalized during Phase 12.

## Principle

WhatsApp is a channel, not the architecture (frozen in `AI/DO_NOT_CHANGE.md`). Core owns the
conversation model; channels are plugins (per `SPECS/MODULES.md`) that adapt core conversations to
a specific transport.

## Component ownership

| Component | Owner |
|---|---|
| Conversations | Core |
| Participants | Core |
| Messages | Core |
| Attachments | Core + Media Library |
| Internal chat | Core |
| Notifications | Core |
| Channels (transport adapters) | Plugin |
| WhatsApp | Channel plugin |
| Email | Channel plugin |
| SMS | Channel plugin |
| Web chat | Channel plugin |
| Forms (chat-form rendering) | FormFlow (`SPECS/FORMFLOW.md`) |
| Chat forms | FormFlow |
| Media capture in chat | FormFlow |
| Templates | Communications |
| Automations | Workflow (Phase 09 engine) |
| AI assistant | Optional, future |

## Phasing

- **Phase 12** builds Communications core plus exactly one channel plugin (web chat) to prove the
  separation, and adds FormFlow's chat renderer.
- WhatsApp integration is noted as a follow-up channel plugin, not built without a separate,
  explicit confirmation — it likely involves external API keys/costs the human operator should
  approve first.

## To be filled in during Phase 12

- Conversation/message schema
- Notification delivery mechanism (in-app vs. email vs. push)
- Channel plugin contract (how a channel maps its inbound events to core messages, and core
  messages to its outbound API)
