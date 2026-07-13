-- DropForeignKey
ALTER TABLE `belanja` DROP FOREIGN KEY `belanja_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `belanja` ADD CONSTRAINT `belanja_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
