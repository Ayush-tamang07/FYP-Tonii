-- AlterTable
ALTER TABLE `notification` ADD COLUMN `isSent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `scheduledAt` DATETIME(3) NULL;
