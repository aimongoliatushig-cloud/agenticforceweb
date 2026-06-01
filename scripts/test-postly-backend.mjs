const baseUrl = process.env.POSTLY_TEST_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const hermesSecret = process.env.HERMES_AGENT_SECRET;
const makeSecret = process.env.MAKE_WEBHOOK_SECRET;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { response, body };
}

async function expectUnauthorized(path, headerName) {
  const { response } = await request(path, { headers: { [headerName]: "wrong-secret" } });
  if (response.status !== 401) {
    throw new Error(`${path} should reject an invalid ${headerName}; got ${response.status}`);
  }
}

async function main() {
  console.log(`Testing Postly backend at ${baseUrl}`);

  await expectUnauthorized("/api/hermes/postly/planned", "x-hermes-secret");
  await expectUnauthorized("/api/hermes/postly/approved", "x-hermes-secret");

  const makeUnauthorized = await request("/api/webhooks/make/postly", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-make-secret": "wrong-secret",
    },
    body: JSON.stringify({ content_item_id: "test" }),
  });
  if (makeUnauthorized.response.status !== 401) {
    throw new Error(`/api/webhooks/make/postly should reject an invalid x-make-secret; got ${makeUnauthorized.response.status}`);
  }

  if (hermesSecret) {
    const planned = await request("/api/hermes/postly/planned", {
      headers: { "x-hermes-secret": hermesSecret },
    });
    console.log(`Hermes planned endpoint: ${planned.response.status}`);
  } else {
    console.log("Skipped authorized Hermes check: HERMES_AGENT_SECRET is not set.");
  }

  if (makeSecret) {
    const makeMissingItem = await request("/api/webhooks/make/postly", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-make-secret": makeSecret,
        "x-idempotency-key": `postly-smoke-${Date.now()}`,
      },
      body: JSON.stringify({}),
    });
    console.log(`Make webhook authorized shape check: ${makeMissingItem.response.status}`);
  } else {
    console.log("Skipped authorized Make check: MAKE_WEBHOOK_SECRET is not set.");
  }

  console.log("Postly backend smoke checks completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
