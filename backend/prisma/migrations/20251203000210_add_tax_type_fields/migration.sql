-- Add taxType and taxTypeName to digitized tables
ALTER TABLE `digitized`
  ADD COLUMN `taxType` VARCHAR(191) NULL,
  ADD COLUMN `taxTypeName` VARCHAR(191) NULL;

ALTER TABLE `digitized_ready`
  ADD COLUMN `taxType` VARCHAR(191) NULL,
  ADD COLUMN `taxTypeName` VARCHAR(191) NULL;

ALTER TABLE `digitized_review`
  ADD COLUMN `taxType` VARCHAR(191) NULL,
  ADD COLUMN `taxTypeName` VARCHAR(191) NULL;

ALTER TABLE `digitized_reported`
  ADD COLUMN `taxType` VARCHAR(191) NULL,
  ADD COLUMN `taxTypeName` VARCHAR(191) NULL;
