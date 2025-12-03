-- Add missing ABN column to users table to match Prisma schema
ALTER TABLE `users`
  ADD COLUMN `abn` VARCHAR(191) NULL;

