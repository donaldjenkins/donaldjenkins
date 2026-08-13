// donaldjenkins-contactform — Cloudflare Worker
// Privacy-first contact-form handler. No third-party services, no client-side JS:
//   - Honeypot field ("url") blocks naive bots.
//   - Server-side email validation gates whether a submission is forwarded to the owner:
//     syntax → disposable-domain blocklist → DNS check (MX/A via Cloudflare 1.1.1.1 DoH).
//     Conservative / fail-open: only clear fakes are rejected; any DNS ambiguity is forwarded
//     so a genuine enquiry is never silently dropped.
//   - NO acknowledgement email is sent to the visitor (the on-page #thanks modal confirms
//     receipt). The ONLY SES send is the notification to contact@ — which can't bounce — so
//     the SES bounce source is removed permanently.
//   - AWS credentials come from encrypted env vars; SES v2 SendEmail is signed with Web
//     Crypto (SigV4), no AWS SDK.

// ---------------------------------------------------------------------------
// SigV4 signing (Web Crypto) + SES v2 SendEmail
// ---------------------------------------------------------------------------
const enc = new TextEncoder();

async function sha256Hex(input) {
  const data = typeof input === "string" ? enc.encode(input) : input;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(key, message) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message)));
}

async function deriveSigningKey(secretKey, dateStamp, region, service) {
  const kDate = await hmac(enc.encode("AWS4" + secretKey), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

async function sendSesEmail(env, { to, from, replyTo, subject, html, text }) {
  const region = env.AWS_REGION || "us-east-1";
  const service = "ses";
  const host = `email.${region}.amazonaws.com`;
  const path = "/v2/email/outbound-emails";
  const endpoint = `https://${host}${path}`;

  const body = JSON.stringify({
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    ReplyToAddresses: [replyTo],
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: { Html: { Data: html, Charset: "UTF-8" }, Text: { Data: text, Charset: "UTF-8" } },
      },
    },
  });

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = await sha256Hex(body);

  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["POST", path, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, await sha256Hex(canonicalRequest)].join("\n");

  const signingKey = await deriveSigningKey(env.AWS_SECRET_ACCESS_KEY, dateStamp, region, service);
  const signature = [...(await hmac(signingKey, stringToSign))].map((b) => b.toString(16).padStart(2, "0")).join("");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${env.AWS_ACCESS_KEY_ID}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Amz-Date": amzDate,
      "X-Amz-Content-Sha256": payloadHash,
      Authorization: authorization,
    },
    body,
  });
  if (!resp.ok) throw new Error(`SES ${resp.status}: ${await resp.text()}`);
  return resp;
}

// ---------------------------------------------------------------------------
// Email validation — first-party only (no third-party services)
// ---------------------------------------------------------------------------
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "sharklasers.com",
  "10minutemail.com", "yopmail.com", "tempmail.com", "temp-mail.org", "trashmail.com",
  "getnada.com", "dispostable.com", "maildrop.cc", "mailnesia.com", "throwawaymail.com",
  "fakeinbox.com", "tempinbox.com", "mohmal.com", "mintemail.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// True if the domain plausibly accepts mail (has MX, or an A/AAAA record for implicit MX).
// Fail-open: returns false only when DNS definitively shows no mail records; any lookup
// error or ambiguity returns true, so a genuine message is never silently dropped.
async function domainAcceptsMail(domain) {
  const query = async (type) => {
    try {
      const r = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        { headers: { accept: "application/dns-json" } }
      );
      if (!r.ok) return null;
      const j = await r.json();
      const wanted = type === "MX" ? 15 : type === "A" ? 1 : 28;
      return { hits: (j.Answer || []).filter((a) => a.type === wanted).length };
    } catch {
      return null;
    }
  };
  const mx = await query("MX");
  if (mx && mx.hits > 0) return true;
  const a = await query("A");
  if (a && a.hits > 0) return true;
  if (mx && a) return false; // both lookups succeeded, neither found records → not deliverable
  return true; // inconclusive → forward
}

async function emailLooksReal(email) {
  const addr = String(email).trim().toLowerCase();
  if (!EMAIL_RE.test(addr)) return false;
  const domain = addr.split("@")[1];
  if (!domain || DISPOSABLE_DOMAINS.has(domain)) return false;
  return domainAcceptsMail(domain);
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------
export default {
  async fetch(request, env, ctx) {
    const SUPPORT_EMAIL = "contact@donaldjenkins.com";
    const FROM = "contact@donaldjenkins.com";

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: { ...corsHeaders, "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "" },
      });
    }
    if (request.method !== "POST") {
      return new Response(null, { status: 405, statusText: "Method Not Allowed" });
    }

    const formData = await request.formData();
    const firstName = formData.get("First name");
    const lastName = formData.get("Last name");
    const email = formData.get("Email");
    const message = formData.get("Message");
    const redirectUrl = formData.get("Redirect URL");
    const failedRedirectUrl = formData.get("Failed redirect URL");
    const consentCheck = formData.get("Consent");
    const honeypot = formData.get("url"); // hidden field; only bots fill it

    const fail = () => {
      const headers = new Headers();
      headers.set("Location", failedRedirectUrl || "https://www.donaldjenkins.com/contact/#error");
      return new Response("Verification failed", { status: 302, headers });
    };

    // 1. Honeypot — a filled hidden field means a bot.
    if (honeypot) return fail();

    // 2. Required fields.
    if (!firstName || !lastName || !email || !message || !redirectUrl || !consentCheck) {
      return new Response("Required field is empty", { status: 400, statusText: "Bad Request" });
    }

    // 3. Email must look real (syntax + not disposable + domain accepts mail).
    if (!(await emailLooksReal(email))) return fail();

    // 4. Passed — forward the notification to the owner only. No visitor acknowledgement is
    //    sent, so SES only ever emails contact@ (which cannot bounce).
    const emailStr = String(email).trim();
    const ownerHtml = `<h3>Message from ${firstName} ${lastName}</h3><p>Email: ${emailStr}</p><p>${message}</p>`;
    const ownerText = `Message from ${firstName} ${lastName}\n${emailStr}\n\n${message}`;
    const ownerSubject = `Message from ${firstName} ${lastName}`;

    try {
      await sendSesEmail(env, {
        to: SUPPORT_EMAIL,
        from: FROM,
        replyTo: emailStr,
        subject: ownerSubject,
        html: ownerHtml,
        text: ownerText,
      });
    } catch (error) {
      console.error(error);
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Location", redirectUrl);
    return new Response(JSON.stringify({ success: true }), { headers, status: 302 });
  },
};
