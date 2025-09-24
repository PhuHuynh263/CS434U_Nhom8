import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  invoicesAPI,
  customersAPI,
  bookingsAPI,
  servicesAPI,
} from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/common/Loading";
import SimpleInvoiceModal from "../../components/modals/SimpleInvoiceModal";
import SimpleConfirmDialog from "../../components/common/SimpleConfirmDialog";

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const { loading, setLoading, showNotification } = useApp();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        invoicesResponse,
        customersResponse,
        bookingsResponse,
        servicesResponse,
      ] = await Promise.all([
        invoicesAPI.getAll(),
        customersAPI.getAll(),
        bookingsAPI.getAll(),
        servicesAPI.getAll(),
      ]);
      setInvoices(invoicesResponse.data);
      setCustomers(customersResponse.data);
      setBookings(bookingsResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      showNotification("Không thể tải dữ liệu: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleDeleteInvoice = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteConfirm(true);
  };

  const handlePayInvoice = async (invoice) => {
    try {
      setLoading(true);
      await invoicesAPI.updateStatus(invoice.MaHoaDon, "DaThanhToan");
      showNotification("Cập nhật thanh toán thành công!", "success");
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi thanh toán: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      setLoading(true);

      if (editingInvoice) {
        await invoicesAPI.update(editingInvoice.MaHoaDon, invoiceData);
        showNotification("Cập nhật hóa đơn thành công!", "success");
      } else {
        await invoicesAPI.create(invoiceData);
        showNotification("Thêm hóa đơn thành công!", "success");
      }

      setShowModal(false);
      setEditingInvoice(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi lưu hóa đơn: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteInvoice = async () => {
    try {
      setLoading(true);
      await invoicesAPI.delete(invoiceToDelete.MaHoaDon);
      showNotification("Xóa hóa đơn thành công!", "success");
      setShowDeleteConfirm(false);
      setInvoiceToDelete(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi xóa hóa đơn: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.MaHoaDon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.MaKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(invoice.MaKhachHang)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getCustomerName = (maKhachHang) => {
    const customer = customers.find((kh) => kh.MaKhachHang === maKhachHang);
    return customer ? customer.HoTen : maKhachHang;
  };

  const getBookingInfo = (maDatPhong) => {
    const booking = bookings.find((dp) => dp.MaDatPhong === maDatPhong);
    return booking
      ? `${booking.MaDatPhong} - Phòng ${booking.MaPhong}`
      : maDatPhong;
  };

  const getServiceName = (maDichVu) => {
    if (!maDichVu) return "Không có";
    const service = services.find((dv) => dv.MaDichVu === maDichVu);
    return service ? service.TenDichVu : maDichVu;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ChuaThanhToan: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chưa thanh toán",
      },
      DaThanhToan: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Đã thanh toán",
      },
      DaHuy: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig["ChuaThanhToan"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return <Loading message="Đang tải danh sách hóa đơn..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hóa đơn</h1>
          <p className="text-gray-600">Quản lý hóa đơn và thanh toán</p>
        </div>
        <button
          onClick={handleAddInvoice}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hóa đơn, mã khách hàng hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách hóa đơn ({filteredInvoices.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã hóa đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đặt phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày lập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy hóa đơn nào phù hợp"
                      : "Chưa có hóa đơn nào"}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.MaHoaDon} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.MaHoaDon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCustomerName(invoice.MaKhachHang)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.MaKhachHang}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBookingInfo(invoice.MaDatPhong)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getServiceName(invoice.MaDichVu)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.TongTien)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.TrangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(invoice.NgayLap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {invoice.TrangThai === "ChuaThanhToan" && (
                          <button
                            onClick={() => handlePayInvoice(invoice)}
                            className="text-green-600 hover:text-green-900"
                            title="Thanh toán"
                          >
                            <CurrencyDollarIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice)}
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

      {/* Invoice Modal */}
      <SimpleInvoiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInvoice(null);
        }}
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
        customers={customers}
        bookings={bookings}
        services={services}
      />

      {/* Delete Confirmation */}
      <SimpleConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={confirmDeleteInvoice}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa hóa đơn "${invoiceToDelete?.MaHoaDon}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default InvoiceManagement;
