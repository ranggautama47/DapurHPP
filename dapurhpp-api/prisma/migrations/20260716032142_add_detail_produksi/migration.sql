-- CreateTable
CREATE TABLE `detail_produksi` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `produksi_id` INTEGER UNSIGNED NOT NULL,
    `bahan_baku_id` INTEGER UNSIGNED NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jumlah` DECIMAL(10, 2) NOT NULL,
    `satuan` ENUM('kg', 'gram', 'liter', 'ml', 'pcs', 'buah', 'bungkus') NOT NULL,
    `harga_terakhir` DECIMAL(12, 2) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,

    INDEX `detail_produksi_produksi_id_idx`(`produksi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_produksi` ADD CONSTRAINT `detail_produksi_produksi_id_fkey` FOREIGN KEY (`produksi_id`) REFERENCES `produksi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
