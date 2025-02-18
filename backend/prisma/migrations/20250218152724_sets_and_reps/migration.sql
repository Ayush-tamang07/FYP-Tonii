-- CreateTable
CREATE TABLE `WorkoutSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutPlanExerciseId` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutSet` ADD CONSTRAINT `WorkoutSet_workoutPlanExerciseId_fkey` FOREIGN KEY (`workoutPlanExerciseId`) REFERENCES `WorkoutPlanExercise`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
