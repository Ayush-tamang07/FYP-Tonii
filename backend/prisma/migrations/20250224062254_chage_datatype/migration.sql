/*
  Warnings:

  - You are about to drop the column `age` on the `user` table. All the data in the column will be lost.
  - Made the column `gender` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `age`,
    ADD COLUMN `dob` DATE NOT NULL DEFAULT '1970-01-01T00:00:00+00:00',
    MODIFY `gender` VARCHAR(191) NOT NULL,
    MODIFY `height` INTEGER NOT NULL,
    MODIFY `weight` DECIMAL(5, 2) NOT NULL;
