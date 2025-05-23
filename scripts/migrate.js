const fs = require("fs");
const path = require("path");
const { pool } = require("../lib/db");

async function runMigration() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, "..", "migrations", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Connect to database
    const client = await pool.connect();

    try {
      // Begin transaction
      await client.query("BEGIN");

      // Run the migration
      await client.query(sql);

      // Commit transaction
      await client.query("COMMIT");

      console.log("✅ Database migration completed successfully");
    } catch (error) {
      // Rollback on error
      await client.query("ROLLBACK");
      console.error("❌ Migration failed:", error);
      throw error;
    } finally {
      // Release the client
      client.release();
    }
  } catch (error) {
    console.error("❌ Migration script error:", error);
    process.exit(1);
  } finally {
    // Close pool
    await pool.end();
  }
}

// Run migration
runMigration();
