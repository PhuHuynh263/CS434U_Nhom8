import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { bookingsAPI, customersAPI, roomsAPI } from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/common/Loading";
import SimpleBookingModal from "../../components/modals/SimpleBookingModal";
import SimpleConfirmDialog from "../../components/common/SimpleConfirmDialog";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const { loading, setLoading, showNotification } = useApp();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, customersResponse, roomsResponse] =
        await Promise.all([
          bookingsAPI.getAll(),
          customersAPI.getAll(),
          roomsAPI.getAll(),
        ]);
      setBookings(bookingsResponse.data);
      setCustomers(customersResponse.data);
      setRooms(roomsResponse.data);
    } catch (error) {
      showNotification("Không thể tải dữ liệu: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBooking = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirm(true);
  };

  const handleSaveBooking = async (bookingData) => {
    try {
      setLoading(true);

      if (editingBooking) {
        await bookingsAPI.update(editingBooking.MaDatPhong, bookingData);
        showNotification("Cập nhật đặt phòng thành công!", "success");
      } else {
        await bookingsAPI.create(bookingData);
        showNotification("Thêm đặt phòng thành công!", "success");
      }

      setShowModal(false);
      setEditingBooking(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi lưu đặt phòng: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBooking = async () => {
    try {
      setLoading(true);
      await bookingsAPI.delete(bookingToDelete.MaDatPhong);
      showNotification("Xóa đặt phòng thành công!", "success");
      setShowDeleteConfirm(false);
      setBookingToDelete(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi xóa đặt phòng: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.MaDatPhong?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.MaKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(booking.MaKhachHang)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getCustomerName = (maKhachHang) => {
    const customer = customers.find((kh) => kh.MaKhachHang === maKhachHang);
    return customer ? customer.HoTen : maKhachHang;
  };

  const getRoomName = (maPhong) => {
    const room = rooms.find((p) => p.MaPhong === maPhong);
    return room ? room.TenPhong : maPhong;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DaDat: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã đặt" },
      DaNhan: { bg: "bg-green-100", text: "text-green-800", label: "Đã nhận" },
      DaTra: { bg: "bg-gray-100", text: "text-gray-800", label: "Đã trả" },
      DaHuy: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig["DaDat"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return <Loading message="Đang tải danh sách đặt phòng..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý đặt phòng
          </h1>
          <p className="text-gray-600">
            Quản lý các đơn đặt phòng của khách hàng
          </p>
        </div>
        <button
          onClick={handleAddBooking}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đặt phòng, mã khách hàng hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách đặt phòng ({filteredBookings.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đặt phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày trả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số khách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy đặt phòng nào phù hợp"
                      : "Chưa có đặt phòng nào"}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.MaDatPhong} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.MaDatPhong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCustomerName(booking.MaKhachHang)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.MaKhachHang}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getRoomName(booking.MaPhong)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.MaPhong}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.NgayNhan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.NgayTra)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.SoLuongKhach}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.TrangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      <SimpleBookingModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBooking(null);
        }}
        booking={editingBooking}
        onSave={handleSaveBooking}
        customers={customers}
        rooms={rooms}
      />

      {/* Delete Confirmation */}
      <SimpleConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setBookingToDelete(null);
        }}
        onConfirm={confirmDeleteBooking}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa đặt phòng "${bookingToDelete?.MaDatPhong}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default BookingManagement;
