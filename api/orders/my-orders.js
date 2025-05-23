const db = require("../../lib/db");
const { verifyToken } = require("../middleware/verifyToken");

module.exports = async (req, res) => {
  // Apply middleware
  await new Promise((resolve) => verifyToken(req, res, resolve));

  try {
    const { uid, role } = req.user;
    let query;
    let params;

    if (role === "buyer") {
      query = `
        SELECT o.*, p.name as produce_name, p.unit, u.email as farmer_email
        FROM orders o
        JOIN produce p ON o.produce_id = p.id
        JOIN users u ON p.uid = u.uid
        WHERE o.buyer_uid = $1
        ORDER BY o.created_at DESC
      `;
      params = [uid];
    } else if (role === "farmer") {
      query = `
        SELECT o.*, p.name as produce_name, p.unit, u.email as buyer_email
        FROM orders o
        JOIN produce p ON o.produce_id = p.id
        JOIN users u ON o.buyer_uid = u.uid
        WHERE p.uid = $1
        ORDER BY o.created_at DESC
      `;
      params = [uid];
    } else {
      return res.status(403).json({
        error: "Unauthorized role",
      });
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};
