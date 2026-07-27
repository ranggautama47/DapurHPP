import { baseEmailTemplate } from './base-email.template';

export function testEmailTemplate(frontendUrl: string): string {
  const content = `
    <p style="margin: 0 0 16px 0; font-size: 16px;">Halo,</p>
    <p style="margin: 0 0 16px 0;">Ini adalah email test dari infrastruktur <strong>EmailService</strong> DapurHPP.</p>
    <p style="margin: 0 0 24px 0; color: #564334;">Kalau email ini sampai, konfigurasi Resend sudah berfungsi dengan benar.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td align="center" style="background-color: #FF8A00; border-radius: 8px; padding: 12px 24px;">
          <a href="${frontendUrl}" style="font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; display: inline-block;">Buka DapurHPP</a>
        </td>
      </tr>
    </table>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #A69282;">Atau buka manual: <a href="${frontendUrl}" style="color: #FF8A00;">${frontendUrl}</a></p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}