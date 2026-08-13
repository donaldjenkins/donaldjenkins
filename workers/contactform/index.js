// donaldjenkins-contactform — Cloudflare Worker
// Behaviour identical to the previous version EXCEPT:
//   - AWS credentials now come from encrypted env vars (AWS_ACCESS_KEY_ID,
//     AWS_SECRET_ACCESS_KEY, optional AWS_REGION) instead of being hardcoded.
//   - SES is called directly (SigV4 signed with Web Crypto); no bundled AWS SDK.
// The arithmetic CAPTCHA is unchanged, so NO form change is required to deploy this.
// (Turnstile is a separate, later change to this file + the form shortcode.)

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
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
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
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          Text: { Data: text, Charset: "UTF-8" },
        },
      },
    },
  });

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = await sha256Hex(body);

  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "POST",
    path,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await deriveSigningKey(env.AWS_SECRET_ACCESS_KEY, dateStamp, region, service);
  const signature = [...(await hmac(signingKey, stringToSign))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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

  if (!resp.ok) {
    throw new Error(`SES ${resp.status}: ${await resp.text()}`);
  }
  return resp;
}

// ---------------------------------------------------------------------------
// Arithmetic CAPTCHA (unchanged from the previous Worker)
// ---------------------------------------------------------------------------
function calculateCaptchaValue(expression) {
  if (!expression) return null;
  const tokens = expression.split("");
  const values = [];
  const ops = [];
  const applyOp = (op, b, a) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? null : parseInt((a / b).toString(), 10);
    }
    return 0;
  };
  const hasPrecedence = (op1, op2) => {
    if (op2 === "(" || op2 === ")") return false;
    if ((op1 === "*" || op1 === "/") && (op2 === "+" || op2 === "-")) return false;
    return true;
  };
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === " ") continue;
    if (tokens[i] >= "0" && tokens[i] <= "9") {
      let sbuf = "";
      while (i < tokens.length && tokens[i] >= "0" && tokens[i] <= "9") sbuf += tokens[i++];
      values.push(parseInt(sbuf, 10));
      i--;
    } else if (tokens[i] === "(") {
      ops.push(tokens[i]);
    } else if (tokens[i] === ")") {
      while (ops[ops.length - 1] !== "(") values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      ops.pop();
    } else if (["+", "-", "*", "/"].includes(tokens[i])) {
      while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1]))
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      ops.push(tokens[i]);
    }
  }
  while (ops.length > 0) values.push(applyOp(ops.pop(), values.pop(), values.pop()));
  return values.pop();
}

// ---------------------------------------------------------------------------
// Visitor "thank you" confirmation email (unchanged, bar the privacy-policy URL
// which now points at /policies/privacy/ rather than the old /legal/privacy)
// ---------------------------------------------------------------------------
const thankYouEmail = {
  subject: "Thank you for your message",
  text:
    "I have received your submission and will try to reply to you as soon as possible. " +
    "In the mean time you may wish to read my most recent articles.",
  html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f9f9f9;color:#575757;font-family:'Cabin',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td align="center" style="padding:20px;background:#ffffff;">
          <a href="https://www.donaldjenkins.com/"><img src="https://assets.donaldjenkins.com/images/system/donaldjenkins-logo-1200.jpeg" alt="Donald Jenkins" width="560" style="max-width:560px;width:100%;height:auto;border:0;"></a>
        </td></tr>
        <tr><td align="center" style="padding:0 10px 31px;background:#ffffff;">
          <p style="font-size:48px;line-height:1.2;margin:0;"><strong>Thank you.</strong></p>
        </td></tr>
        <tr><td style="padding:14px 55px 32px;background:#ffffff;font-size:18px;line-height:1.3;">
          <p style="margin:0 0 16px;">I have received your submission and will try to reply to you as soon as possible.</p>
          <p style="margin:0;">In the mean time you may wish to read my most recent articles.</p>
        </td></tr>
        <tr><td align="center" style="padding:0 33px 33px;background:#ffffff;">
          <a href="https://www.donaldjenkins.com/articles" style="display:inline-block;padding:16px 44px;background:#596c79;color:#ffffff;border-radius:6px;text-decoration:none;font-size:16px;"><strong>Read the articles</strong></a>
        </td></tr>
        <tr><td align="center" style="padding:10px;background:#575757;">
          <p style="font-size:12px;line-height:1.8;color:#fafafa;margin:0;">Your submission implies your agreement to my <a href="https://www.donaldjenkins.com/policies/privacy/" style="color:#f8cac6;">Privacy Policy</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
};

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
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") || "",
        },
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
    const captchaQuestion = formData.get("Captcha question");
    const captchaValue = formData.get("Captcha");

    // CAPTCHA (unchanged)
    const calculated = calculateCaptchaValue(captchaQuestion);
    if (!calculated || calculated !== Number(captchaValue)) {
      const headers = new Headers();
      headers.set("Location", failedRedirectUrl);
      return new Response("Invalid captcha", { status: 302, headers });
    }

    if (!firstName || !lastName || !email || !message || !redirectUrl || !consentCheck) {
      return new Response("Required field is empty", { status: 400, statusText: "Bad Request" });
    }

    const ownerHtml = `<h3>Message from ${firstName} ${lastName}</h3><p>Email: ${email}</p><p>${message}</p>`;
    const ownerText = `Message from ${firstName} ${lastName}\n${message}`;
    const ownerSubject = `Message from ${firstName} ${lastName}`;

    try {
      await Promise.all([
        // Confirmation to the visitor
        sendSesEmail(env, {
          to: email,
          from: FROM,
          replyTo: FROM,
          subject: thankYouEmail.subject,
          html: thankYouEmail.html,
          text: thankYouEmail.text,
        }),
        // Notification to the owner (Reply-To = the visitor)
        sendSesEmail(env, {
          to: SUPPORT_EMAIL,
          from: FROM,
          replyTo: email,
          subject: ownerSubject,
          html: ownerHtml,
          text: ownerText,
        }),
      ]);
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
