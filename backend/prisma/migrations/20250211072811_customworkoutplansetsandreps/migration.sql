-- CreateTable
CREATE TABLE `WorkoutPlanSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutPlanExerciseId` INTEGER NOT NULL,
    `weight_kg` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutPlanSet` ADD CONSTRAINT `WorkoutPlanSet_workoutPlanExerciseId_fkey` FOREIGN KEY (`workoutPlanExerciseId`) REFERENCES `WorkoutPlanExercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
