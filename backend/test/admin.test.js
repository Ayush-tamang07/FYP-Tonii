const request = require("supertest");
const app = require("../index.js"); 
const prisma = require("../utils/PrismaClient"); 

// describe("POST /api/admin/addExercise", () => {
//   const url = "/api/admin/addExercise";

//   const validExercise = {
//     name: "Cable Chest Press",
//     type: "strength",
//     muscle: "chest",
//     equipment: "cable",
//     difficulty: "intermediate",
//     instructions: "Push the handles forward until arms are fully extended.",
//     category: "Chest",
//     videoUrl: "https://example.com/video.mp4",
//   };

//   afterAll(async () => {
//     await prisma.exercise.deleteMany({
//       where: {
//         name: validExercise.name,
//         muscle: validExercise.muscle,
//         equipment: validExercise.equipment,
//         category: validExercise.category,
//       },
//     });
//     await prisma.$disconnect();
//   });

//   it("should add a new exercise successfully", async () => {
//     const res = await request(app).post(url).send(validExercise);

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body).toHaveProperty("message", "Exercise added successfully.");
//     expect(res.body).toHaveProperty("data");
//     expect(res.body.data.name).toBe(validExercise.name);
//   });

//   it("should return 400 if required fields are missing", async () => {
//     const res = await request(app).post(url).send({});

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("success", false);
//     expect(res.body).toHaveProperty("message", "All fields are required.");
//   });

//   it("should return 409 if duplicate exercise exists", async () => {
//     await request(app).post(url).send(validExercise);

//     const res = await request(app).post(url).send(validExercise);

//     expect(res.statusCode).toBe(409);
//     expect(res.body).toHaveProperty("success", false);
//     expect(res.body).toHaveProperty(
//       "message",
//       "An exercise with the same name, muscle, and equipment already exists."
//     );
//   });
// });

// describe("GET /api/admin/readFeedback", () => {
//   let userId;
//   let createdDate;

//   beforeAll(async () => {
//     const user = await prisma.user.create({
//       data: {
//         username: "feedbackUser",
//         email: "feedback@example.com",
//         password: "testpass",
//         height: 170,
//         weight: 70,
//         dob: new Date("2005-03-24T00:00:00Z"),
//         gender: "male",
//       },
//     });

//     userId = user.id;

//     const feedback1 = await prisma.feedback.create({
//       data: {
//         feedback_type: "Bug Report",
//         description: "Test bug report feedback",
//         userId,
//         createdAt: new Date("2024-12-01T10:00:00.000Z"),
//       },
//     });

//     const feedback2 = await prisma.feedback.create({
//       data: {
//         feedback_type: "Suggestion",
//         description: "Test suggestion feedback",
//         userId,
//         createdAt: new Date("2024-12-01T15:30:00.000Z"),
//       },
//     });

//     createdDate = "2024-12-01";
//   });

//   afterAll(async () => {
//     await prisma.feedback.deleteMany({ where: { userId } });
//     await prisma.user.delete({ where: { id: userId } });
//     await prisma.$disconnect();
//   });

//   it("should return all feedbacks when no filters are provided", async () => {
//     const res = await request(app).get("/api/admin/readFeedback");

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBeGreaterThan(0);
//     expect(res.body[0]).toHaveProperty("feedback_type");
//     expect(res.body[0]).toHaveProperty("user");
//     expect(res.body[0].user).toHaveProperty("username");
//   });

//   it("should filter feedback by feedback_type", async () => {
//     const res = await request(app).get("/api/admin/readFeedback?feedback_type=Bug Report");

//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBeGreaterThan(0);
//     res.body.forEach(item => {
//       expect(item.feedback_type).toBe("Bug Report");
//     });
//   });

//   it("should filter feedback by date", async () => {
//     const res = await request(app).get(`/api/admin/readFeedback?date=${createdDate}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBeGreaterThan(0);
//     res.body.forEach(item => {
//       expect(new Date(item.createdAt).toISOString().startsWith(createdDate)).toBe(true);
//     });
//   });

//   it("should return empty array for non-matching filters", async () => {
//     const res = await request(app).get("/api/admin/readFeedback?feedback_type=InvalidType");

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBe(0);
//   });
// });

describe("GET /api/admin/readUser", () => {
  let adminToken;
  let testUserId;
  const route = "/api/admin/readUser";

  beforeAll(async () => {
    // Make sure admin exists
    await prisma.user.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        username: "Admin",
        email: "admin@gmail.com",
        password: "Adm!n025", 
        weight: 70,
        height: 170,
        dob: new Date("1995-01-01T00:00:00.000Z"),
        gender: "male",
        role: "admin",
      },
    });

    // Create a normal test user
    const user = await prisma.user.create({
      data: {
        username: "Normal User",
        email: "normaluser@example.com",
        password: "Test1234", // assuming hashing happens elsewhere
        weight: 65,
        height: 165,
        dob: new Date("2005-03-24T00:00:00.000Z"),
        gender: "female",
        role: "user",
      },
    });

    testUserId = user.id;

    // Login as admin
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "Adm!n025",
    });

    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: ["admin@gmail.com", "normaluser@example.com"] },
      },
    });
    await prisma.$disconnect();
  });

  it("should fetch all users with role 'user'", async () => {
    const res = await request(app)
      .get(route)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);

    res.body.users.forEach((user) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("weight");
      expect(user).toHaveProperty("height");
      expect(user).toHaveProperty("dob");
      expect(user).toHaveProperty("gender");
      expect(user).toHaveProperty("role", "user"); // Must be role "user"
    });
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).get(route);
    expect(res.statusCode).toBe(401); // Unauthorized because no token
  });
});
