const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

// describe("POST /api/reminders", () => {
//     let token;
//     let userId;
//     const route = "/api/reminders";
  
//     beforeAll(async () => {
//       await request(app).post("/api/auth/register").send({
//         username: "reminderUser",
//         email: "reminder@example.com",
//         password: "test1234",
//         confirmPassword: "test1234",
//         height: "175",
//         weight: "70",
//         dob: "2005-03-24T00:00:00Z",
//         gender: "male",
//       });
  
//       const loginRes = await request(app).post("/api/auth/login").send({
//         email: "reminder@example.com",
//         password: "test1234",
//       });
  
//       token = loginRes.body.token;
  
//       const user = await prisma.user.findUnique({
//         where: { email: "reminder@example.com" },
//       });
  
//       userId = user.id;
//     });
  
//     afterAll(async () => {
//       await prisma.notification.deleteMany({ where: { userId } });
//       await prisma.user.delete({ where: { id: userId } });
//       await prisma.$disconnect();
//     });
  
//     it("should create a reminder successfully", async () => {
//       const scheduledTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); 
  
//       const res = await request(app)
//         .post(route)
//         .set("Authorization", `Bearer ${token}`)
//         .send({ scheduledAt: scheduledTime });
  
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty("message", "Reminder created");
//       expect(res.body.reminder).toHaveProperty("userId", userId);
//       expect(res.body.reminder).toHaveProperty("scheduledAt");
//       expect(res.body.reminder).toHaveProperty("isSent", false);
//     });
  
//     it("should return 400 if scheduledAt is missing", async () => {
//       const res = await request(app)
//         .post(route)
//         .set("Authorization", `Bearer ${token}`)
//         .send({}); 
  
//       expect(res.statusCode).toBe(400);
//       expect(res.body).toHaveProperty("message", "All fields are required");
//     });
  
//     it("should return 401 if token is not provided", async () => {
//       const res = await request(app).post(route).send({
//         scheduledAt: new Date().toISOString(),
//       });
  
//       expect(res.statusCode).toBe(401); 
//     });
//   });



  
  describe("GET /api/getReminders", () => {
    let token;
    let userId;
    const route = "/api/getReminders";
  
    beforeAll(async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        email: "test@gmail.com",
        password: "Aa", 
      });
  
      token = loginRes.body.token;
  
      const user = await prisma.user.findUnique({ where: { email: "test@gmail.com" } });
      userId = user.id;
  
      await prisma.notification.createMany({
        data: [
          {
            userId,
            message: "Time to workout!",
            scheduledAt: new Date(Date.now() + 60 * 60 * 1000), // +1hr
          },
          {
            userId,
            message: "Stretch and hydrate",
            scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2hr
          },
        ],
      });
    });
  
    afterAll(async () => {
      await prisma.notification.deleteMany({ where: { userId } });
      await prisma.$disconnect();
    });
  
    it("should fetch all reminders for authenticated user", async () => {
      const res = await request(app)
        .get(route)
        .set("Authorization", `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Reminders fetched");
      expect(Array.isArray(res.body.reminders)).toBe(true);
      expect(res.body.reminders.length).toBeGreaterThanOrEqual(2);
  
      res.body.reminders.forEach((reminder) => {
        expect(reminder).toHaveProperty("userId", userId);
        expect(reminder).toHaveProperty("message");
        expect(reminder).toHaveProperty("scheduledAt");
      });
    });
  
    it("should return 401 if token is missing", async () => {
      const res = await request(app).get(route);
  
      expect(res.statusCode).toBe(401); 
      expect(res.body).toHaveProperty("error", "Access Denied");
    });
  });
  