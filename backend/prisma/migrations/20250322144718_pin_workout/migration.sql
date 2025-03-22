-- AlterTable
ALTER TABLE `workoutplan` ADD COLUMN `isPinned` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `WorkoutPlan_isPinned_idx` ON `WorkoutPlan`(`isPinned`);
