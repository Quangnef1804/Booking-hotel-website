import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY room_number");
    res.json(result.rows);
  } catch (err) {
    console.error("Get rooms error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get room by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get room error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Check room availability
router.post("/check-availability", async (req, res) => {
  try {
    const { check_in, check_out, room_id } = req.body;

    if (!check_in || !check_out) {
      return res.status(400).json({ error: "Check-in and check-out dates are required" });
    }

    let query = `
      SELECT r.* FROM rooms r
      WHERE r.status = 'available'
      AND r.id NOT IN (
        SELECT DISTINCT room_id FROM bookings
        WHERE status IN ('pending', 'confirmed')
        AND (
          (check_in <= $1 AND check_out > $1) OR
          (check_in < $2 AND check_out >= $2) OR
          (check_in >= $1 AND check_out <= $2)
        )
      )
    `;
    let params = [check_in, check_out];

    if (room_id) {
      query += " AND r.id = $3";
      params.push(room_id);
    }

    query += " ORDER BY r.room_number";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Check availability error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

