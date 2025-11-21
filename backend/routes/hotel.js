import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get hotel information
router.get("/info", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hotel_info ORDER BY id DESC LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel information not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get hotel info error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update hotel information (admin only)
router.put("/info", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, address, phone, email, images, amenities } = req.body;
    
    const result = await pool.query(
      `UPDATE hotel_info 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           address = COALESCE($3, address),
           phone = COALESCE($4, phone),
           email = COALESCE($5, email),
           images = COALESCE($6, images),
           amenities = COALESCE($7, amenities),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = (SELECT id FROM hotel_info ORDER BY id DESC LIMIT 1)
       RETURNING *`
    );

    res.json({ message: "Hotel information updated", hotel: result.rows[0] });
  } catch (err) {
    console.error("Update hotel info error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

