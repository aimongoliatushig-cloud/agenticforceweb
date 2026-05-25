# Hermes Signup Webhook Sender

AgenticForce sends normalized signup leads to Hermes for both Clerk signups and academy enrollments.

Important boundary: this Vercel website does **not** implement the Hermes receiver endpoint. Hermes Agent owns the receiver:

```text
POST <HERMES_PUBLIC_URL>/webhooks/website-signup
```

The website only sends outbound events to that public Hermes URL through `HERMES_WEBHOOK_URL`.

## Required Environment Variables

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
HERMES_WEBHOOK_URL=
HERMES_WEBHOOK_SECRET=
HERMES_AGENT_SECRET=
ADMIN_EMAILS=
NEXT_PUBLIC_APP_URL=
```

## Clerk Inbound Webhook

Configure Clerk to send `user.created` events to:

```text
/api/webhooks/clerk
```

The route verifies Clerk/Svix headers before trusting the payload:

```text
svix-id
svix-timestamp
svix-signature
```

## Hermes Outbound Webhook

Hermes signup lead delivery sends a POST request from the website to `HERMES_WEBHOOK_URL`, which must point at the Hermes Agent backend receiver.

Required headers:

```text
Content-Type: application/json
X-Hermes-Event: website.signup
X-Idempotency-Key: clerk_user_created:<clerkUserId> or academy_enrollment:<enrollmentId>
X-Hub-Signature-256: sha256=<hmac_sha256_hex>
```

The request body is signed as raw JSON using HMAC-SHA256 and `HERMES_WEBHOOK_SECRET`.

Hermes delivery is non-blocking for user flows. If Hermes is down, the server logs the failure and the signup or enrollment flow continues.

The Vercel website should not expose or implement `/webhooks/website-signup` for Hermes. It should only configure:

```env
HERMES_WEBHOOK_URL=https://hermes.example.com/webhooks/website-signup
HERMES_WEBHOOK_SECRET=<shared Hermes subscription secret>
```

## Hermes Inbound AI News

Hermes can send simple AI news imports into the website with:

```text
POST /api/hermes/import-news
```

Required header:

```text
x-hermes-secret: <HERMES_AGENT_SECRET>
```

Each imported article can include `industrySlug` so it appears in the correct Articles submenu/category page:

```json
{
  "articles": [
    {
      "slug": "healthcare-ai-agents-change-care-ops",
      "industrySlug": "healthcare",
      "status": "published",
      "canonicalSourceUrl": "https://provider.example/story",
      "sourceName": "Top News Provider",
      "category": "Healthcare",
      "readTime": 5,
      "titleEn": "How AI agents are changing healthcare operations",
      "titleMn": "AI агентууд эрүүл мэндийн үйл ажиллагааг хэрхэн өөрчилж байна",
      "excerptEn": "Short bilingual summary...",
      "excerptMn": "Товч тайлбар...",
      "bodyEn": "Reviewed article body...",
      "bodyMn": "Хянагдсан нийтлэлийн үндсэн агуулга..."
    }
  ]
}
```

Supported `industrySlug` values:

- `healthcare`
- `finance-banking`
- `retail-ecommerce`
- `education`
- `real-estate`
- `manufacturing`
- `logistics-transportation`
- `hospitality-tourism`
- `legal-professional-services`
- `government-public-sector`

## Hermes Daily Industry News

The scheduled Hermes cron agent should use this production ingest route:

```text
POST /api/hermes/daily-industry-news
```

Required environment variables:

```env
HERMES_NEWS_WEBHOOK_SECRET=<shared HMAC secret>
HERMES_NEWS_ALLOWED_SOURCE=hermes-daily-industry-news
HERMES_NEWS_DEFAULT_STATUS=published
```

Required headers:

```text
Content-Type: application/json
x-hermes-source: hermes-daily-industry-news
x-hermes-timestamp: <unix timestamp seconds>
x-hermes-signature: sha256=<hmac_sha256_hex>
```

Signature payload:

```text
timestamp + "." + rawJsonBody
```

The route rejects requests older than 5 minutes and verifies the signature with `HERMES_NEWS_WEBHOOK_SECRET`.

Payload shape:

```json
{
  "source": "hermes-daily-industry-news",
  "date": "2026-05-25",
  "timezone": "Asia/Ulaanbaatar",
  "industries": [
    {
      "name": "Healthcare",
      "slug": "healthcare",
      "articles": [
        {
          "id": "2026-05-25-healthcare-01",
          "rank": 1,
          "title": {
            "en": "Example English title",
            "mn": "Монгол гарчиг"
          },
          "summary": {
            "en": "Short English summary.",
            "mn": "Богино монгол хураангуй."
          },
          "body": {
            "en": "Longer English article body.",
            "mn": "Дэлгэрэнгүй монгол нийтлэл."
          },
          "imageUrl": "https://example.com/image.jpg",
          "imageAlt": {
            "en": "Healthcare AI news image",
            "mn": "Эрүүл мэндийн AI мэдээний зураг"
          },
          "sourceName": "Reuters",
          "sourceUrl": "https://example.com/original-news",
          "publishedAt": "2026-05-25T01:30:00Z",
          "tags": ["AI", "Healthcare"],
          "importanceScore": 92
        }
      ]
    }
  ]
}
```

The website maps Hermes fields into the existing `Article` model:

- `summary.en/mn` -> `excerptEn/excerptMn`
- `body.en/mn` -> `bodyEn/bodyMn`
- `imageUrl` -> `coverImage`
- `imageAlt.en/mn` -> `imageAltEn/imageAltMn`
- `sourceUrl` -> `canonicalSourceUrl`
- `rank` -> `dailyRank`
- `slug` -> `industrySlug`

Hermes can discover the current website industries from:

```text
GET /api/industries
```

## Academy Enrollment

Academy enrollment requires a signed-in Clerk user, then collects:

- phone
- country
- city
- current work / role
- selected academy track
- UTM/referrer/landing page metadata when available

After enrollment is saved in Postgres, the same normalized `website.signup` payload is sent to Hermes.

## Local Checks

```bash
npm run db:generate
npm run test:hermes
npm run build
```
