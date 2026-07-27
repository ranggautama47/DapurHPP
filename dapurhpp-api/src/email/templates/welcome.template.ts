import { baseEmailTemplate } from './base-email.template';

export function welcomeTemplate(
  userName: string,
  frontendUrl: string,
): string {
  const content = `
    <p style="margin: 0 0 16px; font-size: 16px;">
      Halo <strong>${userName}</strong>,
    </p>
    <p style="margin: 0 0 16px;">
      Selamat datang di <strong>DapurHPP</strong>! 🎉
    </p>
    <p style="margin: 0 0 16px;">
      Kami senang Anda bergabung. Sekarang Anda bisa mulai mengelola bisnis kuliner dengan lebih mudah — hitung HPP, pantau margin, dan kelola resep dalam satu tempat.
    </p>
    <p style="margin: 0 0 16px;">
      Jangan lupa verifikasi email Anda agar semua fitur dapat digunakan secara optimal.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td align="center">
          <a href="${frontendUrl}/dashboard"
             style="display: inline-block; padding: 14px 40px; background-color: #FF8A00; color: #FFFFFF; text-decoration: none; border-radius: 9999px; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; font-weight: 600; text-align: center;">
            Buka Dashboard
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; font-size: 13px; color: #8A7362;">
      Jika ada pertanyaan, jangan ragu untuk menghubungi kami.
    </p>
  `;

  return baseEmailTemplate(content, frontendUrl);
}
