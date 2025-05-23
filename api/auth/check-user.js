const db = require("../../lib/db");
const { verifyToken } = require("../middleware/verifyToken");

module.exports = async (req, res) => {
  // Apply middleware first
  await new Promise((resolve) => verifyToken(req, res, resolve));

  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "FIREBASE_UID is required" });
    }

    const { rows } = await db.query(
      "SELECT uid, email, role FROM users WHERE uid = $1",
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Check User Error:", error);
    res
      .status(500)
      .json({ error: "Failed to check user", details: error.message });
  }
};
