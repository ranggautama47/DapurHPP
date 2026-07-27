import { baseEmailTemplate } from './base-email.template';

export function changeEmailTemplate(
  userName: string,
  verifyLink: string,
  frontendUrl: string,
): string {
  const content = `
    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${userName}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Kami menerima permintaan untuk mengubah alamat email akun DapurHPP Anda.
      Klik tombol di bawah ini untuk memverifikasi kepemilikan alamat email baru Anda:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${verifyLink}"
             style="display: inline-block; padding: 14px 40px; background-color: #FF8A00; color: #FFFFFF; text-decoration: none; border-radius: 9999px; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; font-weight: 600; text-align: center;">
            Verifikasi Email Baru
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 8px; font-size: 13px; color: #8A7362;">
      ⏰ Link ini hanya berlaku selama <strong>1 jam</strong>.
    </p>
    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> meminta perubahan ini, abaikan email ini.
      Akun Anda tetap aman dengan alamat email lama.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
