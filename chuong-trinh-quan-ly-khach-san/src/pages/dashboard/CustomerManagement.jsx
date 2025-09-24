import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { customersAPI } from "../../services/api";
import { useApp } from "../../context/AppContext";
import SimpleCustomerModal from "../../components/modals/SimpleCustomerModal";
import SimpleConfirmDialog from "../../components/common/SimpleConfirmDialog";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const { setLoading, setError, showNotification } = useApp();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const response = await customersAPI.getAll();
        setCustomers(response.data);
      } catch {
        setError("Không thể tải danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // setLoading and setError are stable from context

  // CRUD handlers
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteDialog(true);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      setLoading(true);
      if (modalMode === "create") {
        const response = await customersAPI.create(customerData);
        setCustomers((prev) => [...prev, response.data]);
        showNotification("Thêm khách hàng thành công!", "success");
      } else {
        const response = await customersAPI.update(
          customerData.MaKhachHang,
          customerData
        );
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.MaKhachHang === customerData.MaKhachHang
              ? response.data
              : customer
          )
        );
        showNotification("Cập nhật khách hàng thành công!", "success");
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      showNotification("Có lỗi xảy ra khi lưu khách hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCustomer = async () => {
    try {
      setLoading(true);
      await customersAPI.delete(customerToDelete.MaKhachHang);
      setCustomers((prev) =>
        prev.filter(
          (customer) => customer.MaKhachHang !== customerToDelete.MaKhachHang
        )
      );
      showNotification("Xóa khách hàng thành công!", "success");
      setShowDeleteDialog(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
      showNotification("Có lỗi xảy ra khi xóa khách hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.MaKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.SoDienThoai.includes(searchTerm) ||
      customer.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý khách lưu trú
          </h1>
          <p className="text-gray-600">Quản lý thông tin khách hàng</p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Thông tin khách hàng
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã KH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CCCD/CMND
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tùy chọn
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.MaKhachHang} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.MaKhachHang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.HoTen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(customer.NgayDangKy)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.CMND_HoChieu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.SoDienThoai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      <SimpleCustomerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <SimpleConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteCustomer}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDelete?.HoTen}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default CustomerManagement;
