import express from "express";

import { welcomeTemplate } from "../src/email/templates/welcome.template";
import { verifyEmailTemplate } from "../src/email/templates/verify-email.template";
import { resetPasswordTemplate } from "../src/email/templates/reset-password.template";
import { passwordChangedTemplate } from "../src/email/templates/password-changed.template";
import { changeEmailTemplate } from "../src/email/templates/change-email.template";
import { emailChangeAlertTemplate } from "../src/email/templates/email-change-alert.template";
import { testEmailTemplate } from "../src/email/templates/test-email.template";

const DUMMY_NAME = "Rangga Utama";
const DUMMY_URL = "http://localhost:3000";
const DUMMY_LINK = "http://localhost:3000/auth/action?token=dummy-token-123";
const DUMMY_OLD_EMAIL = "lama@dapurhpp.com";
const DUMMY_NEW_EMAIL = "baru@dapurhpp.com";

interface TemplateEntry {
  name: string;
  label: string;
  render: () => string;
}

const templates: TemplateEntry[] = [
  { name: "welcome", label: "Welcome Email", render: () => welcomeTemplate(DUMMY_NAME, DUMMY_URL) },
  { name: "verify-email", label: "Verify Email", render: () => verifyEmailTemplate(DUMMY_NAME, DUMMY_LINK, DUMMY_URL) },
  { name: "reset-password", label: "Reset Password", render: () => resetPasswordTemplate(DUMMY_NAME, DUMMY_LINK, DUMMY_URL) },
  { name: "password-changed", label: "Password Changed", render: () => passwordChangedTemplate(DUMMY_NAME, DUMMY_URL) },
  { name: "change-email", label: "Change Email", render: () => changeEmailTemplate(DUMMY_NAME, DUMMY_LINK, DUMMY_URL) },
  { name: "email-change-alert", label: "Email Change Alert", render: () => emailChangeAlertTemplate(DUMMY_NAME, DUMMY_OLD_EMAIL, DUMMY_NEW_EMAIL, DUMMY_URL) },
  { name: "test-email", label: "Test Email", render: () => testEmailTemplate(DUMMY_URL) },
];

const app = express();
const PORT = 3333;

app.get("/", (_req, res) => {
  const links = templates
    .map((t) => `<a href="/preview/${t.name}" style="display:block;padding:12px 20px;margin:8px 0;background:#FF8A00;color:#fff;text-decoration:none;border-radius:9999px;font-weight:600;text-align:center;">${t.label}</a>`)
    .join("\n");

  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DapurHPP — Email Preview</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #FFF8F6; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .card { background: #fff; border-radius: 16px; padding: 40px; width: 420px; box-shadow: 0 4px 24px rgba(42,23,17,0.08); }
        h1 { font-size: 22px; color: #2A1711; margin-bottom: 8px; }
        p { font-size: 14px; color: #8A7362; margin-bottom: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📧 DapurHPP — Email Preview</h1>
        <p>Pilih template email untuk melihat pratinjau:</p>
        ${links}
      </div>
    </body>
    </html>
  `);
});

app.get("/preview/:name", (req, res) => {
  const template = templates.find((t) => t.name === req.params.name);

  if (!template) {
    res.status(404).send("Template tidak ditemukan");
    return;
  }

  res.send(template.render());
});

app.listen(PORT, () => {
  console.log(`DapurHPP Email Preview Server berjalan di http://localhost:${PORT}`);
});
