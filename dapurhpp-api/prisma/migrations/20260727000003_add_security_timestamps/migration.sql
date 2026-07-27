-- AlterTable
ALTER TABLE `users` ADD COLUMN `last_login_at` DATETIME(3) NULL,
    ADD COLUMN `password_changed_at` DATETIME(3) NULL,
    ADD COLUMN `email_verified_at` DATETIME(3) NULL;

-- Backfill email_verified_at for existing verified users (email_verified = true)
UPDATE `users` SET `email_verified_at` = `created_at` WHERE `email_verified` = true AND `email_verified_at` IS NULL;