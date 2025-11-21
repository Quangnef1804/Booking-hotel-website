import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get all customers (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.phone, u.address, u.role, u.created_at,
              COUNT(b.id) as total_bookings,
              COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_price ELSE 0 END), 0) as total_spent
       FROM users u
       LEFT JOIN bookings b ON u.id = b.user_id
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get customers error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get customer details with bookings
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      "SELECT id, email, full_name, phone, address, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const bookingsResult = await pool.query(
      `SELECT b.*, r.room_number, r.room_type
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [id]
    );

    res.json({
      customer: userResult.rows[0],
      bookings: bookingsResult.rows,
    });
  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

