"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { bookingsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data);
      } catch (error: any) {
        toast.error("Không thể tải danh sách đặt phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  const handleCancel = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return;

    try {
      await bookingsAPI.cancel(id);
      toast.success("Đã hủy đặt phòng");
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Không thể hủy đặt phòng");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Đặt phòng của tôi</h1>
          <Link
            href="/booking"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Đặt phòng mới
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Bạn chưa có đặt phòng nào
            </p>
            <Link
              href="/booking"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Đặt phòng ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-slate-800">
                        {booking.room_type}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Phòng</p>
                        <p className="font-semibold">{booking.room_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-semibold">
                          {new Date(booking.check_in).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-semibold">
                          {new Date(booking.check_out).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Số khách</p>
                        <p className="font-semibold">{booking.guests} người</p>
                      </div>
                    </div>
                    {booking.special_requests && (
                      <div className="mt-4">
                        <p className="text-gray-600 text-sm">Yêu cầu đặc biệt:</p>
                        <p className="text-gray-800">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Tổng tiền</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(booking.total_price)}
                      </p>
                    </div>
                    {booking.status !== "cancelled" &&
                      booking.status !== "completed" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Hủy đặt phòng
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

