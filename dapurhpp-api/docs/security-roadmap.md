# 🔐 DapurHPP — Security & Email Roadmap

> Status implementasi fitur keamanan dan email pada DapurHPP.
>
> Dokumen ini menjelaskan urutan implementasi, alasan arsitektur, dan status setiap phase.
>
> Prinsip utama:
>
> - Build feature first, not template first.
> - Setiap email template dibuat ketika endpoint yang menggunakannya sudah ada.
> - Hindari dead code.
> - Security lebih penting daripada jumlah fitur.

---

# ✅ Progress Overview

| Phase   | Feature                       | Status      |
| ------- | ----------------------------- | ----------- |
| Phase 1 | Email Infrastructure          | ✅ Complete |
| Phase 2 | Forgot Password               | ✅ Complete |
| Phase 3 | Password Changed Notification | ✅ Complete |
| Phase 4 | Register Verification         | ✅ Complete |
| Phase 5 | Secure Change Email           | ✅ Complete |
| Phase 6 | Security Hardening            | ✅ Complete |

---

# Phase 1 — Email Infrastructure

Status: ✅ Complete
(...tidak berubah, lihat versi sebelumnya...)

---

# Phase 2 — Forgot Password

Status: ✅ Complete
(...tidak berubah...)

---

# Phase 3 — Password Changed Notification

Status: ✅ Complete
(...tidak berubah...)

---

# Phase 4 — Register Verification

Status: ✅ Complete

## Tujuan

Memastikan email yang digunakan saat registrasi benar-benar dimiliki pengguna.

## Flow

Register
│
Create User
│
Send Welcome Email
│
Send Verify Email
│
User Click Verification Link
│
Email Verified
│
Login (tidak diblokir walau belum verified)

## Keputusan Desain

- Login TIDAK diblokir oleh status emailVerified — hanya soft reminder
  banner di dashboard. Alasan: menghindari resiko user baru stuck
  total kalau email nyasar ke spam/delay SMTP.
- User existing (sebelum Phase 4) di-backfill emailVerified = true
  agar tidak locked out.
- Resend verification tersedia via POST /auth/resend-verification,
  anti-enumeration (response selalu sama).

## Endpoint

POST /auth/verify-email
POST /auth/resend-verification

## Template

welcome.template.ts
verify-email.template.ts

---

# Phase 5 — Secure Change Email

Status: ✅ Complete

## Tujuan

Mengamankan proses pergantian email akun.

## Flow

Settings
│
Input Current Password
│
Input New Email
│
Simpan sebagai pendingEmail (kolom email TIDAK berubah dulu)
│
Send Verification Email (ke email baru)
│
User Verify
│
Email Updated (pendingEmail → email)
│
Alert ke Email Lama

## Keputusan Desain

- Email baru disimpan di kolom sementara `pendingEmail`, BUKAN
  langsung menimpa kolom `email` — supaya identitas akun tidak
  berubah sebelum kepemilikan email baru terverifikasi.
- Endpoint verify-change-email tetap butuh JWT (beda dari verify-email
  register yang publicly accessible), karena ini konteks pengguna
  yang sedang login mengubah akunnya sendiri.
- Request ganti email berulang meng-overwrite token lama (bukan
  menumpuk), token lama otomatis invalid.

## Security

- Current password required
- Email verification required (ke email baru)
- Token hash SHA-256, one-time use
- Alert dikirim ke email LAMA setelah perubahan sukses, bukan sebelum

## Endpoint

PATCH /users/email
POST /users/verify-change-email

## Templates

change-email.template.ts
email-change-alert.template.ts

---

# Phase 6 — Security Hardening

Status: ✅ Complete

## Tujuan

Memperkuat fitur yang sudah ada (bukan menambah fitur baru),
mengurangi permukaan serangan pada endpoint sensitif, dan menampilkan
ringkasan keamanan akun ke pengguna.

## 6.1 — Rate Limiting (API level)

Menggunakan `@nestjs/throttler`, default global 10 request/menit per IP.

Endpoint dengan limit lebih ketat (5 request/menit):

POST /auth/forgot-password
POST /auth/resend-verification
PATCH /users/email

## 6.2 — Email Send Throttling (berbeda dari rate limit API)

Membatasi pengiriman EMAIL, bukan sekadar request — cooldown 15 menit
antar pengiriman berturut-turut, di-reuse dari field expiry yang sudah
ada (tanpa kolom counter tambahan):

forgotPassword() → cooldown 15 menit
resendVerification() → cooldown 15 menit
updateEmail() → cooldown 15 menit

Anti-enumeration tetap terjaga — response tetap generic sukses
meskipun email di-skip karena masih dalam cooldown.

## 6.3 — Security Timestamp Fields

Field baru di model User:

lastLoginAt DateTime?
passwordChangedAt DateTime?
emailVerifiedAt DateTime?

Titik pengisian:

login() → lastLoginAt = now
resetPassword() → passwordChangedAt = now
updatePassword() → passwordChangedAt = now
verifyEmail() → emailVerifiedAt = now
verifyChangeEmail() → emailVerified = false, emailVerifiedAt = null
(email baru wajib diverifikasi ulang statusnya)

Backfill migration: emailVerifiedAt = createdAt untuk user existing
yang emailVerified sudah true sebelum Phase 6.

## 6.4 — Ringkasan Keamanan (UI)

Ditambahkan ke `security-section.tsx` yang sudah ada — TIDAK membuat
komponen/halaman baru. Menampilkan:

✓ Email Terverifikasi [tanggal]
Password terakhir diubah [tanggal / "Belum pernah diubah"]
Login terakhir [tanggal / "-"]
Akun dibuat [tanggal]

## Yang Sengaja Tidak Dikerjakan

- ❌ Security Score / skor numerik — dianggap vanity metric tanpa
  substansi teknis untuk aplikasi 1-user
- ❌ IP address / device / browser tracking
- ❌ Session management multi-device
- ❌ Activity log / audit trail penuh
- ❌ Account lockout permanen

Alasan: kompleksitas tambahan tidak sebanding dengan manfaat untuk
skala aplikasi ini (dashboard internal 1 pemilik usaha), dan beresiko
menambah permukaan bug tanpa nilai keamanan nyata yang proporsional.

---

# Design Principles

(...tidak berubah, lihat versi sebelumnya...)

---

# Folder Structure

src/email/

├── email.module.ts
├── email.service.ts

└── templates
├── base-email.template.ts
├── test-email.template.ts
├── reset-password.template.ts
├── password-changed.template.ts
├── welcome.template.ts
├── verify-email.template.ts
├── change-email.template.ts
└── email-change-alert.template.ts

---

# Current Status

✅ Email Infrastructure
↓
✅ Forgot Password
↓
✅ Password Changed Notification
↓
✅ Register Verification
↓
✅ Secure Change Email
↓
✅ Security Hardening
↓
🏁 Security & Account Roadmap — SELESAI

---

# Long-term Authentication Flow

REGISTER
│
Welcome Email
│
Verify Email (opsional, tidak blocking login)
│
Login → lastLoginAt tercatat
│
Forgot Password
│
Reset Password → passwordChangedAt tercatat
│
Password Changed Email
│
Change Email → pendingEmail → verifikasi → email berubah
│
Alert ke Email Lama
│
Ringkasan Keamanan tampil di Pengaturan

---

# Notes

Roadmap ini sengaja disusun berdasarkan implementasi fitur, bukan
berdasarkan jumlah template email maupun jumlah fitur security. Setiap
phase memiliki bukti verifikasi konkret (curl test, screenshot email,
query database) sebelum dianggap selesai — bukan hanya klaim "build
sukses".

Dengan roadmap Security & Account ini selesai, fokus pengembangan
berikutnya kembali ke fitur inti DapurHPP (kalkulasi HPP, verifikasi
resep, testing alur produksi-penjualan end-to-end).
