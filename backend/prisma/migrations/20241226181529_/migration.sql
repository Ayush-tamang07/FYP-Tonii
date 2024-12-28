/*
  Warnings:

  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `height` INTEGER NULL,
    ADD COLUMN `weight` INTEGER NULL,
    MODIFY `username` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;
