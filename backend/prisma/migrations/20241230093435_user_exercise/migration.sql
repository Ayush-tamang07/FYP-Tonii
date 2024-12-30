-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `muscle` VARCHAR(191) NOT NULL,
    `equipment` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `instructions` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
