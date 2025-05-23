const db = require("../../lib/db");
const admin = require("../../lib/firebase");

module.exports = async (req, res) => {
  try {
    const { uid, email, role } = req.body;

    // Validate input
    if (!uid || !email || !role) {
      return res.status(400).json({
        error: "Invalid input. Required: uid, email, role (farmer or buyer)",
      });
    }

    if (!["farmer", "buyer"].includes(role)) {
      return res.status(400).json({
        error: "Invalid role. Must be: farmer or buyer",
      });
    }

    // Check if user already exists
    const { rows: existing } = await db.query(
      "SELECT uid FROM users WHERE uid = $1",
      [uid]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    // Create user in database
    const { rows } = await db.query(
      "INSERT INTO users (uid, email, role) VALUES ($1, $2, $3) RETURNING *",
      [uid, email, role]
    );

    // Set custom claims in Firebase
    await admin.auth().setCustomUserClaims(uid, { role });

    res.status(201).json({
      message: "User registered successfully",
      user: rows[0],
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      error: "Failed to create user",
      details: error.message,
    });
  }
};
