const db = require("../../lib/db");
const { verifyToken, requireRole } = require("../middleware/verifyToken");

module.exports = async (req, res) => {
  // Apply middleware
  await new Promise((resolve) => verifyToken(req, res, resolve));
  await new Promise((resolve) => requireRole("farmer")(req, res, resolve));

  try {
    const { uid } = req.user;
    const { name, quantity, unit, price } = req.body;

    // Validate input
    if (!name || !quantity || !unit || !price) {
      return res.status(400).json({
        error: "Required fields: name, quantity, unit, price",
      });
    }

    // Create produce listing
    const { rows } = await db.query(
      `INSERT INTO produce (uid, name, quantity, unit, price) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [uid, name, quantity, unit, price]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create Produce Error:", error);
    res.status(500).json({
      error: "Failed to create produce listing",
      details: error.message,
    });
  }
};
