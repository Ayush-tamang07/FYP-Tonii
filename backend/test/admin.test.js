const request = require("supertest");
const app = require("../index.js"); 
const prisma = require("../utils/PrismaClient"); 

describe("POST /api/admin/addExercise", () => {
  const url = "/api/admin/addExercise";

  const validExercise = {
    name: "Cable Chest Press",
    type: "strength",
    muscle: "chest",
    equipment: "cable",
    difficulty: "intermediate",
    instructions: "Push the handles forward until arms are fully extended.",
    category: "Chest",
    videoUrl: "https://example.com/video.mp4",
  };

  // Clean up after tests
  afterAll(async () => {
    await prisma.exercise.deleteMany({
      where: {
        name: validExercise.name,
        muscle: validExercise.muscle,
        equipment: validExercise.equipment,
        category: validExercise.category,
      },
    });
    await prisma.$disconnect();
  });

  it("should add a new exercise successfully", async () => {
    const res = await request(app).post(url).send(validExercise);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Exercise added successfully.");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toBe(validExercise.name);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post(url).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "All fields are required.");
  });

  it("should return 409 if duplicate exercise exists", async () => {
    // First insert
    await request(app).post(url).send(validExercise);

    // Second insert - duplicate
    const res = await request(app).post(url).send(validExercise);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "An exercise with the same name, muscle, and equipment already exists."
    );
  });
});
