import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const ODOO_URL = "http://72.62.197.97:8069";
const ODOO_DB = "odoo19_admin";
const ODOO_USERNAME = "admin";
const ODOO_PASSWORD = "admin";
const TAGS = ["aithon2026", "smart-city", "hackathon"];
const SMTP_FROM = process.env.AITHON_SMTP_FROM || "aimongoliatushig@gmail.com";
const SMTP_USER = process.env.AITHON_SMTP_USER || SMTP_FROM;
const SMTP_PASS = process.env.AITHON_SMTP_PASS || "";
const NOTIFY_EMAIL = process.env.AITHON_NOTIFY_EMAIL || SMTP_FROM;

type RegistrationData = z.infer<typeof schema>;

type XmlRpcValue =
  | string
  | number
  | boolean
  | null
  | XmlRpcValue[]
  | {
      [key: string]: XmlRpcValue;
    };

const schema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(6).max(40),
  schoolName: z.string().trim().min(2).max(180),
  participantTypes: z.array(z.string().trim().min(1).max(80)).min(1).max(2),
  teamSize: z.enum(["2 хүн", "3 хүн"]),
  challengeTrack: z.enum([
    "Smart Traffic",
    "Smart Environment",
    "Smart Education",
    "Smart Government",
    "Smart Health & Safety",
    "Open Innovation",
  ]),
  hasMentor: z.boolean(),
  mentorName: z.string().trim().max(160).optional().default(""),
  mentorPhone: z.string().trim().max(40).optional().default(""),
  mentorEmail: z.string().trim().max(180).optional().default(""),
  mentorOrganization: z.string().trim().max(180).optional().default(""),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Бүртгэлийн мэдээлэл дутуу эсвэл буруу байна." }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const uid = await authenticate();

    if (!uid) {
      return NextResponse.json({ error: "CRM нэвтрэлт амжилтгүй боллоо." }, { status: 502 });
    }

    const tagIds = await ensureTags(uid);
    const leadId = await createLead(uid, data, tagIds);
    const emailSent = await sendRegistrationEmails(data, Number(leadId)).catch((error) => {
      console.error("AITHON2026 registration email failed", error);
      return false;
    });

    return NextResponse.json({ ok: true, leadId, emailSent });
  } catch (error) {
    console.error("AITHON2026 Odoo registration failed", error);
    return NextResponse.json({ error: "Бүртгэл CRM-д хадгалахад алдаа гарлаа." }, { status: 502 });
  }
}

async function authenticate(): Promise<number> {
  const response = await xmlRpcCall(`${ODOO_URL}/xmlrpc/2/common`, "authenticate", [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_PASSWORD,
    {},
  ]);

  return typeof response === "number" ? response : 0;
}

async function ensureTags(uid: number): Promise<number[]> {
  const tagIds: number[] = [];

  for (const tag of TAGS) {
    const found = await executeKw(uid, "crm.tag", "search", [[["name", "=", tag]]], { limit: 1 });

    if (Array.isArray(found) && typeof found[0] === "number") {
      tagIds.push(found[0]);
      continue;
    }

    const created = await executeKw(uid, "crm.tag", "create", [{ name: tag }]);

    if (typeof created === "number") {
      tagIds.push(created);
    }
  }

  return tagIds;
}

async function createLead(uid: number, data: RegistrationData, tagIds: number[]) {
  const description = [
    "Smart City AI Hackathon 2026 registration",
    "",
    `Овог нэр: ${data.fullName}`,
    `Имэйл: ${data.email}`,
    `Утас: ${data.phone}`,
    `Сургуулийн нэр: ${data.schoolName}`,
    `Оролцогчийн төрөл: ${data.participantTypes.join(", ")}`,
    `Team size: ${data.teamSize}`,
    `Challenge Track: ${data.challengeTrack}`,
    `Mentor байгаа: ${data.hasMentor ? "Тийм" : "Үгүй"}`,
    data.hasMentor ? `Mentor нэр: ${data.mentorName || "-"}` : "",
    data.hasMentor ? `Mentor утас: ${data.mentorPhone || "-"}` : "",
    data.hasMentor ? `Mentor имэйл: ${data.mentorEmail || "-"}` : "",
    data.hasMentor ? `Mentor ажил / organization: ${data.mentorOrganization || "-"}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return executeKw(uid, "crm.lead", "create", [
    {
      name: `[AITHON2026] ${data.fullName} - ${data.schoolName}`,
      contact_name: data.fullName,
      email_from: data.email.toLowerCase(),
      phone: data.phone,
      description,
      type: "lead",
      tag_ids: [[6, 0, tagIds]],
    },
  ]);
}

async function sendRegistrationEmails(data: RegistrationData, leadId: number) {
  if (!SMTP_PASS) {
    console.warn("AITHON2026 mailer skipped: AITHON_SMTP_PASS is not configured.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS.replace(/\s+/g, ""),
    },
  });
  const subject = "Smart City AI Hackathon 2026 registration receipt";
  const details = formatRegistrationDetails(data, leadId);

  await Promise.all([
    transporter.sendMail({
      from: `"Smart City AI Hackathon 2026" <${SMTP_FROM}>`,
      to: data.email,
      replyTo: SMTP_FROM,
      subject,
      text: [
        `Hi ${data.fullName},`,
        "",
        "Your Smart City AI Hackathon 2026 registration has been received.",
        "Our team will contact you soon.",
        "",
        details,
      ].join("\n"),
      html: renderEmailHtml({
        title: "Registration received",
        intro: `Hi ${escapeHtml(data.fullName)}, your Smart City AI Hackathon 2026 registration has been received. Our team will contact you soon.`,
        details,
      }),
    }),
    transporter.sendMail({
      from: `"AITHON2026 Website" <${SMTP_FROM}>`,
      to: NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `New signup for AITHON2026: ${data.fullName}`,
      text: [`New signup for AITHON2026`, "", details].join("\n"),
      html: renderEmailHtml({
        title: "New signup for AITHON2026",
        intro: `${escapeHtml(data.fullName)} submitted a new registration.`,
        details,
      }),
    }),
  ]);

  return true;
}

function formatRegistrationDetails(data: RegistrationData, leadId: number) {
  return [
    `CRM Lead ID: ${leadId}`,
    `Full name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `School: ${data.schoolName}`,
    `Participant type: ${data.participantTypes.join(", ")}`,
    `Team size: ${data.teamSize}`,
    `Challenge track: ${data.challengeTrack}`,
    `Has mentor: ${data.hasMentor ? "Yes" : "No"}`,
    data.hasMentor ? `Mentor name: ${data.mentorName || "-"}` : "",
    data.hasMentor ? `Mentor phone: ${data.mentorPhone || "-"}` : "",
    data.hasMentor ? `Mentor email: ${data.mentorEmail || "-"}` : "",
    data.hasMentor ? `Mentor organization: ${data.mentorOrganization || "-"}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function renderEmailHtml(input: { title: string; intro: string; details: string }) {
  return `
    <div style="margin:0;background:#050505;padding:28px;font-family:Inter,Arial,sans-serif;color:#ffffff;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,170,0,0.22);border-radius:20px;background:rgba(255,255,255,0.04);overflow:hidden;">
        <div style="padding:28px;border-bottom:1px solid rgba(255,170,0,0.16);background:linear-gradient(135deg,rgba(255,152,0,0.18),rgba(255,255,255,0.02));">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#ffb300;font-weight:800;">Smart City AI Hackathon 2026</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">${escapeHtml(input.title)}</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 20px;color:#e4e4e7;line-height:1.7;">${input.intro}</p>
          <pre style="white-space:pre-wrap;margin:0;padding:18px;border-radius:14px;border:1px solid rgba(255,170,0,0.16);background:#0b0b0b;color:#f4f4f5;font-family:Arial,sans-serif;line-height:1.65;">${escapeHtml(input.details)}</pre>
        </div>
      </div>
    </div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function executeKw(
  uid: number,
  model: string,
  method: string,
  args: XmlRpcValue[],
  kwargs?: Record<string, XmlRpcValue>
) {
  const params: XmlRpcValue[] = [ODOO_DB, uid, ODOO_PASSWORD, model, method, args];

  if (kwargs) {
    params.push(kwargs);
  }

  return xmlRpcCall(`${ODOO_URL}/xmlrpc/2/object`, "execute_kw", params);
}

async function xmlRpcCall(endpoint: string, methodName: string, params: XmlRpcValue[]) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: buildXmlRpcRequest(methodName, params),
    signal: AbortSignal.timeout(9000),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`XML-RPC HTTP ${response.status}: ${text.slice(0, 240)}`);
  }

  if (text.includes("<fault>")) {
    throw new Error(`XML-RPC fault: ${stripTags(text).slice(0, 500)}`);
  }

  return parseXmlRpcResponse(text);
}

function buildXmlRpcRequest(methodName: string, params: XmlRpcValue[]) {
  return `<?xml version="1.0"?>
<methodCall>
  <methodName>${escapeXml(methodName)}</methodName>
  <params>
    ${params.map((param) => `<param>${encodeValue(param)}</param>`).join("")}
  </params>
</methodCall>`;
}

function encodeValue(value: XmlRpcValue): string {
  if (value === null) {
    return "<value><nil/></value>";
  }

  if (Array.isArray(value)) {
    return `<value><array><data>${value.map(encodeValue).join("")}</data></array></value>`;
  }

  if (typeof value === "object") {
    return `<value><struct>${Object.entries(value)
      .map(([key, item]) => `<member><name>${escapeXml(key)}</name>${encodeValue(item)}</member>`)
      .join("")}</struct></value>`;
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? `<value><int>${value}</int></value>` : `<value><double>${value}</double></value>`;
  }

  if (typeof value === "boolean") {
    return `<value><boolean>${value ? "1" : "0"}</boolean></value>`;
  }

  return `<value><string>${escapeXml(value)}</string></value>`;
}

function parseXmlRpcResponse(xml: string): XmlRpcValue {
  const valueMatch = xml.match(/<param>\s*<value>([\s\S]*?)<\/value>\s*<\/param>/);

  if (!valueMatch) {
    return null;
  }

  return parseValue(valueMatch[1]);
}

function parseValue(fragment: string): XmlRpcValue {
  const trimmed = fragment.trim();
  const intMatch = trimmed.match(/^<(?:int|i4)>(-?\d+)<\/(?:int|i4)>$/);

  if (intMatch) {
    return Number(intMatch[1]);
  }

  const booleanMatch = trimmed.match(/^<boolean>([01])<\/boolean>$/);

  if (booleanMatch) {
    return booleanMatch[1] === "1";
  }

  const stringMatch = trimmed.match(/^<string>([\s\S]*)<\/string>$/);

  if (stringMatch) {
    return unescapeXml(stringMatch[1]);
  }

  const arrayMatch = trimmed.match(/^<array>\s*<data>([\s\S]*)<\/data>\s*<\/array>$/);

  if (arrayMatch) {
    return extractValueFragments(arrayMatch[1]).map(parseValue);
  }

  const structMatch = trimmed.match(/^<struct>([\s\S]*)<\/struct>$/);

  if (structMatch) {
    const output: Record<string, XmlRpcValue> = {};
    const memberRegex = /<member>\s*<name>([\s\S]*?)<\/name>\s*<value>([\s\S]*?)<\/value>\s*<\/member>/g;
    let match: RegExpExecArray | null;

    while ((match = memberRegex.exec(structMatch[1]))) {
      output[unescapeXml(match[1])] = parseValue(match[2]);
    }

    return output;
  }

  if (trimmed === "<nil/>") {
    return null;
  }

  return unescapeXml(stripTags(trimmed));
}

function extractValueFragments(xml: string) {
  const values: string[] = [];
  let index = 0;

  while (index < xml.length) {
    const start = xml.indexOf("<value>", index);

    if (start === -1) {
      break;
    }

    let depth = 1;
    let cursor = start + "<value>".length;

    while (depth > 0 && cursor < xml.length) {
      const nextOpen = xml.indexOf("<value>", cursor);
      const nextClose = xml.indexOf("</value>", cursor);

      if (nextClose === -1) {
        break;
      }

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        cursor = nextOpen + "<value>".length;
      } else {
        depth -= 1;
        if (depth === 0) {
          values.push(xml.slice(start + "<value>".length, nextClose));
          cursor = nextClose + "</value>".length;
          break;
        }
        cursor = nextClose + "</value>".length;
      }
    }

    index = cursor;
  }

  return values;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function unescapeXml(value: string) {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
