-- AlterTable
ALTER TABLE `users` ADD COLUMN `password_reset_token_hash` VARCHAR(64) NULL;
ALTER TABLE `users` ADD COLUMN `password_reset_expires_at` DATETIME(3) NULL;