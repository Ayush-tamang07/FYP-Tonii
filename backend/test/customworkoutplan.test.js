const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");


describe("POST /api/user/workout-plans", () => {
    let token;
    let userId;
    const route = "/api/user/workout-plans";
  
    beforeAll(async () => {
      // Register and login a user to get a token
      await request(app).post("/api/auth/register").send({
        username: "workoutuser",
        email: "workout@example.com",
        password: "password123",
        confirmPassword: "password123",
        height: "170",
        weight: "70",
        dob: "2005-03-24T00:00:00Z",
        gender: "male",
      });
  
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "workout@example.com",
        password: "password123",
      });
  
      token = loginRes.body.token;
  
      const user = await prisma.user.findUnique({ where: { email: "workout@example.com" } });
      userId = user.id;
    });
  
    afterAll(async () => {
      await prisma.workoutPlan.deleteMany({ where: { assignedToUserId: userId } });
      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
    });
  
    it("should create workout plan successfully", async () => {
      const res = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "My Custom Plan" });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Workout plan created successfully.");
      expect(res.body.data).toHaveProperty("name", "My Custom Plan");
      expect(res.body.data).toHaveProperty("assignedToUserId", userId);
    });
  
    it("should return 400 if workout plan name is missing", async () => {
      const res = await request(app)
        .post(route)
        .set("Authorization", `Bearer ${token}`)
        .send({});
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Workout plan name is required.");
    });
  
    it("should return 401 if token is missing", async () => {
      const res = await request(app)
        .post(route)
        .send({ name: "Unauthorized Plan" });
  
      expect(res.statusCode).toBe(401); // or 403 depending on your middleware
    });
  });
  
  describe("GET /api/user/workout-plans", () => {
    let token;
    let userId;
    const route = "/api/user/workout-plans";
  
    beforeAll(async () => {
      // Register & login a user
      await request(app).post("/api/auth/register").send({
        username: "planuser",
        email: "plan@example.com",
        password: "password123",
        confirmPassword: "password123",
        height: "170",
        weight: "70",
        dob: "2005-03-24T00:00:00Z",
        gender: "male",
      });
  
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "plan@example.com",
        password: "password123",
      });
  
      token = loginRes.body.token;
  
      const user = await prisma.user.findUnique({ where: { email: "plan@example.com" } });
      userId = user.id;
  
      // Create a workout plan for test user
      await prisma.workoutPlan.create({
        data: {
          name: "Test Workout Plan",
          createdByAdmin: false,
          assignedToUserId: userId,
        },
      });
    });
  
    afterAll(async () => {
      await prisma.workoutPlan.deleteMany({ where: { assignedToUserId: userId } });
      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
    });
  
    it("should return workout plans for authenticated user", async () => {
      const res = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("count");
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty("name", "Test Workout Plan");
    });
  
    it("should return 404 if user has no workout plans", async () => {
      // Create a new user with no plans
      const newEmail = "noplan@example.com";
  
      await request(app).post("/api/auth/register").send({
        username: "noplan",
        email: newEmail,
        password: "test123",
        confirmPassword: "test123",
        height: "170",
        weight: "70",
        dob: "2005-03-24T00:00:00Z",
        gender: "male",
      });
  
      const loginRes = await request(app).post("/api/auth/login").send({
        email: newEmail,
        password: "test123",
      });
  
      const noPlanToken = loginRes.body.token;
  
      const res = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${noPlanToken}`);
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "No workout plans found for this user.");
    });
  
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get(route);
  
      expect(res.statusCode).toBe(401); // or 403 depending on your authMiddleware
    });
  });
  
  describe("GET /api/user/workout-plan/:planId/exercises", () => {
    let token;
    let userId;
    let workoutPlanId;
    const routeBase = "/api/user/workout-plan";
  
    beforeAll(async () => {
      // Register and login user
      await request(app).post("/api/auth/register").send({
        username: "exerciseUser",
        email: "exerciseuser@example.com",
        password: "testpass123",
        confirmPassword: "testpass123",
        height: "175",
        weight: "70",
        dob: "2005-03-24T00:00:00Z",
        gender: "male",
      });
  
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "exerciseuser@example.com",
        password: "testpass123",
      });
  
      token = loginRes.body.token;
  
      const user = await prisma.user.findUnique({
        where: { email: "exerciseuser@example.com" },
      });
  
      userId = user.id;
  
      // Create exercise
      const exercise = await prisma.exercise.create({
        data: {
          name: "Push Up",
          type: "strength",
          muscle: "chest",
          equipment: "bodyweight",
          difficulty: "beginner",
          instructions: "Do a push up!",
          category: "Chest",
          videoUrl: "http://example.com/pushup",
        },
      });
  
      // Create workout plan
      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          name: "Beginner Plan",
          createdByAdmin: false,
          assignedToUserId: userId,
        },
      });
  
      workoutPlanId = workoutPlan.id;
  
      // Link exercise to plan
      await prisma.workoutPlanExercise.create({
        data: {
          workoutPlanId,
          exerciseId: exercise.id,
        },
      });
    });
  
    afterAll(async () => {
      await prisma.workoutPlanExercise.deleteMany({ where: { workoutPlanId } });
      await prisma.workoutPlan.deleteMany({ where: { assignedToUserId: userId } });
      await prisma.exercise.deleteMany({ where: { name: "Push Up" } });
      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
    });
  
    it("should return exercises for the given workout plan", async () => {
      const res = await request(app)
        .get(`${routeBase}/${workoutPlanId}/exercises`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("workoutPlanId", workoutPlanId);
      expect(res.body).toHaveProperty("workoutPlanName", "Beginner Plan");
      expect(Array.isArray(res.body.exercises)).toBe(true);
      expect(res.body.exercises.length).toBeGreaterThan(0);
      expect(res.body.exercises[0]).toHaveProperty("exercise");
    });
  
    it("should return 404 if workout plan not found or doesn't belong to user", async () => {
      const res = await request(app)
        .get(`${routeBase}/999999/exercises`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty(
        "message",
        "Workout plan not found or does not belong to user."
      );
    });
  
    it("should return 400 if invalid workout plan ID", async () => {
      const res = await request(app)
        .get(`${routeBase}/invalid_id/exercises`)
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid user ID or workout plan ID.");
    });
  
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get(`${routeBase}/${workoutPlanId}/exercises`);
  
      expect(res.statusCode).toBe(401); // or 403 depending on your auth middleware
    });
  });