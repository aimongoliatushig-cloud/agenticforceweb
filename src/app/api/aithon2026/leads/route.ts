import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ODOO_URL = "http://72.62.197.97:8069";
const ODOO_DB = "odoo19_admin";
const ODOO_USERNAME = "admin";
const ODOO_PASSWORD = "admin";
const AITHON_TAGS = ["aithon2026", "smart-city", "hackathon"];

type XmlRpcValue =
  | string
  | number
  | boolean
  | null
  | XmlRpcValue[]
  | { [key: string]: XmlRpcValue };

export async function GET() {
  try {
    const uid = await authenticate();
    if (!uid) {
      return NextResponse.json({ error: "CRM нэвтрэлт амжилтгүй" }, { status: 502 });
    }

    // Find AITHON tag IDs
    const tagIds: number[] = [];
    for (const tagName of AITHON_TAGS) {
      const found = await executeKw(uid, "crm.tag", "search", [[["name", "=", tagName]]], { limit: 1 });
      if (Array.isArray(found) && typeof found[0] === "number") {
        tagIds.push(found[0]);
      }
    }

    // Search leads: either by AITHON tag OR by name prefix [AITHON2026]
    let leads: any[] = [];
    if (tagIds.length > 0) {
      leads = await executeKw(uid, "crm.lead", "search_read", [
        ["|", ["tag_ids", "in", tagIds], ["name", "=ilike", "[AITHON2026]%"]],
      ], {
        fields: [
          "id", "name", "contact_name", "email_from", "phone",
          "stage_id", "user_id", "create_date", "expected_revenue",
          "tag_ids", "description",
        ],
        order: "create_date desc",
        limit: 500,
      });
    } else {
      leads = await executeKw(uid, "crm.lead", "search_read", [
        [["name", "=ilike", "[AITHON2026]%"]],
      ], {
        fields: [
          "id", "name", "contact_name", "email_from", "phone",
          "stage_id", "user_id", "create_date", "expected_revenue",
          "tag_ids", "description",
        ],
        order: "create_date desc",
        limit: 500,
      });
    }

    // Also get tag names for display
    const allTagIds = [...new Set(leads.flatMap((l: any) => {
      const ids = l.tag_ids || [];
      return Array.isArray(ids) ? ids.map((t: any) => (Array.isArray(t) ? t[0] : t)) : [];
    }))];

    let tagMap: Record<number, string> = {};
    if (allTagIds.length > 0) {
      const tags = await executeKw(uid, "crm.tag", "search_read", [[["id", "in", allTagIds]]], {
        fields: ["id", "name"],
      });
      if (Array.isArray(tags)) {
        for (const t of tags) {
          tagMap[(t as any).id] = (t as any).name;
        }
      }
    }

    // Get stage names
    const allStageIds = [...new Set(leads.map((l: any) => {
      const s = l.stage_id;
      return Array.isArray(s) ? s[0] : (typeof s === "number" ? s : null);
    }).filter(Boolean))] as number[];

    let stageMap: Record<number, string> = {};
    if (allStageIds.length > 0) {
      const stages = await executeKw(uid, "crm.stage", "search_read", [[["id", "in", allStageIds]]], {
        fields: ["id", "name"],
      });
      if (Array.isArray(stages)) {
        for (const s of stages) {
          stageMap[(s as any).id] = (s as any).name;
        }
      }
    }

    // Normalize leads for the frontend
    const normalized = (Array.isArray(leads) ? leads : []).map((l: any) => {
      const stageId = Array.isArray(l.stage_id) ? l.stage_id[0] : (typeof l.stage_id === "number" ? l.stage_id : null);
      const userId = Array.isArray(l.user_id) ? l.user_id[0] : (typeof l.user_id === "number" ? l.user_id : null);
      const tagIdList = Array.isArray(l.tag_ids) ? l.tag_ids.map((t: any) => Array.isArray(t) ? t[0] : t) : [];

      return {
        id: l.id,
        name: l.name || "",
        contactName: l.contact_name || "",
        email: l.email_from || "",
        phone: l.phone || "",
        stage: stageMap[stageId] || "",
        stageId,
        user: Array.isArray(l.user_id) ? l.user_id[1] || "" : "",
        userId,
        createdDate: l.create_date || "",
        revenue: l.expected_revenue || 0,
        tags: tagIdList.map((tid: number) => tagMap[tid] || "").filter(Boolean),
        description: l.description || "",
      };
    });

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      leads: normalized,
    });
  } catch (error) {
    console.error("AITHON2026 leads fetch error:", error);
    return NextResponse.json({
      ok: false,
      error: "Lead-үүдийг татахад алдаа гарлаа.",
    }, { status: 500 });
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

async function executeKw(
  uid: number,
  model: string,
  method: string,
  args: XmlRpcValue[],
  kwargs?: Record<string, XmlRpcValue>
) {
  const params: XmlRpcValue[] = [ODOO_DB, uid, ODOO_PASSWORD, model, method, args];
  if (kwargs) params.push(kwargs);
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
  if (value === null) return "<value><nil/></value>";
  if (Array.isArray(value)) {
    return `<value><array><data>${value.map(encodeValue).join("")}</data></array></value>`;
  }
  if (typeof value === "object") {
    return `<value><struct>${Object.entries(value)
      .map(([key, item]) => `<member><name>${escapeXml(key)}</name>${encodeValue(item)}</member>`)
      .join("")}</struct></value>`;
  }
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? `<value><int>${value}</int></value>`
      : `<value><double>${value}</double></value>`;
  }
  if (typeof value === "boolean") {
    return `<value><boolean>${value ? "1" : "0"}</boolean></value>`;
  }
  return `<value><string>${escapeXml(value)}</string></value>`;
}

function parseXmlRpcResponse(xml: string): XmlRpcValue {
  const valueMatch = xml.match(/<param>\s*<value>([\s\S]*?)<\/value>\s*<\/param>/);
  if (!valueMatch) return null;
  return parseValue(valueMatch[1]);
}

function parseValue(fragment: string): XmlRpcValue {
  const trimmed = fragment.trim();
  const intMatch = trimmed.match(/^<(?:int|i4)>(-?\d+)<\/(?:int|i4)>$/);
  if (intMatch) return Number(intMatch[1]);
  const booleanMatch = trimmed.match(/^<boolean>([01])<\/boolean>$/);
  if (booleanMatch) return booleanMatch[1] === "1";
  const stringMatch = trimmed.match(/^<string>([\s\S]*)<\/string>$/);
  if (stringMatch) return unescapeXml(stringMatch[1]);
  const arrayMatch = trimmed.match(/^<array>\s*<data>([\s\S]*)<\/data>\s*<\/array>$/);
  if (arrayMatch) return extractValueFragments(arrayMatch[1]).map(parseValue);
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
  if (trimmed === "<nil/>") return null;
  return unescapeXml(stripTags(trimmed));
}

function extractValueFragments(xml: string) {
  const values: string[] = [];
  let index = 0;
  while (index < xml.length) {
    const start = xml.indexOf("<value>", index);
    if (start === -1) break;
    let depth = 1;
    let cursor = start + "<value>".length;
    while (depth > 0 && cursor < xml.length) {
      const nextOpen = xml.indexOf("<value>", cursor);
      const nextClose = xml.indexOf("</value>", cursor);
      if (nextClose === -1) break;
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
