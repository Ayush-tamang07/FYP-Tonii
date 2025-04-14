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

describe("GET /api/admin/readFeedback", () => {
  let userId;
  let createdDate;

  beforeAll(async () => {
    // Create a user
    const user = await prisma.user.create({
      data: {
        username: "feedbackUser",
        email: "feedback@example.com",
        password: "testpass",
        height: 170,
        weight: 70,
        dob: new Date("2005-03-24T00:00:00Z"),
        gender: "male",
      },
    });

    userId = user.id;

    // Create feedback entries
    const feedback1 = await prisma.feedback.create({
      data: {
        feedback_type: "Bug Report",
        description: "Test bug report feedback",
        userId,
        createdAt: new Date("2024-12-01T10:00:00.000Z"),
      },
    });

    const feedback2 = await prisma.feedback.create({
      data: {
        feedback_type: "Suggestion",
        description: "Test suggestion feedback",
        userId,
        createdAt: new Date("2024-12-01T15:30:00.000Z"),
      },
    });

    createdDate = "2024-12-01";
  });

  afterAll(async () => {
    await prisma.feedback.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("should return all feedbacks when no filters are provided", async () => {
    const res = await request(app).get("/api/admin/readFeedback");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("feedback_type");
    expect(res.body[0]).toHaveProperty("user");
    expect(res.body[0].user).toHaveProperty("username");
  });

  it("should filter feedback by feedback_type", async () => {
    const res = await request(app).get("/api/admin/readFeedback?feedback_type=Bug Report");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(item => {
      expect(item.feedback_type).toBe("Bug Report");
    });
  });

  it("should filter feedback by date", async () => {
    const res = await request(app).get(`/api/admin/readFeedback?date=${createdDate}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(item => {
      expect(new Date(item.createdAt).toISOString().startsWith(createdDate)).toBe(true);
    });
  });

  it("should return empty array for non-matching filters", async () => {
    const res = await request(app).get("/api/admin/readFeedback?feedback_type=InvalidType");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
