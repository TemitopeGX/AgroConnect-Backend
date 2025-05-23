const express = require("express");
const app = express();

// Mock Firebase Admin
const mockSetCustomUserClaims = jest.fn();
jest.mock("firebase-admin", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockImplementation(async (token) => {
      if (token === "valid-token") {
        return global.mockTokens.currentUser;
      }
      throw new Error("Invalid token");
    }),
    setCustomUserClaims: mockSetCustomUserClaims,
  }),
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
}));

// Export mocks for tests
global.mocks = {
  setCustomUserClaims: mockSetCustomUserClaims,
};

// Mock Database
jest.mock("../lib/db", () => ({
  query: jest.fn(),
  pool: {
    connect: jest.fn(() => ({
      query: jest.fn(),
      release: jest.fn(),
    })),
  },
}));

// Test tokens
global.mockTokens = {
  farmer: { uid: "farmer123", role: "farmer", email: "farmer@test.com" },
  buyer: { uid: "buyer123", role: "buyer", email: "buyer@test.com" },
  admin: { uid: "admin123", role: "admin", email: "admin@test.com" },
  currentUser: null, // Will be set in tests
};

// Middleware to mock user object
app.use((req, res, next) => {
  if (req.headers.authorization === "Bearer valid-token") {
    req.user = global.mockTokens.currentUser;
  }
  next();
});

// Middleware
app.use(express.json());

// Import routes
const checkUserRoute = require("../api/auth/check-user");
const createUserRoute = require("../api/auth/create-user");
const createProduceRoute = require("../api/produce/create");
const listProduceRoute = require("../api/produce/list");
const placeOrderRoute = require("../api/orders/place");
const myOrdersRoute = require("../api/orders/my-orders");

// Mount routes
app.post("/api/auth/check-user", checkUserRoute);
app.post("/api/auth/create-user", createUserRoute);
app.post("/api/produce/create", createProduceRoute);
app.get("/api/produce/list", listProduceRoute);
app.post("/api/orders/place", placeOrderRoute);
app.get("/api/orders/my-orders", myOrdersRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Clean up before each test
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  // Reset current user
  global.mockTokens.currentUser = null;
});

module.exports = app;
