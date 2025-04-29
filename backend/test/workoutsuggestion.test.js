// const request = require("supertest");
// const app = require("../index.js");
// const prisma = require("../utils/PrismaClient.js");
// const axios = require("axios");


// jest.mock("axios"); // mock axios

// describe("POST /api/suggestion", () => {
//   const route = "/api/suggestion";

//   const mockPayload = {
//     user_details: {
//       age: 25,
//       height: 170,
//       weight: 70,
//       gender: "male",
//     },
//     user_preferences: {
//       goal: "muscle gain",
//       equipment: "dumbbell",
//       experience: "beginner",
//       muscle: "chest"
//     }
//   };

//   const mockResponse = {
//     suggestions: [
//       { name: "Incline Dumbbell Press", muscle: "chest", equipment: "dumbbell", difficulty: "intermediate" },
//       { name: "Flat Bench Press", muscle: "chest", equipment: "barbell", difficulty: "beginner" },
//     ]
//   };

//   it("should return suggestions successfully", async () => {
//     axios.post.mockResolvedValueOnce({ data: mockResponse });

//     const res = await request(app)
//       .post(route)
//       .send(mockPayload);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("suggestions");
//     expect(Array.isArray(res.body.suggestions)).toBe(true);
//     expect(res.body.suggestions.length).toBeGreaterThan(0);
//     expect(res.body.suggestions[0]).toHaveProperty("name");
//   });

//   it("should return 400 if user_details or user_preferences is missing", async () => {
//     const res = await request(app).post(route).send({});
//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("error", "User details and preferences are required");
//   });

//   it("should return 500 if axios throws an error", async () => {
//     axios.post.mockRejectedValueOnce(new Error("Flask server not reachable"));

//     const res = await request(app).post(route).send(mockPayload);

//     // You should modify your controller to return status 500 on catch
//     expect(res.statusCode).toBe(500); // Assuming you fix the controller
//     expect(res.body).toHaveProperty("error", "Failed to fetch suggestions");
//   });
// });