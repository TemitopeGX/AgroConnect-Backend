const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin with credentials from environment variable
if (process.env.NODE_ENV !== "test") {
  try {
    // The JSON might already be parsed by Vercel
    const serviceAccount =
      typeof process.env.FIREBASE_ADMIN_JSON === "string"
        ? JSON.parse(process.env.FIREBASE_ADMIN_JSON)
        : process.env.FIREBASE_ADMIN_JSON;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

module.exports = admin;
