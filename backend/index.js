import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Railway PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running on Render!");
});

// Example API: get all bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
