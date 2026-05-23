# Hermes Signup Webhooks

AgenticForce sends normalized signup leads to Hermes for both Clerk signups and academy enrollments.

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

Hermes signup lead delivery sends a POST request to `HERMES_WEBHOOK_URL`.

Required headers:

```text
Content-Type: application/json
X-Hermes-Event: website.signup
X-Idempotency-Key: clerk_user_created:<clerkUserId> or academy_enrollment:<enrollmentId>
X-Hub-Signature-256: sha256=<hmac_sha256_hex>
```

The request body is signed as raw JSON using HMAC-SHA256 and `HERMES_WEBHOOK_SECRET`.

Hermes delivery is non-blocking for user flows. If Hermes is down, the server logs the failure and the signup or enrollment flow continues.

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
