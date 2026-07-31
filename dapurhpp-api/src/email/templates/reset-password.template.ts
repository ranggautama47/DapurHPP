import { baseEmailTemplate } from './base-email.template';
import { escapeHtml } from '../utils/escape-html';

export function resetPasswordTemplate(
  userName: string,
  resetLink: string,
  frontendUrl: string,
): string {
  const safeUserName = escapeHtml(userName);

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
      <tr>
        <td align="center">
          <img
            src="${frontendUrl}/email-template/reset-password-chef.png"
            alt="Reset Password DapurHPP"
            width="420"
            style="display:block; width:420px; max-width:100%; height:auto; border:0;"
          />
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${safeUserName}</strong>,
    </p>

    <p style="margin: 0 0 16px;">
      Kami menerima permintaan untuk mengatur ulang kata sandi akun <strong>DapurHPP</strong>.
      Klik tombol di bawah ini untuk melanjutkan proses pengaturan ulang password Anda.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a
            href="${resetLink}"
            style="display:inline-block;padding:14px 40px;background-color:#FF8A00;color:#FFFFFF;text-decoration:none;border-radius:9999px;font-family:'Be Vietnam Pro',Arial,sans-serif;font-size:15px;font-weight:600;text-align:center;"
          >
            Atur Ulang Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 8px; font-size: 13px; color: #8A7362;">
      ⏰ Link ini hanya berlaku selama <strong>1 jam</strong>.
    </p>

    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> meminta pengaturan ulang password, silakan abaikan email ini.
      Akun Anda tetap aman dan tidak ada perubahan yang dilakukan tanpa konfirmasi dari Anda.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
