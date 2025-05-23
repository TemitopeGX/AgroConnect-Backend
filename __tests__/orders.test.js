const request = require("supertest");
const admin = require("firebase-admin");
const db = require("../lib/db");
const app = require("./setup");

describe("Order Endpoints", () => {
  describe("POST /api/orders/place", () => {
    it("should allow buyer to place order", async () => {
      const mockOrder = {
        produce_id: 1,
        quantity: 5,
      };

      const mockProduce = {
        id: 1,
        quantity: 10,
        price: 5000,
      };

      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };

      // Mock transaction queries
      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce({ rows: [mockProduce] }) // Select produce
        .mockResolvedValueOnce({ rows: [{ id: 1, ...mockOrder }] }) // Insert order
        .mockResolvedValueOnce() // Update produce
        .mockResolvedValueOnce(); // COMMIT

      db.pool.connect.mockResolvedValueOnce(mockClient);
      global.mockTokens.currentUser = mockTokens.buyer;

      const response = await request(app)
        .post("/api/orders/place")
        .set("Authorization", "Bearer valid-token")
        .send(mockOrder);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: 1,
        ...mockOrder,
      });
    });

    it("should reject order with insufficient quantity", async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce({ rows: [] }); // No produce found with sufficient quantity

      db.pool.connect.mockResolvedValueOnce(mockClient);
      global.mockTokens.currentUser = mockTokens.buyer;

      const response = await request(app)
        .post("/api/orders/place")
        .set("Authorization", "Bearer valid-token")
        .send({
          produce_id: 1,
          quantity: 100,
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/orders/my-orders", () => {
    it("should show buyer their orders", async () => {
      const mockOrders = [
        {
          id: 1,
          produce_name: "Yam",
          quantity: 5,
          unit: "bags",
          farmer_email: "farmer@test.com",
        },
      ];

      global.mockTokens.currentUser = mockTokens.buyer;
      db.query.mockResolvedValueOnce({ rows: mockOrders });

      const response = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });

    it("should show farmer their received orders", async () => {
      const mockOrders = [
        {
          id: 1,
          produce_name: "Yam",
          quantity: 5,
          unit: "bags",
          buyer_email: "buyer@test.com",
        },
      ];

      global.mockTokens.currentUser = mockTokens.farmer;
      db.query.mockResolvedValueOnce({ rows: mockOrders });

      const response = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });

    it("should reject unauthorized role", async () => {
      global.mockTokens.currentUser = {
        uid: "test123",
        role: "unauthorized",
      };

      const response = await request(app)
        .get("/api/orders/my-orders")
        .set("Authorization", "Bearer valid-token");

      expect(response.status).toBe(403);
    });
  });
});
