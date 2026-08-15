# SPECS/FORMFLOW.md — FormFlow spec

Status: initial design captured at project planning time; finalized during Phase 08 (web +
mobile-step renderers) and extended in Phase 12 (chat renderer).

## Principle

One JSON form definition renders as a web form, a mobile step-by-step form, a chat form, or a
WhatsApp-style flow — the schema doesn't change per surface, only the renderer does.

```
FORM JSON → FORM ENGINE → WEB FORM / MOBILE FORM / CHAT FORM / WHATSAPP FLOW
```

## Example schema

```json
{
  "form": "purchase_request",
  "version": 1,
  "steps": [
    { "type": "text",   "key": "description", "question": "What do you need?" },
    { "type": "number", "key": "quantity",     "question": "How many?" },
    { "type": "select", "key": "department",   "question": "Which department?", "options": "departments" },
    { "type": "media",  "key": "attachment",   "question": "Please attach a photo or document." }
  ]
}
```

### Same schema, different surfaces

**Web:** a single-page form — "Purchase Request" with all four fields visible at once.

**Mobile (step-by-step):**
```
What do you need?
      ↓
How many?
      ↓
Which department?
      ↓
📷 Attach
```

**Chat:**
```
🤖 What do you need?
User: 20 boxes of paper
🤖 How many?
User: 20
🤖 Which department?
User: Production
🤖 Please attach a photo/document.
User: 📎 photo.jpg
```

WhatsApp is the same chat renderer over a different transport channel (see
`SPECS/COMMUNICATIONS.md`) — not a separate form engine.

## Phasing

- **Phase 08:** schema format finalized; web + mobile-step renderers; shared validation/submission
  pipeline.
- **Phase 12:** chat renderer added, reusing the same schema and pipeline; WhatsApp channel is a
  stub/follow-up, not built in Phase 12 itself without separate confirmation.

## To be filled in during Phase 08/12

- Full field-type list (beyond text/number/select/media)
- Conditional/branching steps (if any)
- Where form definitions are stored/versioned
