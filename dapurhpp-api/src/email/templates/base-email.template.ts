export function baseEmailTemplate(content: string, frontendUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&family=Playfair+Display:wght@700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FFF8F6;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%;">
              <tr>
                <td style="background-color: #FFFFFF; border-radius: 12px; padding: 40px 32px; box-shadow: 0 2px 12px rgba(42,23,17,0.08);">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 24px; border-bottom: 1px solid #F0E8E2;">
                        <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #FF8A00; font-weight: 700;">DapurHPP</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 24px; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #2A1711;">
                        ${content}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 32px; border-top: 1px solid #F0E8E2; margin-top: 32px;">
                        <p style="margin: 0; font-family: 'Be Vietnam Pro', Arial, sans-serif; font-size: 12px; color: #A69282; text-align: center;">
                          &copy; ${new Date().getFullYear()} DapurHPP. Semua hak dilindungi.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export { baseEmailTemplate as emailBaseTemplate };