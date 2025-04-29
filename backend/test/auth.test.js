const request = require("supertest");
const app = require("../index.js");
const prisma = require("../utils/PrismaClient.js");

describe('POST /user/login', () => {

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

  it('should return 401 for incorrect password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'wrongpassword'
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Incorrect Password');
  });

  it('should return 404 for non-existent email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'noUser@gmail.com',
      password: '123'
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'User does not exist');
  });

  it('should return 400 when email and password are missing', async () => {
    const response = await request(app).post('/api/auth/login').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app).post('/api/auth/login').send({
      password: '123'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });

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
    weight: 70,
    dob: "2005-03-24T00:00:00Z",
    height:175,
    gender: "male",
    password: "testpassword123",
    confirmPassword: "testpassword123",
  };

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
    await request(app).post("/api/auth/register").send(testUser);
    const response = await request(app).post("/api/auth/register").send(testUser);

    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("error", "Email already exists.");
  });
});