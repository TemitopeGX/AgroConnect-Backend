const request = require("supertest");
const admin = require("firebase-admin");
const db = require("../lib/db");
const app = require("./setup");

describe("Produce Endpoints", () => {
  describe("POST /api/produce/create", () => {
    it("should allow farmer to create produce", async () => {
      const mockProduce = {
        name: "Yam",
        quantity: 50,
        unit: "bags",
        price: 5000,
      };

      global.mockTokens.currentUser = mockTokens.farmer;
      db.query.mockResolvedValueOnce({
        rows: [{ ...mockProduce, id: 1, uid: mockTokens.farmer.uid }],
      });

      const response = await request(app)
        .post("/api/produce/create")
        .set("Authorization", "Bearer valid-token")
        .send(mockProduce);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(mockProduce);
    });

    it("should reject produce creation by buyer", async () => {
      global.mockTokens.currentUser = mockTokens.buyer;

      const response = await request(app)
        .post("/api/produce/create")
        .set("Authorization", "Bearer valid-token")
        .send({
          name: "Yam",
          quantity: 50,
          unit: "bags",
          price: 5000,
        });

      expect(response.status).toBe(403);
    });

    it("should validate required fields", async () => {
      global.mockTokens.currentUser = mockTokens.farmer;

      const response = await request(app)
        .post("/api/produce/create")
        .set("Authorization", "Bearer valid-token")
        .send({
          name: "Yam",
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/produce/list", () => {
    it("should list available produce", async () => {
      const mockProduce = [
        {
          id: 1,
          name: "Yam",
          quantity: 50,
          unit: "bags",
          price: 5000,
          farmer_email: "farmer@test.com",
        },
      ];

      db.query.mockResolvedValueOnce({ rows: mockProduce });

      const response = await request(app).get("/api/produce/list");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 1,
        name: "Yam",
        quantity: 50,
        unit: "bags",
        price: 5000,
        farmer: {
          email: "farmer@test.com",
        },
      });
    });

    it("should handle empty produce list", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get("/api/produce/list");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});
