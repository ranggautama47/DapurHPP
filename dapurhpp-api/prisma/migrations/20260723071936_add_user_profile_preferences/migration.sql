-- AlterTable
ALTER TABLE `users` ADD COLUMN `font_size` VARCHAR(10) NOT NULL DEFAULT 'sedang',
    ADD COLUMN `nama_usaha` VARCHAR(100) NULL,
    ADD COLUMN `nomor_hp` VARCHAR(20) NULL,
    ADD COLUMN `notif_aplikasi` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notif_penjualan` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notif_stok` BOOLEAN NOT NULL DEFAULT true;
