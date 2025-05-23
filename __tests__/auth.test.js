const request = require("supertest");
const admin = require("firebase-admin");
const db = require("../lib/db");
const app = require("./setup");

describe("Auth Endpoints", () => {
  describe("POST /api/auth/check-user", () => {
    it("should check if a user exists", async () => {
      const mockUser = {
        uid: "test123",
        email: "test@test.com",
        role: "farmer",
      };
      global.mockTokens.currentUser = mockTokens.farmer;
      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .post("/api/auth/check-user")
        .set("Authorization", "Bearer valid-token")
        .send({ uid: "test123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 404 for non-existent user", async () => {
      global.mockTokens.currentUser = mockTokens.farmer;
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post("/api/auth/check-user")
        .set("Authorization", "Bearer valid-token")
        .send({ uid: "nonexistent" });

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/auth/create-user", () => {
    it("should create a new user", async () => {
      const newUser = {
        uid: "new123",
        email: "new@test.com",
        role: "farmer",
      };

      db.query
        .mockResolvedValueOnce({ rows: [] }) // User doesn't exist check
        .mockResolvedValueOnce({ rows: [newUser] }); // Insert new user

      const response = await request(app)
        .post("/api/auth/create-user")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(newUser);
      expect(global.mocks.setCustomUserClaims).toHaveBeenCalledWith(
        newUser.uid,
        { role: newUser.role }
      );
    });

    it("should reject invalid role", async () => {
      const response = await request(app).post("/api/auth/create-user").send({
        uid: "test123",
        email: "test@test.com",
        role: "invalid",
      });

      expect(response.status).toBe(400);
    });

    it("should prevent duplicate users", async () => {
      db.query.mockResolvedValueOnce({ rows: [{ uid: "existing123" }] });

      const response = await request(app).post("/api/auth/create-user").send({
        uid: "existing123",
        email: "test@test.com",
        role: "farmer",
      });

      expect(response.status).toBe(409);
    });
  });
});
