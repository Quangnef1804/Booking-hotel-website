import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.js";
import roomsRoutes from "./routes/rooms.js";
import bookingsRoutes from "./routes/bookings.js";
import hotelRoutes from "./routes/hotel.js";
import customersRoutes from "./routes/customers.js";

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hotel Booking API is running!", version: "1.0.0" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/customers", customersRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📡 API available at http://localhost:${port}/api`);
});
