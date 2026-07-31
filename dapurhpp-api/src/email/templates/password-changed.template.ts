import { baseEmailTemplate } from './base-email.template';
import { escapeHtml } from '../utils/escape-html';

export function passwordChangedTemplate(
  userName: string,
  frontendUrl: string,
): string {
  const safeUserName = escapeHtml(userName);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const content = `
    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${safeUserName}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Password akun DapurHPP Anda telah berhasil diubah pada <strong>${formattedDate}</strong>.
    </p>
    <p style="margin: 0 0 16px; font-size: 13px; color: #8A7362;">
      Jika Anda <strong>tidak</strong> melakukan perubahan ini, segera hubungi kami atau
      <a href="${frontendUrl}/forgot-password" style="color: #BF360C; text-decoration: underline;">reset password</a>
      Anda kembali untuk mengamankan akun.
    </p>
    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika ini adalah tindakan Anda, abaikan email ini.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
