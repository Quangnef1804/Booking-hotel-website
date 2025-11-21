import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get("/rooms"),
  getById: (id: number) => api.get(`/rooms/${id}`),
  checkAvailability: (data: {
    check_in: string;
    check_out: string;
    room_id?: number;
  }) => api.post("/rooms/check-availability", data),
};

// Bookings API
export const bookingsAPI = {
  create: (data: {
    room_id: number;
    check_in: string;
    check_out: string;
    guests: number;
    payment_method?: string;
    special_requests?: string;
  }) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  getAll: () => api.get("/bookings/all"),
  updateStatus: (id: number, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
  cancel: (id: number) => api.patch(`/bookings/${id}/cancel`),
};

// Hotel API
export const hotelAPI = {
  getInfo: () => api.get("/hotel/info"),
  updateInfo: (data: any) => api.put("/hotel/info", data),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get("/customers"),
  getById: (id: number) => api.get(`/customers/${id}`),
};

export default api;

