-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bahan_baku` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `satuan` ENUM('kg', 'gram', 'liter', 'ml', 'pcs', 'buah', 'bungkus') NOT NULL,
    `harga_terakhir` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `bahan_baku_user_id_idx`(`user_id`),
    INDEX `bahan_baku_nama_idx`(`nama`),
    UNIQUE INDEX `bahan_baku_user_id_nama_key`(`user_id`, `nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(200) NULL,
    `telepon` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `supplier_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resep` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `foto_url` VARCHAR(255) NULL,
    `estimasi_hasil` INTEGER UNSIGNED NOT NULL,
    `harga_jual` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `resep_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_resep` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `resep_id` INTEGER UNSIGNED NOT NULL,
    `bahan_baku_id` INTEGER UNSIGNED NOT NULL,
    `jumlah` DECIMAL(10, 3) NOT NULL,
    `satuan` ENUM('kg', 'gram', 'liter', 'ml', 'pcs', 'buah', 'bungkus') NOT NULL,

    UNIQUE INDEX `detail_resep_resep_id_bahan_baku_id_key`(`resep_id`, `bahan_baku_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `belanja` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `tanggal` DATE NOT NULL,
    `total_belanja` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `catatan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `belanja_user_id_tanggal_idx`(`user_id`, `tanggal`),
    INDEX `belanja_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_belanja` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `belanja_id` INTEGER UNSIGNED NOT NULL,
    `bahan_baku_id` INTEGER UNSIGNED NOT NULL,
    `supplier_id` INTEGER UNSIGNED NULL,
    `jumlah` DECIMAL(10, 3) NOT NULL,
    `satuan` ENUM('kg', 'gram', 'liter', 'ml', 'pcs', 'buah', 'bungkus') NOT NULL,
    `harga_satuan` DECIMAL(12, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,

    INDEX `detail_belanja_bahan_baku_id_belanja_id_idx`(`bahan_baku_id`, `belanja_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produksi` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `resep_id` INTEGER UNSIGNED NOT NULL,
    `tanggal` DATE NOT NULL,
    `estimasi_hasil` INTEGER UNSIGNED NOT NULL,
    `hasil_nyata` INTEGER UNSIGNED NOT NULL,
    `hpp_per_pcs` DECIMAL(12, 2) NOT NULL,
    `harga_jual_saat_produksi` DECIMAL(12, 2) NOT NULL,
    `total_modal` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('DRAFT', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `produksi_user_id_tanggal_idx`(`user_id`, `tanggal`),
    INDEX `produksi_resep_id_idx`(`resep_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjualan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `produksi_id` INTEGER UNSIGNED NOT NULL,
    `tanggal` DATE NOT NULL,
    `terjual` INTEGER UNSIGNED NOT NULL,
    `harga_jual` DECIMAL(12, 2) NOT NULL,
    `total_pendapatan` DECIMAL(12, 2) NOT NULL,
    `sisa` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `penjualan_user_id_tanggal_idx`(`user_id`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengeluaran_lain` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `tanggal` DATE NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jumlah` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `pengeluaran_lain_user_id_tanggal_idx`(`user_id`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bahan_baku` ADD CONSTRAINT `bahan_baku_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `supplier` ADD CONSTRAINT `supplier_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resep` ADD CONSTRAINT `resep_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_resep` ADD CONSTRAINT `detail_resep_resep_id_fkey` FOREIGN KEY (`resep_id`) REFERENCES `resep`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_resep` ADD CONSTRAINT `detail_resep_bahan_baku_id_fkey` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `belanja` ADD CONSTRAINT `belanja_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_belanja` ADD CONSTRAINT `detail_belanja_belanja_id_fkey` FOREIGN KEY (`belanja_id`) REFERENCES `belanja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_belanja` ADD CONSTRAINT `detail_belanja_bahan_baku_id_fkey` FOREIGN KEY (`bahan_baku_id`) REFERENCES `bahan_baku`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_belanja` ADD CONSTRAINT `detail_belanja_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produksi` ADD CONSTRAINT `produksi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produksi` ADD CONSTRAINT `produksi_resep_id_fkey` FOREIGN KEY (`resep_id`) REFERENCES `resep`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_produksi_id_fkey` FOREIGN KEY (`produksi_id`) REFERENCES `produksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengeluaran_lain` ADD CONSTRAINT `pengeluaran_lain_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
