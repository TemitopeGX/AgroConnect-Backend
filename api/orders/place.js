const db = require("../../lib/db");
const { verifyToken, requireRole } = require("../middleware/verifyToken");

module.exports = async (req, res) => {
  // Apply middleware
  await new Promise((resolve) => verifyToken(req, res, resolve));
  await new Promise((resolve) => requireRole("buyer")(req, res, resolve));

  try {
    const { produce_id, quantity } = req.body;
    const buyer_uid = req.user.uid;

    if (!produce_id || !quantity) {
      return res.status(400).json({
        error: "Required fields: produce_id, quantity",
      });
    }

    // Start transaction
    const client = await db.pool.connect();
    try {
      await client.query("BEGIN");

      // Get produce details and check availability
      const {
        rows: [produce],
      } = await client.query(
        "SELECT * FROM produce WHERE id = $1 AND quantity >= $2",
        [produce_id, quantity]
      );

      if (!produce) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "Produce not found or insufficient quantity",
        });
      }

      // Calculate commission (5-10% based on quantity)
      const commission = Math.min(Math.max(5, quantity / 10), 10);
      const commission_amount = (produce.price * quantity * commission) / 100;

      // Create order
      const {
        rows: [order],
      } = await client.query(
        `INSERT INTO orders (buyer_uid, produce_id, quantity, commission) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [buyer_uid, produce_id, quantity, commission_amount]
      );

      // Update produce quantity
      await client.query(
        "UPDATE produce SET quantity = quantity - $1 WHERE id = $2",
        [quantity, produce_id]
      );

      await client.query("COMMIT");
      res.status(201).json(order);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({
      error: "Failed to place order",
      details: error.message,
    });
  }
};
