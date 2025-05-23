const db = require("../../lib/db");

module.exports = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, u.email as farmer_email 
       FROM produce p
       JOIN users u ON p.uid = u.uid
       WHERE p.quantity > 0 AND p.available = true
       ORDER BY p.created_at DESC`
    );

    // Format response as specified in documentation
    const formattedProduce = rows.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      unit: p.unit,
      price: p.price,
      farmer: {
        email: p.farmer_email,
      },
    }));

    res.json(formattedProduce);
  } catch (error) {
    console.error("List Produce Error:", error);
    res.status(500).json({
      error: "Failed to list produce",
      details: error.message,
    });
  }
};
