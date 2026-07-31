import { baseEmailTemplate } from './base-email.template';
import { escapeHtml } from '../utils/escape-html';

export function verifyEmailTemplate(
  userName: string,
  verifyLink: string,
  frontendUrl: string,
): string {
  const safeUserName = escapeHtml(userName);

  const content = `
    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${safeUserName}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Terima kasih telah mendaftar di DapurHPP. Silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${verifyLink}"
             style="display: inline-block; padding: 14px 40px; background-color: #FF8A00; color: #FFFFFF; text-decoration: none; border-radius: 9999px; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; font-weight: 600; text-align: center;">
            Verifikasi Email
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 8px; font-size: 13px; color: #8A7362;">
      ⏰ Link ini hanya berlaku selama <strong>24 jam</strong>.
    </p>
    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> merasa mendaftar di DapurHPP, abaikan email ini.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
