/*
  Warnings:

  - Added the required column `adminId` to the `Branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `branch` ADD COLUMN `adminId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `role` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
