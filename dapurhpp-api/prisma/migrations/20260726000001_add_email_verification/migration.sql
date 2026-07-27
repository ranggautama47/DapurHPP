-- Add email verification fields
ALTER TABLE `users` ADD COLUMN `email_verified` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `users` ADD COLUMN `email_verify_token_hash` VARCHAR(64) NULL;
ALTER TABLE `users` ADD COLUMN `email_verify_expires_at` DATETIME(3) NULL;

-- Backfill: set email_verified = true for all existing users (created before this migration)
UPDATE `users` SET `email_verified` = true WHERE `created_at` < NOW();
