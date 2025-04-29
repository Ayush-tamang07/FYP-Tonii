const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

describe("GET /api/user/getProgress", () => {
  let token;
  let userId;
  const route = "/api/user/getProgress";

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "Aa",
    });

    token = loginRes.body.token;

    const user = await prisma.user.findUnique({
      where: { email: "test@gmail.com" },
    });

    userId = user.id;

    const plan = await prisma.workoutPlan.create({
      data: {
        name: "Progress Plan",
        createdByAdmin: false,
        assignedToUserId: userId,
      },
    });

    await prisma.workoutProgress.createMany({
      data: [
        {
          userId,
          workoutPlanId: plan.id,
          completedAt: new Date(),
        },
        {
          userId,
          workoutPlanId: plan.id,
          completedAt: new Date(Date.now() - 86400000), // 1 day ago
        },
      ],
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.workoutProgress.deleteMany({ where: { userId } });
    await prisma.workoutPlan.deleteMany({ where: { assignedToUserId: userId } });
    await prisma.$disconnect();
  });

  it("should fetch workout progress for logged-in user", async () => {
    const res = await request(app)
      .get(route)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.progress)).toBe(true);
    res.body.progress.forEach((entry) => {
      expect(entry).toHaveProperty("completedAt");
    });
  });
});
