const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin with credentials from environment variable
if (process.env.NODE_ENV !== "test") {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
