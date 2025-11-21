-- Database Schema for Hotel Booking System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) UNIQUE NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_guests INTEGER NOT NULL,
    amenities TEXT[],
    images TEXT[],
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method VARCHAR(50),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotel information table
CREATE TABLE IF NOT EXISTS hotel_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    images TEXT[],
    amenities TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default hotel information
INSERT INTO hotel_info (name, description, address, phone, email, images, amenities)
VALUES (
    'Anh Dao Hotel',
    'Khách sạn Anh Dao - Nơi nghỉ dưỡng lý tưởng với view biển tuyệt đẹp và dịch vụ đẳng cấp. Chúng tôi cam kết mang đến cho quý khách những trải nghiệm tuyệt vời nhất.',
    '123 Đường Biển, Thành phố Biển, Việt Nam',
    '+84 123 456 789',
    'info@anhdaohotel.com',
    ARRAY[]::TEXT[],
    ARRAY['WiFi miễn phí', 'Bể bơi', 'Nhà hàng', 'Spa', 'Dịch vụ đưa đón sân bay', 'Bãi đỗ xe']
) ON CONFLICT DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, description, price_per_night, max_guests, amenities, images, status)
VALUES
    ('101', 'Standard Room', 'Phòng tiêu chuẩn với giường đôi, TV thông minh và bữa sáng miễn phí cho 2 người.', 500000, 2, 
     ARRAY['Giường đôi', 'TV thông minh', 'Bữa sáng miễn phí', 'WiFi', 'Điều hòa'], 
     ARRAY[]::TEXT[], 'available'),
    ('102', 'Economy Room', 'Phòng tiết kiệm với đầy đủ tiện nghi cơ bản, phù hợp cho khách du lịch.', 350000, 2,
     ARRAY['Giường đôi', 'TV', 'WiFi', 'Điều hòa'],
     ARRAY[]::TEXT[], 'available'),
    ('201', 'Family Room', 'Phòng gia đình rộng rãi với giường đôi và giường phụ, lý tưởng cho gia đình 4 người.', 800000, 4,
     ARRAY['Giường đôi + Giường phụ', 'TV thông minh', 'Bữa sáng miễn phí', 'WiFi', 'Điều hòa', 'Ban công'],
     ARRAY[]::TEXT[], 'available')
ON CONFLICT (room_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

