-- AlterTable
ALTER TABLE `users` ADD COLUMN `pending_email` VARCHAR(150) NULL,
    ADD COLUMN `email_change_token_hash` VARCHAR(64) NULL,
    ADD COLUMN `email_change_expires_at` DATETIME(3) NULL;
