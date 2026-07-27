import { baseEmailTemplate } from './base-email.template';

export function emailChangeAlertTemplate(
  userName: string,
  oldEmail: string,
  newEmail: string,
  frontendUrl: string,
): string {
  const content = `
    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${userName}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Alamat email akun DapurHPP Anda telah berhasil diubah.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
      <tr>
        <td style="background-color: #FFF8F6; border-radius: 8px; padding: 16px; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 14px; color: #2A1711;">
          <p style="margin: 0 0 4px;"><strong>Email lama:</strong> ${oldEmail}</p>
          <p style="margin: 0;"><strong>Email baru:</strong> ${newEmail}</p>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 16px; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> melakukan perubahan ini, segera hubungi kami atau
      <a href="${frontendUrl}/forgot-password" style="color: #BF360C; text-decoration: underline;">reset password</a>
      Anda untuk mengamankan akun.
    </p>
    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika ini adalah tindakan Anda, abaikan email ini.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
