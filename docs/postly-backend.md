# Postly Backend Operating System

Postly is backend-first. Existing dashboard UI is intentionally untouched.

## Required Environment

```env
DATABASE_URL="postgresql://postgres:<password>@db.jyufyyoypqqqwcowbuus.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://jyufyyoypqqqwcowbuus.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
HERMES_AGENT_SECRET="long-random-secret"
MAKE_WEBHOOK_SECRET="long-random-secret"
```

## Hermes Flow

Hermes talks to Vercel with `x-hermes-secret: <HERMES_AGENT_SECRET>`.

0. Find brands from the Postly database:
   `GET /api/hermes/postly/brands`

   Search one brand:
   `GET /api/hermes/postly/brands?q=Luna%20Brew`

1. Fetch planned items:
   `GET /api/hermes/postly/planned`

2. Save generated draft:
   `POST /api/hermes/postly/draft`

```json
{
  "contentItemId": "content_item_id",
  "title": "Post title",
  "headline": "Main headline",
  "caption": "Caption text",
  "imagePrompt": "Image generation prompt",
  "creativeDirection": "Visual direction",
  "templateId": "optional_template_id",
  "telegramMessageId": "optional_telegram_message_id",
  "status": "WAITING_APPROVAL"
}
```

3. Record Telegram approval:
   `POST /api/hermes/postly/approval-status`

```json
{
  "contentItemId": "content_item_id",
  "telegramChatId": "chat_id",
  "telegramMessageId": "message_id",
  "status": "APPROVED",
  "revisionNote": "optional note"
}
```

4. Fetch approved items as Make-ready payloads:
   `GET /api/hermes/postly/approved`

5. After Hermes calls Make.com, record handoff:
   `POST /api/hermes/postly/sent-to-make`

```json
{
  "contentItemId": "content_item_id",
  "platforms": ["FACEBOOK", "INSTAGRAM"],
  "makeStatus": "sent_to_make",
  "makeWebhookResponse": {
    "scenarioRunId": "make-run-id"
  }
}
```

6. Write any operational log:
   `POST /api/hermes/postly/logs`

All Hermes endpoints write `AgentLog`.

Important: brands created through the Vercel/Postly backend live in Supabase, not in Hermes filesystem files such as `/opt/data/social-content/brands/postly` or `brand-registry.json`. Hermes must call the Postly API above to see backend-created brands like Luna Brew.

## Make.com Callback

Make.com talks to Vercel with `x-make-secret: <MAKE_WEBHOOK_SECRET>`.

Endpoint:
`POST /api/webhooks/make/postly`

Headers:

```txt
x-make-secret: <MAKE_WEBHOOK_SECRET>
x-idempotency-key: <stable unique run id>
```

Example:

```json
{
  "content_item_id": "content_item_id",
  "platform": "FACEBOOK",
  "status": "POSTED",
  "media_url": "https://...",
  "facebook_post_url": "https://facebook.com/...",
  "assets": [
    {
      "asset_type": "IMAGE",
      "file_url": "https://...",
      "slide_order": 1
    }
  ]
}
```

The webhook is idempotent, stores raw payloads, updates `ContentItem`, creates `ContentAsset`, writes `PostingLog`, and writes `AgentLog`.

## Migration

The migration is ready at:

```txt
prisma/migrations/202606010001_postly_backend_foundation/migration.sql
```

Apply after `DATABASE_URL` contains the real Supabase database password:

```bash
npx prisma migrate deploy
npm run seed:postly
```
