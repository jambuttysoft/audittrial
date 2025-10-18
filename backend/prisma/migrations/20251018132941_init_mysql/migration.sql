-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `isOAuthUser` BOOLEAN NOT NULL DEFAULT false,
    `oauthProvider` VARCHAR(191) NULL,
    `oauthId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `userType` ENUM('INDIVIDUAL', 'BUSINESS') NOT NULL DEFAULT 'INDIVIDUAL',
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `services` VARCHAR(191) NULL,
    `isVisibleToClients` BOOLEAN NOT NULL DEFAULT false,
    `acceptsJobOffers` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `xeroAccessToken` VARCHAR(191) NULL,
    `xeroRefreshToken` VARCHAR(191) NULL,
    `xeroTokenExpiry` DATETIME(3) NULL,
    `xeroTenantId` VARCHAR(191) NULL,
    `xeroTenantName` VARCHAR(191) NULL,
    `xeroConnectedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `abn` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `status` ENUM('QUEUE', 'PROCESSING', 'DIGITIZED', 'ERROR') NOT NULL DEFAULT 'QUEUE',
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedDate` DATETIME(3) NULL,
    `purchaseDate` DATETIME(3) NULL,
    `vendorName` VARCHAR(191) NULL,
    `vendorAbn` VARCHAR(191) NULL,
    `vendorAddress` VARCHAR(191) NULL,
    `documentType` VARCHAR(191) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `paymentType` VARCHAR(191) NULL,
    `amountExclTax` DOUBLE NULL,
    `taxAmount` DOUBLE NULL,
    `totalAmount` DOUBLE NULL,
    `expenseCategory` VARCHAR(191) NULL,
    `taxStatus` VARCHAR(191) NULL,
    `transactionDate` DATETIME(3) NULL,
    `vendor` VARCHAR(191) NULL,
    `abn` VARCHAR(191) NULL,
    `gstAmount` DOUBLE NULL,
    `description` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `transactionStatus` VARCHAR(191) NULL,
    `receiptData` JSON NULL,
    `userId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `digitized` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `originalDocumentId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `purchaseDate` DATETIME(3) NULL,
    `vendorName` VARCHAR(191) NULL,
    `vendorAbn` VARCHAR(191) NULL,
    `vendorAddress` VARCHAR(191) NULL,
    `documentType` VARCHAR(191) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `paymentType` VARCHAR(191) NULL,
    `amountExclTax` DOUBLE NULL,
    `taxAmount` DOUBLE NULL,
    `totalAmount` DOUBLE NULL,
    `expenseCategory` VARCHAR(191) NULL,
    `taxStatus` VARCHAR(191) NULL,
    `digitizedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `digitized_originalDocumentId_key`(`originalDocumentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digitized` ADD CONSTRAINT `digitized_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digitized` ADD CONSTRAINT `digitized_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
