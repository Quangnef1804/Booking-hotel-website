import { useEffect, useState } from "react";

export default function Home() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("https://your-backend-url.onrender.com/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🏨 Hotel Booking System</h1>
      <p>Connected to Render + Railway successfully!</p>
      <ul>
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <li key={b.id}>{b.guest_name} - {b.room_number}</li>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </ul>
    </div>
  );
}
