const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

// describe("POST /api/user/workout-plans", () => {
//   let token;
//   let userId;
//   const route = "/api/user/workout-plans";

//   beforeAll(async () => {
//     await request(app).post("/api/auth/register").send({
//       username: "workoutuser",
//       email: "workout@example.com",
//       password: "password123",
//       confirmPassword: "password123",
//       height: "170",
//       weight: "70",
//       dob: "2005-03-24T00:00:00Z",
//       gender: "male",
//     });

//     const loginRes = await request(app).post("/api/auth/login").send({
//       email: "workout@example.com",
//       password: "password123",
//     });

//     token = loginRes.body.token;

//     const user = await prisma.user.findUnique({
//       where: { email: "workout@example.com" },
//     });
//     userId = user.id;
//   });

//   afterAll(async () => {
//     await prisma.workoutPlan.deleteMany({
//       where: { assignedToUserId: userId },
//     });
//     await prisma.user.delete({ where: { id: userId } });
//     await prisma.$disconnect();
//   });

//   it("should create workout plan successfully", async () => {
//     const res = await request(app)
//       .post(route)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ name: "My Custom Plan" });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body).toHaveProperty(
//       "message",
//       "Workout plan created successfully."
//     );
//     expect(res.body.data).toHaveProperty("name", "My Custom Plan");
//     expect(res.body.data).toHaveProperty("assignedToUserId", userId);
//   });

//   it("should return 400 if workout plan name is missing", async () => {
//     const res = await request(app)
//       .post(route)
//       .set("Authorization", `Bearer ${token}`)
//       .send({});

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty(
//       "message",
//       "Workout plan name is required."
//     );
//   });

//   it("should return 401 if token is missing", async () => {
//     const res = await request(app)
//       .post(route)
//       .send({ name: "Unauthorized Plan" });

//     expect(res.statusCode).toBe(401);
//   });
// });

// describe("GET /api/user/workout-plans", () => {
//   let token;
//   let userId;
//   const route = "/api/user/workout-plans";

//   beforeAll(async () => {
//     await request(app).post("/api/auth/register").send({
//       username: "planuser",
//       email: "plan@example.com",
//       password: "password123",
//       confirmPassword: "password123",
//       height: "170",
//       weight: "70",
//       dob: "2005-03-24T00:00:00Z",
//       gender: "male",
//     });

//     const loginRes = await request(app).post("/api/auth/login").send({
//       email: "plan@example.com",
//       password: "password123",
//     });

//     token = loginRes.body.token;

//     const user = await prisma.user.findUnique({
//       where: { email: "plan@example.com" },
//     });
//     userId = user.id;

//     await prisma.workoutPlan.create({
//       data: {
//         name: "Test Workout Plan",
//         createdByAdmin: false,
//         assignedToUserId: userId,
//       },
//     });
//   });

//   afterAll(async () => {
//     await prisma.workoutPlan.deleteMany({
//       where: { assignedToUserId: userId },
//     });
//     await prisma.user.delete({ where: { id: userId } });
//     await prisma.$disconnect();
//   });

//   it("should return workout plans for authenticated user", async () => {
//     const res = await request(app)
//       .get(route)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body).toHaveProperty("count");
//     expect(res.body.data.length).toBeGreaterThan(0);
//     expect(res.body.data[0]).toHaveProperty("name", "Test Workout Plan");
//   });

//   it("should return 404 if user has no workout plans", async () => {
//     const newEmail = "noplan@example.com";

//     await request(app).post("/api/auth/register").send({
//       username: "noplan",
//       email: newEmail,
//       password: "test123",
//       confirmPassword: "test123",
//       height: "170",
//       weight: "70",
//       dob: "2005-03-24T00:00:00Z",
//       gender: "male",
//     });

//     const loginRes = await request(app).post("/api/auth/login").send({
//       email: newEmail,
//       password: "test123",
//     });

//     const noPlanToken = loginRes.body.token;

//     const res = await request(app)
//       .get(route)
//       .set("Authorization", `Bearer ${noPlanToken}`);

//     expect(res.statusCode).toBe(404);
//     expect(res.body).toHaveProperty(
//       "message",
//       "No workout plans found for this user."
//     );
//   });

//   it("should return 401 if no token is provided", async () => {
//     const res = await request(app).get(route);

//     expect(res.statusCode).toBe(401);
//   });
// });

// describe("GET /api/user/workout-plan/:planId/exercises", () => {
//   let token;
//   let userId;
//   let workoutPlanId;
//   const routeBase = "/api/user/workout-plan";

//   beforeAll(async () => {
//     await request(app).post("/api/auth/register").send({
//       username: "exerciseUser",
//       email: "exerciseuser@example.com",
//       password: "testpass123",
//       confirmPassword: "testpass123",
//       height: "175",
//       weight: "70",
//       dob: "2005-03-24T00:00:00Z",
//       gender: "male",
//     });

//     const loginRes = await request(app).post("/api/auth/login").send({
//       email: "exerciseuser@example.com",
//       password: "testpass123",
//     });

//     token = loginRes.body.token;

//     const user = await prisma.user.findUnique({
//       where: { email: "exerciseuser@example.com" },
//     });

//     userId = user.id;

//     const exercise = await prisma.exercise.create({
//       data: {
//         name: "Push Up",
//         type: "strength",
//         muscle: "chest",
//         equipment: "bodyweight",
//         difficulty: "beginner",
//         instructions: "Do a push up-!",
//         category: "Chest",
//         videoUrl: "http://example.com/pushup",
//       },
//     });

//     const workoutPlan = await prisma.workoutPlan.create({
//       data: {
//         name: "Beginner Plan",
//         createdByAdmin: false,
//         assignedToUserId: userId,
//       },
//     });

//     workoutPlanId = workoutPlan.id;

//     await prisma.workoutPlanExercise.create({
//       data: {
//         workoutPlanId,
//         exerciseId: exercise.id,
//       },
//     });
//   });

//   afterAll(async () => {
//     await prisma.workoutPlanExercise.deleteMany({ where: { workoutPlanId } });
//     await prisma.workoutPlan.deleteMany({
//       where: { assignedToUserId: userId },
//     });
//     await prisma.exercise.deleteMany({ where: { name: "Push Up" } });
//     await prisma.user.delete({ where: { id: userId } });
//     await prisma.$disconnect();
//   });

//   it("should return exercises for the given workout plan", async () => {
//     const res = await request(app)
//       .get(`${routeBase}/${workoutPlanId}/exercises`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body).toHaveProperty("workoutPlanId", workoutPlanId);
//     expect(res.body).toHaveProperty("workoutPlanName", "Beginner Plan");
//     expect(Array.isArray(res.body.exercises)).toBe(true);
//     expect(res.body.exercises.length).toBeGreaterThan(0);
//     expect(res.body.exercises[0]).toHaveProperty("exercise");
//   });

//   it("should return 404 if workout plan not found or doesn't belong to user", async () => {
//     const res = await request(app)
//       .get(`${routeBase}/999999/exercises`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(404);
//     expect(res.body).toHaveProperty(
//       "message",
//       "Workout plan not found or does not belong to user."
//     );
//   });

//   it("should return 400 if invalid workout plan ID", async () => {
//     const res = await request(app)
//       .get(`${routeBase}/invalid_id/exercises`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty(
//       "message",
//       "Invalid user ID or workout plan ID."
//     );
//   });

//   it("should return 401 if no token is provided", async () => {
//     const res = await request(app).get(
//       `${routeBase}/${workoutPlanId}/exercises`
//     );

//     expect(res.statusCode).toBe(401);
//   });
// });

// describe("DELETE /api/workout-plans/:workoutPlanId", () => {
//   let token;
//   let userId;
//   let workoutPlanId;
//   const routeBase = "/api/workout-plans";

//   beforeAll(async () => {
//     const loginRes = await request(app).post("/api/auth/login").send({
//       email: "kiran@gmail.com",
//       password: "123",
//     });

//     token = loginRes.body.token;
//     const user = await prisma.user.findUnique({
//       where: { email: "kiran@gmail.com" },
//     });
//     userId = user.id;

//     const workoutPlan = await prisma.workoutPlan.create({
//       data: {
//         name: "Delete Test Plan",
//         createdByAdmin: false,
//         assignedToUserId: userId,
//       },
//     });

//     workoutPlanId = workoutPlan.id;
//   });

//   afterAll(async () => {
//     await prisma.workoutPlan.deleteMany({
//       where: { assignedToUserId: userId },
//     });
//     await prisma.$disconnect();
//   });

//   it("should delete the user's workout plan successfully", async () => {
//     const res = await request(app)
//       .delete(`${routeBase}/${workoutPlanId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty(
//       "message",
//       "Workout Plan deleted successfully."
//     );
//   });

//   it("should return 404 if the workout plan does not exist", async () => {
//     const res = await request(app)
//       .delete(`${routeBase}/99999`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(404);
//     expect(res.body).toHaveProperty("message", "Workout Plan not found.");
//   });

//   it("should return 403 if user tries to delete another user's plan", async () => {
//     const newUser = await prisma.user.create({
//       data: {
//         username: "OtherUser",
//         email: "other@example.com",
//         password: "secret123",
//         height: 170,
//         weight: 60,
//         dob: new Date("2000-01-01"),
//         gender: "male",
//       },
//     });

//     const otherPlan = await prisma.workoutPlan.create({
//       data: {
//         name: "Other User's Plan",
//         createdByAdmin: false,
//         assignedToUserId: newUser.id,
//       },
//     });

//     const res = await request(app)
//       .delete(`${routeBase}/${otherPlan.id}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(403);
//     expect(res.body).toHaveProperty(
//       "message",
//       "You can only delete your own workout plans."
//     );

//     await prisma.workoutPlan.delete({ where: { id: otherPlan.id } });
//     await prisma.user.delete({ where: { id: newUser.id } });
//   });

//   it("should return 400 if the workoutPlanId is invalid", async () => {
//     const res = await request(app)
//       .delete(`${routeBase}/invalidId`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("message", "Invalid Workout Plan ID.");
//   });

//   it("should return 401 if no token is provided", async () => {
//     const res = await request(app).delete(`${routeBase}/${workoutPlanId}`);
//     expect(res.statusCode).toBe(401);
//   });
// });

// describe('GET /api/exercise', () => {

//  })
// describe("GET /api/exercise", () => {
//   let exerciseId;

//   beforeAll(async () => {
//     const exercise = await prisma.exercise.create({
//       data: {
//         name: "Dumbbell Chest Press",
//         type: "strength",
//         muscle: "chest",
//         equipment: "dumbbell",
//         difficulty: "intermediate",
//         instructions: "Push dumbbells upward from chest level",
//         category: "chest",  
//         videoUrl: "https://example.com/dumbbell-chest-press",
//       },
//     });

//     exerciseId = exercise.id;
//   });

//   afterAll(async () => {
//     await prisma.exercise.deleteMany({
//       where: { id: exerciseId },
//     });
//   });

//   it("should fetch all exercises when no filters are provided", async () => {
//     const res = await request(app).get("/api/exercise");

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//     expect(res.body.count).toBeGreaterThan(0);
//   });

//   it("should filter exercises by equipment", async () => {
//     const res = await request(app)
//       .get("/api/exercise")
//       .query({ equipment: "dumbbell" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//     res.body.data.forEach((exercise) => {
//       expect(exercise.equipment.toLowerCase()).toBe("dumbbell");
//     });
//   });

//   it("should filter exercises by category", async () => {
//     const res = await request(app)
//       .get("/api/exercise")
//       .query({ category: "chest" }); 
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     res.body.data.forEach((exercise) => {
//       expect(exercise.category.toLowerCase()).toBe("chest");
//     });
//   });

//   it("should return 404 if no matching exercises", async () => {
//     const res = await request(app)
//       .get("/api/exercise")
//       .query({ equipment: "invalidEquipment" });

//     expect(res.statusCode).toBe(404);
//     expect(res.body.success).toBe(false);
//     expect(res.body.message).toBe(
//       "No exercises found matching the given criteria."
//     );
//   });
// });

describe("PUT /api/user/workout-plan/:id/exercises", () => {
  let token;
  let userId;
  let workoutPlanId;
  let exerciseId1, exerciseId2;

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "Aa",
    });

    token = loginRes.body.token;
    const user = await prisma.user.findUnique({ where: { email: "test@gmail.com" } });
    userId = user.id;

    const exercise1 = await prisma.exercise.create({
      data: {
        name: "Push Up",
        type: "strength",
        muscle: "chest",
        equipment: "bodyweight",
        difficulty: "beginner",
        category: "Chest",
        instructions: "Push body up and down",
        videoUrl: "https://example.com/pushup",
      },
    });

    const exercise2 = await prisma.exercise.create({
      data: {
        name: "Pull Up",
        type: "strength",
        muscle: "back",
        equipment: "bodyweight",
        difficulty: "intermediate",
        category: "Back",
        instructions: "Pull body upward to bar",
        videoUrl: "https://example.com/pullup",
      },
    });

    exerciseId1 = exercise1.id;
    exerciseId2 = exercise2.id;

    const plan = await prisma.workoutPlan.create({
      data: {
        name: "Test Workout Plan",
        createdByAdmin: false,
        assignedToUserId: userId,
      },
    });

    workoutPlanId = plan.id;
  });

  afterAll(async () => {
    await prisma.workoutPlanExercise.deleteMany({ where: { workoutPlanId } });
    await prisma.exercise.deleteMany({ where: { id: { in: [exerciseId1, exerciseId2] } } });
    await prisma.workoutPlan.delete({ where: { id: workoutPlanId } });
    await prisma.$disconnect();
  });

  it("should add exercises to the workout plan", async () => {
    const res = await request(app)
      .put(`/api/user/workout-plan/${workoutPlanId}/exercises`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        add: [exerciseId1, exerciseId2],
        remove: [],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Workout plan updated successfully.");
  });

  it("should remove an exercise from the workout plan", async () => {
    const res = await request(app)
      .put(`/api/user/workout-plan/${workoutPlanId}/exercises`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        add: [],
        remove: [exerciseId1],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Workout plan updated successfully.");
  });

  it("should return 404 if workout plan does not exist", async () => {
    const res = await request(app)
      .put("/api/user/workout-plan/9999999/exercises")
      .set("Authorization", `Bearer ${token}`)
      .send({
        add: [exerciseId1],
        remove: [],
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Workout plan not found or not authorized.");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .put(`/api/user/workout-plan/${workoutPlanId}/exercises`)
      .send({
        add: [exerciseId2],
        remove: [],
      });

    expect(res.statusCode).toBe(401); 
  });
});