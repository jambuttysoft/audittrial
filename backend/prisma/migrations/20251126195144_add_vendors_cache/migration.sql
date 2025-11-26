-- CreateTable
CREATE TABLE `vendors` (
    `id` VARCHAR(191) NOT NULL,
    `abn` VARCHAR(191) NOT NULL,
    `abnStatus` VARCHAR(191) NULL,
    `abnStatusEffectiveFrom` DATETIME(3) NULL,
    `acn` VARCHAR(191) NULL,
    `addressDate` DATETIME(3) NULL,
    `addressPostcode` VARCHAR(191) NULL,
    `addressState` VARCHAR(191) NULL,
    `businessName` JSON NULL,
    `entityName` VARCHAR(191) NULL,
    `entityTypeCode` VARCHAR(191) NULL,
    `entityTypeName` VARCHAR(191) NULL,
    `gst` DATETIME(3) NULL,
    `message` VARCHAR(191) NULL,
    `requestUpdateDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vendors_abn_key`(`abn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
