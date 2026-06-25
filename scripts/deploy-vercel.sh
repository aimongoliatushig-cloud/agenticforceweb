#!/usr/bin/env bash
# AgenticForce Vercel Deploy Script
# Requirements: Vercel token + Supabase + Clerk credentials
set -euo pipefail

echo "🚀 AgenticForce Vercel Deploy"
echo "================================"

# Check for Vercel token
VERCEL_TOKEN="${VERCEL_TOKEN:-${1:-}}"
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ Need Vercel token. Set VERCEL_TOKEN env var or pass as argument."
  echo "   Get one at: https://vercel.com/account/tokens"
  exit 1
fi

# Check env vars
missing=()
[ -z "${SUPABASE_DATABASE_URL:-}" ] && missing+=("SUPABASE_DATABASE_URL")
[ -z "${NEXT_PUBLIC_SUPABASE_URL:-}" ] && missing+=("NEXT_PUBLIC_SUPABASE_URL")
[ -z "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" ] && missing+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
[ -z "${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}" ] && missing+=("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
[ -z "${CLERK_SECRET_KEY:-}" ] && missing+=("CLERK_SECRET_KEY")

if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ Missing required env vars:"
  for v in "${missing[@]}"; do echo "   - $v"; done
  exit 1
fi

DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔨 Building..."
npm run build

echo "🌐 Deploying to Vercel..."
npx vercel pull --yes --token="$VERCEL_TOKEN" \
  --environment=production 2>/dev/null || true

npx vercel deploy \
  --prod \
  --token="$VERCEL_TOKEN" \
  --build-env SUPABASE_DATABASE_URL="$SUPABASE_DATABASE_URL" \
  --build-env DATABASE_URL="$DATABASE_URL" \
  --build-env NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-env NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
  --build-env CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
  --build-env CLERK_WEBHOOK_SECRET="${CLERK_WEBHOOK_SECRET:-}" \
  --build-env HERMES_AGENT_SECRET="${HERMES_AGENT_SECRET:-}" \
  --build-env HERMES_BASE_URL="${HERMES_BASE_URL:-http://72.62.197.97:8644}" \
  --build-env HERMES_WEBHOOK_URL="${HERMES_WEBHOOK_URL:-http://72.62.197.97:8644/webhooks/website-signup}" \
  --build-env HERMES_WEBHOOK_SECRET="${HERMES_WEBHOOK_SECRET:-}" \
  --build-env HERMES_NEWS_WEBHOOK_SECRET="${HERMES_NEWS_WEBHOOK_SECRET:-}" \
  --build-env HERMES_NEWS_ALLOWED_SOURCE="${HERMES_NEWS_ALLOWED_SOURCE:-hermes-daily-industry-news}" \
  --build-env HERMES_NEWS_DEFAULT_STATUS="${HERMES_NEWS_DEFAULT_STATUS:-published}" \
  --build-env NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://agenticforce.com}" \
  --build-env ADMIN_EMAILS="${ADMIN_EMAILS:-admin@agenticforce.com}" \
  --build-env NEXT_PUBLIC_WORKSHOP_DATE="${NEXT_PUBLIC_WORKSHOP_DATE:-2026-07-19}" \
  --build-env DATABASE_URL_UNCHANGED="$DATABASE_URL"

echo "✅ Deploy complete!"
echo "   Site: https://agenticforce.com"
echo "   Dashboard: https://agenticforce.com/admin"
