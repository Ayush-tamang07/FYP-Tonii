// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();


// const updateVideoUrls = async () => {
//   try {
//     const oldUrl =
//       "https://v1.pinimg.com/videos/mc/expMp4/74/92/98/74929875361f0f599fe039ea0fcf344b_t3.mp4"; // Wrong URL
//     const newUrl =
//       "https://www.shutterstock.com/shutterstock/videos/3710163749/preview/stock-footage-rocky-pull-up-pulldown-back-exercise-workout-animation-video-training-guide.webm"; // Correct URL

//     const updated = await prisma.exercise.updateMany({
//       where: { videoUrl: oldUrl },
//       data: { videoUrl: newUrl },
//     });

//     console.log(`Updated ${updated.count} records.`);
//   } catch (error) {
//     console.error("Error updating records:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// updateVideoUrls();
