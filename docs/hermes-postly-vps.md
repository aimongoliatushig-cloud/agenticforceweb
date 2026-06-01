# Hermes VPS Postly Integration

Hermes VPS:

```env
HERMES_BASE_URL="http://72.62.197.97:8644"
HERMES_HOME="/opt/data"
HERMES_PROJECT="/opt/hermes"
AGENTICFORCEWEB_REPO="/opt/data/repos/agenticforceweb"
POSTLY_CONTENT_ROOT="/opt/data/social-content/brands/postly"
```

## Shared Secrets

Use the same shared secret on both Vercel and Hermes:

```env
HERMES_AGENT_SECRET="<same value as gateway webhook secret>"
HERMES_WEBHOOK_SECRET="<same value as gateway webhook secret>"
```

Vercel env should include:

```env
HERMES_BASE_URL="http://72.62.197.97:8644"
HERMES_WEBHOOK_URL="http://72.62.197.97:8644/webhooks/website-signup"
HERMES_WEBHOOK_SECRET="<shared secret>"
HERMES_AGENT_SECRET="<shared secret>"
```

Hermes env should include:

```env
AGENTICFORCE_BASE_URL="https://<vercel-domain>"
HERMES_AGENT_SECRET="<shared secret>"
MAKE_POSTLY_WEBHOOK_URL="<make.com webhook url>"
```

`MAKE_POSTLY_WEBHOOK_URL` is still missing and must be created in Make.com.

## Vercel Endpoints Hermes Uses

Hermes calls these Vercel endpoints with:

```txt
x-hermes-secret: <HERMES_AGENT_SECRET>
```

Flow:

```txt
GET  /api/hermes/postly/brands?q=Luna%20Brew
GET  /api/hermes/postly/planned
POST /api/hermes/postly/draft
POST /api/hermes/postly/approval-status
GET  /api/hermes/postly/approved
POST /api/hermes/postly/sent-to-make
POST /api/hermes/postly/logs
```

Vercel admin-only health check:

```txt
GET /api/postly/hermes-health
```

If Hermes cannot find Luna Brew in `/opt/data/social-content/brands/postly` or `brand-registry.json`, that is expected. Luna Brew was created in the Supabase-backed Postly database. Ask Hermes to fetch:

```bash
curl -H "x-hermes-secret: $HERMES_AGENT_SECRET" \
  "$AGENTICFORCE_BASE_URL/api/hermes/postly/brands?q=Luna%20Brew"
```

## Proposed Hermes Cron

Add a Hermes built-in cron that runs every 5 minutes:

```txt
*/5 * * * * postly-planner
```

Worker behavior:

```text
1. GET  <AGENTICFORCE_BASE_URL>/api/hermes/postly/planned
2. Generate title/headline/caption/imagePrompt/creativeDirection
3. Send Telegram approval buttons
4. POST <AGENTICFORCE_BASE_URL>/api/hermes/postly/draft
```

Telegram approval handler behavior:

```text
1. POST <AGENTICFORCE_BASE_URL>/api/hermes/postly/approval-status
2. If APPROVED:
   GET approved queue or use current item
   POST MAKE_POSTLY_WEBHOOK_URL
   POST <AGENTICFORCE_BASE_URL>/api/hermes/postly/sent-to-make
```

Make.com callback goes to Vercel:

```txt
POST <AGENTICFORCE_BASE_URL>/api/webhooks/make/postly
x-make-secret: <MAKE_WEBHOOK_SECRET>
x-idempotency-key: <stable make run id>
```

## Gateway Service Hardening

Current gateway is manually running:

```bash
runuser -u hermes -- env ... /opt/hermes/.venv/bin/hermes gateway run
```

Recommended production hardening:

```bash
sudo /opt/hermes/.venv/bin/hermes gateway install --system
sudo systemctl enable hermes-gateway
sudo systemctl restart hermes-gateway
sudo systemctl status hermes-gateway
```

If the built-in service name differs, inspect the install output and use that unit name.

## Remaining Blockers

1. Supabase database password is missing, so `prisma migrate deploy` cannot be run yet.
2. Make.com webhook URL is missing.
3. SSH access to the VPS is required before Codex can install the cron/service directly.
