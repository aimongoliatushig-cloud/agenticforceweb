import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { UserRole } from "@prisma/client";
import { isAdminEmail } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/db";
import {
  getPrimaryEmail,
  getRequestMetadata,
  normalizeClerkUserCreatedToHermes,
  sendSignupToHermes,
  type ClerkUserCreatedData,
} from "@/lib/hermes-signup";

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserCreatedData;
};

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  let event: ClerkWebhookEvent;

  try {
    event = new Webhook(webhookSecret).verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("Invalid Clerk webhook signature", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!["user.created", "user.updated"].includes(event.type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email = getPrimaryEmail(event.data);

  if (hasDatabaseUrl() && email) {
    try {
      await prisma.user.upsert({
        where: { clerkUserId: event.data.id },
        update: {
          email: email.toLowerCase(),
          name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || null,
          avatarUrl: event.data.image_url ?? null,
          phone: event.data.phone_numbers?.[0]?.phone_number ?? null,
          role: isAdminEmail(email) ? UserRole.admin : undefined,
          lastSeenAt: new Date(),
        },
        create: {
          clerkUserId: event.data.id,
          email: email.toLowerCase(),
          name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || null,
          avatarUrl: event.data.image_url ?? null,
          phone: event.data.phone_numbers?.[0]?.phone_number ?? null,
          role: isAdminEmail(email) ? UserRole.admin : UserRole.user,
          lastSeenAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to sync Clerk user before Hermes delivery", error);
    }
  }

  const metadata = await getRequestMetadata();
  const payload = normalizeClerkUserCreatedToHermes({
    user: event.data,
    ipHash: metadata.ipHash,
    userAgent: metadata.userAgent,
  });

  await sendSignupToHermes(payload);

  return NextResponse.json({ ok: true });
}
