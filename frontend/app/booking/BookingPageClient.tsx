"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { roomsAPI, bookingsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

interface BookingForm {
  room_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  payment_method: string;
  special_requests?: string;
}

export default function BookingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("room");

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: {
      room_id: roomIdParam ? parseInt(roomIdParam) : undefined,
      guests: 2,
      payment_method: "direct",
    },
  });

  const checkIn = watch("check_in");
  const checkOut = watch("check_out");
  const selectedRoomId = watch("room_id");
  const guests = watch("guests");
  const paymentMethod = watch("payment_method");

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để đặt phòng");
      router.push("/login");
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await roomsAPI.getAll();
        setRooms(response.data);
        if (roomIdParam) {
          const room = response.data.find(
            (r: any) => r.id === parseInt(roomIdParam)
          );
          if (room) setSelectedRoom(room);
        }
      } catch (error: any) {
        toast.error("Không thể tải danh sách phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [roomIdParam, router]);

  useEffect(() => {
    if (selectedRoomId) {
      const room = rooms.find((r) => r.id === selectedRoomId);
      setSelectedRoom(room);
    }
  }, [selectedRoomId, rooms]);

  useEffect(() => {
    if (checkIn && checkOut && checkIn < checkOut) {
      checkAvailability();
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights > 0) {
        setTotalPrice(nights * parseFloat(selectedRoom.price_per_night));
      }
    }
  }, [selectedRoom, checkIn, checkOut]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || checkIn >= checkOut) return;

    try {
      const response = await roomsAPI.checkAvailability({
        check_in: checkIn,
        check_out: checkOut,
      });
      setAvailableRooms(response.data);
    } catch (error: any) {
      toast.error("Không thể kiểm tra phòng trống");
    }
  };

  const onSubmit = async (data: BookingForm) => {
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày check-in và check-out");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Ngày check-out phải sau ngày check-in");
      return;
    }

    setSubmitting(true);
    try {
      const response = await bookingsAPI.create(data);
      toast.success("Đặt phòng thành công!");
      router.push("/bookings");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Đặt phòng thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-800">
          Đặt phòng khách sạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn phòng *
                  </label>
                  <select
                    {...register("room_id", { required: "Vui lòng chọn phòng" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn phòng --</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.room_type} - {formatPrice(room.price_per_night)}/đêm
                      </option>
                    ))}
                  </select>
                  {errors.room_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.room_id.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-in *
                    </label>
                    <input
                      type="date"
                      {...register("check_in", {
                        required: "Vui lòng chọn ngày check-in",
                        min: new Date().toISOString().split("T")[0],
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.check_in && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.check_in.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày check-out *
                    </label>
                    <input
                      type="date"
                      {...register("check_out", {
                        required: "Vui lòng chọn ngày check-out",
                        min: checkIn || new Date().toISOString().split("T")[0],
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.check_out && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.check_out.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng khách *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedRoom?.max_guests || 10}
                    {...register("guests", {
                      required: "Vui lòng nhập số lượng khách",
                      min: { value: 1, message: "Tối thiểu 1 khách" },
                      max: {
                        value: selectedRoom?.max_guests || 10,
                        message: `Tối đa ${selectedRoom?.max_guests || 10} khách`,
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.guests && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.guests.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán *
                  </label>
                  <select
                    {...register("payment_method", {
                      required: "Vui lòng chọn phương thức thanh toán",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="direct">Thanh toán trực tiếp tại khách sạn</option>
                    <option value="online">Thanh toán online ngay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    {...register("special_requests")}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập yêu cầu đặc biệt của bạn (nếu có)..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                Tóm tắt đặt phòng
              </h3>
              {selectedRoom ? (
                <>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Loại phòng</p>
                      <p className="font-semibold">{selectedRoom.room_type}</p>
                    </div>
                    {checkIn && checkOut && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-semibold">
                            {new Date(checkIn).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-semibold">
                            {new Date(checkOut).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Số đêm</p>
                          <p className="font-semibold">
                            {Math.ceil(
                              (new Date(checkOut).getTime() -
                                new Date(checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            đêm
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Số khách</p>
                          <p className="font-semibold">{guests} người</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Giá/đêm</span>
                      <span className="font-semibold">
                        {formatPrice(selectedRoom.price_per_night)}
                      </span>
                    </div>
                    {totalPrice > 0 && (
                      <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Vui lòng chọn phòng</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


