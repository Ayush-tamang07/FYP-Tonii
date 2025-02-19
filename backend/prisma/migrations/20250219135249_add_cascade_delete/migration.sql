-- DropForeignKey
ALTER TABLE `workoutplanexercise` DROP FOREIGN KEY `WorkoutPlanExercise_workoutPlanId_fkey`;

-- DropForeignKey
ALTER TABLE `workoutset` DROP FOREIGN KEY `WorkoutSet_workoutPlanExerciseId_fkey`;

-- DropIndex
DROP INDEX `WorkoutPlanExercise_workoutPlanId_fkey` ON `workoutplanexercise`;

-- DropIndex
DROP INDEX `WorkoutSet_workoutPlanExerciseId_fkey` ON `workoutset`;

-- AddForeignKey
ALTER TABLE `WorkoutPlanExercise` ADD CONSTRAINT `WorkoutPlanExercise_workoutPlanId_fkey` FOREIGN KEY (`workoutPlanId`) REFERENCES `WorkoutPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutSet` ADD CONSTRAINT `WorkoutSet_workoutPlanExerciseId_fkey` FOREIGN KEY (`workoutPlanExerciseId`) REFERENCES `WorkoutPlanExercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
