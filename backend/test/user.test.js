const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

// describe("POST /calculate", () => {
//   const url = "/api/calculate";

//   const validPayload = {
//     height: 175,  // in cm
//     weight: 70,   // in kg
//     age: 25,
//     gender: "male",
//     activity: "moderately_active"
//   };

//   it("should return calculated nutrition data", async () => {
//     const res = await request(app).post(url).send(validPayload);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("maintainWeight");
//     expect(res.body).toHaveProperty("mildWeightLoss");
//     expect(res.body).toHaveProperty("weightLoss");
//     expect(res.body).toHaveProperty("extremeWeightLoss");
//     expect(res.body).toHaveProperty("macros");
//     expect(res.body.macros).toHaveProperty("protein");
//     expect(res.body.macros).toHaveProperty("fat");
//     expect(res.body.macros).toHaveProperty("carbs");
//   });

//   it("should return 400 if a required field is missing", async () => {
//     const { height, ...incompletePayload } = validPayload;

//     const res = await request(app).post(url).send(incompletePayload);

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("error", "Please enter all fields");
//   });

//   it("should return 400 if gender is invalid", async () => {
//     const res = await request(app)
//       .post(url)
//       .send({ ...validPayload, gender: "unknown" });

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("error", "Invalid gender. Use 'male' or 'female'.");
//   });

//   it("should return 400 if activity level is invalid", async () => {
//     const res = await request(app)
//       .post(url)
//       .send({ ...validPayload, activity: "lazy" });

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty(
//       "error",
//       "Invalid activity level. Use one of: sedentary, lightly_active, moderately_active, very_active, super_active."
//     );
//   });
// });


describe("POST /user/addFeedback", () => {
  const url = "/api/user/addFeedback";

  let token;
  const testUser = {
    email: "testuser@example.com",
    password: "testpassword123",
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      weight: "70",
      dob: "2005-03-24T00:00:00Z",
      height: "175",
      gender: "male",
      password: "testpassword123",
      confirmPassword: "testpassword123",
    });

    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    token = loginRes.body.token;
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (user) {
      await prisma.feedback.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { email: testUser.email } });
    }
    await prisma.$disconnect();
  });

  it("should submit feedback successfully", async () => {
    const res = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`)
      .send({
        feedback_type: "Bug Report",
        description: "There's a UI glitch on the profile screen.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Feedback submitted successfully.");
    expect(res.body.feedback).toHaveProperty("feedback_type", "Bug Report");
  });

  it("should return 400 if fields are missing", async () => {
    const res = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`)
      .send({ feedback_type: "" }); 

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "All fields are required.");
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app)
      .post(url)
      .send({
        feedback_type: "Bug Report",
        description: "This should fail due to missing token",
      });

    expect(res.statusCode).toBe(401); 
  });
});

