import { baseEmailTemplate } from './base-email.template';
import { escapeHtml } from '../utils/escape-html';

export function emailChangeAlertTemplate(
  userName: string,
  oldEmail: string,
  newEmail: string,
  frontendUrl: string,
): string {
  const safeUserName = escapeHtml(userName);
  const safeOldEmail = escapeHtml(oldEmail);
  const safeNewEmail = escapeHtml(newEmail);

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
      <tr>
        <td align="center">
          <img
            src="${frontendUrl}/email-template/email-change-success-chef.png"
            alt="Perubahan Email Berhasil"
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
      Alamat email akun <strong>DapurHPP</strong> Anda telah berhasil diubah.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0 24px;">
      <tr>
        <td
          style="
            background-color:#FFF8F6;
            border-radius:8px;
            padding:16px;
            font-family:'Be Vietnam Pro', Arial, sans-serif;
            font-size:14px;
            color:#2A1711;
          "
        >
          <p style="margin:0 0 8px;">
            <strong>Email lama:</strong><br>
            ${safeOldEmail}
          </p>

          <p style="margin:0;">
            <strong>Email baru:</strong><br>
            ${safeNewEmail}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> melakukan perubahan ini, segera hubungi kami atau
      <a
        href="${frontendUrl}/forgot-password"
        style="color:#BF360C;text-decoration:underline;"
      >
        reset password
      </a>
      untuk mengamankan akun Anda.
    </p>

    <p style="margin:0;font-size:13px;color:#8A7362;">
      Jika perubahan ini memang Anda lakukan, Anda dapat mengabaikan email ini.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
