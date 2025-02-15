/*
  Warnings:

  - You are about to drop the column `userId` on the `workoutplan` table. All the data in the column will be lost.
  - You are about to drop the `workoutplanset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `workoutplan` DROP FOREIGN KEY `WorkoutPlan_userId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutplanset` DROP FOREIGN KEY `WorkoutPlanSet_workoutPlanExerciseId_fkey`;

-- DropIndex
DROP INDEX `WorkoutPlan_userId_fkey` ON `workoutplan`;

-- AlterTable
ALTER TABLE `workoutplan` DROP COLUMN `userId`,
    ADD COLUMN `assignedToUserId` INTEGER NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdByAdmin` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `workoutplanset`;

-- AddForeignKey
ALTER TABLE `WorkoutPlan` ADD CONSTRAINT `WorkoutPlan_assignedToUserId_fkey` FOREIGN KEY (`assignedToUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
