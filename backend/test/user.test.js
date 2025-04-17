const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

describe('POST /user/login', () => {

  // ✅ Test with correct credentials
  it('should return 200, token, and role for valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'Aa'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('role');
  });

  // ❌ Incorrect password
  it('should return 401 for incorrect password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'wrongpassword'
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Incorrect Password');
  });

  // ❌ Non-existent user
  it('should return 404 for non-existent email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'noUser@gmail.com',
      password: '123'
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'User does not exist');
  });

  // ❌ Missing email and password
  it('should return 400 when email and password are missing', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });

  // ❌ Missing email
  it('should return 400 when email is missing', async () => {
    const response = await request(app).post('/api/auth/login').send({
      password: '123'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });

  // ❌ Missing password
  it('should return 400 when password is missing', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });
});

describe("POST /api/auth/register", () => {
  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    weight: "70",
    dob: "2005-03-24T00:00:00Z",
    height: "175",
    gender: "male",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

  // Cleanup after test
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe(testUser.email);
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "incomplete@example.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required.");
  });

  it("should fail if passwords do not match", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...testUser, confirmPassword: "differentPassword" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Passwords do not match.");
  });

  it("should fail if email already exists", async () => {
    // Register once
    await request(app).post("/api/auth/register").send(testUser);
    // Try registering again with same email
    const response = await request(app).post("/api/auth/register").send(testUser);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("error", "Email already exists.");
  });
});

describe("POST /calculate", () => {
  const url = "/api/calculate";

  const validPayload = {
    height: 175,  // in cm
    weight: 70,   // in kg
    age: 25,
    gender: "male",
    activity: "moderately_active"
  };

  it("should return calculated nutrition data", async () => {
    const res = await request(app).post(url).send(validPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("maintainWeight");
    expect(res.body).toHaveProperty("mildWeightLoss");
    expect(res.body).toHaveProperty("weightLoss");
    expect(res.body).toHaveProperty("extremeWeightLoss");
    expect(res.body).toHaveProperty("macros");
    expect(res.body.macros).toHaveProperty("protein");
    expect(res.body.macros).toHaveProperty("fat");
    expect(res.body.macros).toHaveProperty("carbs");
  });

  it("should return 400 if a required field is missing", async () => {
    const { height, ...incompletePayload } = validPayload;

    const res = await request(app).post(url).send(incompletePayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Please enter all fields");
  });

  it("should return 400 if gender is invalid", async () => {
    const res = await request(app)
      .post(url)
      .send({ ...validPayload, gender: "unknown" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid gender. Use 'male' or 'female'.");
  });

  it("should return 400 if activity level is invalid", async () => {
    const res = await request(app)
      .post(url)
      .send({ ...validPayload, activity: "lazy" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Invalid activity level. Use one of: sedentary, lightly_active, moderately_active, very_active, super_active."
    );
  });
});


describe("POST /user/addFeedback", () => {
  const url = "/api/user/addFeedback";

  // Mock token and test user data
  let token;
  const testUser = {
    email: "testuser@example.com",
    password: "testpassword123",
  };

  // Register + Login a user to get a valid token
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

  // Cleanup feedbacks created by the test
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
      .send({ feedback_type: "" }); // Missing description

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

    expect(res.statusCode).toBe(401); // or 403 depending on your middleware
  });
});

