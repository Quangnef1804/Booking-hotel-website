import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Create booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { room_id, check_in, check_out, guests, payment_method, special_requests } = req.body;
    const user_id = req.user.id;

    if (!room_id || !check_in || !check_out || !guests) {
      return res.status(400).json({ error: "Room ID, dates, and guests are required" });
    }

    // Get room price
    const roomResult = await pool.query("SELECT price_per_night FROM rooms WHERE id = $1", [room_id]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Calculate total price
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = parseFloat(roomResult.rows[0].price_per_night);
    const totalPrice = nights * pricePerNight;

    // Check availability
    const availabilityCheck = await pool.query(
      `SELECT id FROM bookings 
       WHERE room_id = $1 
       AND status IN ('pending', 'confirmed')
       AND (
         (check_in <= $2 AND check_out > $2) OR
         (check_in < $3 AND check_out >= $3) OR
         (check_in >= $2 AND check_out <= $3)
       )`,
      [room_id, check_in, check_out]
    );

    if (availabilityCheck.rows.length > 0) {
      return res.status(400).json({ error: "Room is not available for selected dates" });
    }

    // Create booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, total_price, payment_method, special_requests, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id,
        room_id,
        check_in,
        check_out,
        guests,
        totalPrice,
        payment_method || null,
        special_requests || null,
        payment_method === "online" ? "confirmed" : "pending",
      ]
    );

    const booking = bookingResult.rows[0];

    // Create payment record if online payment
    if (payment_method === "online") {
      await pool.query(
        `INSERT INTO payments (booking_id, amount, payment_method, status, payment_date)
         VALUES ($1, $2, $3, 'completed', CURRENT_TIMESTAMP)`,
        [booking.id, totalPrice, payment_method]
      );

      await pool.query(
        "UPDATE bookings SET payment_status = 'paid' WHERE id = $1",
        [booking.id]
      );
    }

    // Get booking with room details
    const fullBooking = await pool.query(
      `SELECT b.*, r.room_number, r.room_type, r.price_per_night, u.full_name, u.email, u.phone
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [booking.id]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: fullBooking.rows[0],
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings
router.get("/my-bookings", authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT b.*, r.room_number, r.room_type, r.price_per_night, r.images
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (admin only)
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, r.room_number, r.room_type, u.full_name, u.email, u.phone
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update booking status (admin only)
router.patch("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      "UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking status updated", booking: result.rows[0] });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel booking
router.patch("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if booking belongs to user or user is admin
    const bookingCheck = await pool.query(
      "SELECT * FROM bookings WHERE id = $1",
      [id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingCheck.rows[0];
    if (booking.user_id !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    const result = await pool.query(
      "UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({ message: "Booking cancelled", booking: result.rows[0] });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

