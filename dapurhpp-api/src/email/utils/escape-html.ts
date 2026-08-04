/**
 * Escape karakter HTML-unsafe untuk mencegah HTML/script injection
 * saat data user-originated diinterpolasi ke dalam template email.
 *
 * Escape-at-render-time: dipanggil di titik interpolasi template,
 * TIDAK mengubah data yang tersimpan di database atau input asli.
 *
 * Menangani non-string secara aman (fallback ke string kosong)
 * agar tidak melempar error jika suatu saat dipanggil dengan
 * nilai null/undefined dari pemanggil yang tidak strict.
 */
export function escapeHtml(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;') // harus paling pertama, sebelum entity lain ditambahkan
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
