"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingsAPI, customersAPI, hotelAPI } from "@/lib/api";
import { isAuthenticated, getToken } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "customers" | "hotel">(
    "bookings"
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const checkAdmin = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.data.user.role !== "admin") {
          toast.error("Bạn không có quyền truy cập trang này");
          router.push("/");
          return;
        }
        setUser(response.data.user);
        await loadData();
      } catch (error: any) {
        toast.error("Không thể xác thực");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  const loadData = async () => {
    try {
      const [bookingsRes, customersRes] = await Promise.all([
        bookingsAPI.getAll(),
        customersAPI.getAll(),
      ]);
      setBookings(bookingsRes.data);
      setCustomers(customersRes.data);
    } catch (error: any) {
      toast.error("Không thể tải dữ liệu");
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      toast.success("Cập nhật trạng thái thành công");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Không thể cập nhật");
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

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalCustomers = customers.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-800">
          Trang quản lý
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Tổng đặt phòng</p>
            <p className="text-3xl font-bold text-blue-600">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Doanh thu</p>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Chờ xác nhận</p>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingBookings}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Tổng khách hàng</p>
            <p className="text-3xl font-bold text-purple-600">
              {totalCustomers}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                Quản lý đặt phòng
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "customers"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                Quản lý khách hàng
              </button>
              <button
                onClick={() => setActiveTab("hotel")}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                  activeTab === "hotel"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                Thông tin khách sạn
              </button>
            </nav>
          </div>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Danh sách đặt phòng
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Chưa có đặt phòng nào
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Khách hàng
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Phòng
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Ngày
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tổng tiền
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{booking.id}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-semibold">{booking.full_name}</p>
                            <p className="text-gray-500 text-xs">
                              {booking.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {booking.room_type} ({booking.room_number})
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p>
                              {new Date(booking.check_in).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">
                              →{" "}
                              {new Date(booking.check_out).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                          {formatPrice(booking.total_price)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleUpdateStatus(booking.id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Danh sách khách hàng
            </h2>
            {customers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Chưa có khách hàng nào
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Họ tên
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Điện thoại
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Số đặt phòng
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Tổng chi tiêu
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Ngày đăng ký
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{customer.id}</td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          {customer.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm">{customer.email}</td>
                        <td className="px-4 py-3 text-sm">
                          {customer.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {customer.total_bookings || 0}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          {formatPrice(customer.total_spent || 0)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(customer.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Hotel Info Tab */}
        {activeTab === "hotel" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              Thông tin khách sạn
            </h2>
            <p className="text-gray-600 mb-4">
              Tính năng cập nhật thông tin khách sạn sẽ được phát triển trong
              phiên bản tiếp theo.
            </p>
            <p className="text-sm text-gray-500">
              Hiện tại bạn có thể cập nhật thông tin trực tiếp trong database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

