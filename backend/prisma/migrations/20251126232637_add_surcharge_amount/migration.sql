-- AlterTable
ALTER TABLE `digitized` ADD COLUMN `surchargeAmount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `digitized_ready` ADD COLUMN `surchargeAmount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `digitized_review` ADD COLUMN `surchargeAmount` DOUBLE NULL;
