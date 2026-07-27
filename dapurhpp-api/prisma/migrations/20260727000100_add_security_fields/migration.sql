-- Add security tracking fields to users table
ALTER TABLE `users` 
  ADD COLUMN `last_login_at` DATETIME(3) NULL,
  ADD COLUMN `password_changed_at` DATETIME(3) NULL,
  ADD COLUMN `email_verified_at` DATETIME(3) NULL;

-- Backfill emailVerifiedAt untuk user yang sudah emailVerified = true
-- Gunakan createdAt sebagai estimasi, karena tanggal verifikasi asli tidak tercatat
UPDATE `users` 
SET `email_verified_at` = `created_at` 
WHERE `email_verified` = TRUE AND `email_verified_at` IS NULL;