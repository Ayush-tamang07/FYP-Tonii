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
