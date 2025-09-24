import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { servicesAPI } from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/common/Loading";
import SimpleServiceModal from "../../components/modals/SimpleServiceModal";
import SimpleConfirmDialog from "../../components/common/SimpleConfirmDialog";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const { loading, setLoading, showNotification } = useApp();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      showNotification("Không thể tải dữ liệu: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const handleSaveService = async (serviceData) => {
    try {
      setLoading(true);

      if (editingService) {
        await servicesAPI.update(editingService.MaDichVu, serviceData);
        showNotification("Cập nhật dịch vụ thành công!", "success");
      } else {
        await servicesAPI.create(serviceData);
        showNotification("Thêm dịch vụ thành công!", "success");
      }

      setShowModal(false);
      setEditingService(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi lưu dịch vụ: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteService = async () => {
    try {
      setLoading(true);
      await servicesAPI.delete(serviceToDelete.MaDichVu);
      showNotification("Xóa dịch vụ thành công!", "success");
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      await loadData();
    } catch (error) {
      showNotification("Lỗi khi xóa dịch vụ: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.TenDichVu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.MaDichVu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.MoTa?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      HoatDong: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      TamNgung: { bg: "bg-red-100", text: "text-red-800", label: "Tạm ngưng" },
    };

    const config = statusConfig[status] || statusConfig["HoatDong"];
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

  if (loading) {
    return <Loading message="Đang tải danh sách dịch vụ..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-gray-600">Quản lý các dịch vụ khách sạn</p>
        </div>
        <button
          onClick={handleAddService}
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
                placeholder="Tìm kiếm theo tên dịch vụ, mã dịch vụ hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách dịch vụ ({filteredServices.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy dịch vụ nào phù hợp"
                      : "Chưa có dịch vụ nào"}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.MaDichVu} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.MaDichVu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.TenDichVu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(service.Gia)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.DonVi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.TrangThai)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                      title={service.MoTa}
                    >
                      {service.MoTa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service)}
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

      {/* Service Modal */}
      <SimpleServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        service={editingService}
        onSave={handleSaveService}
      />

      {/* Delete Confirmation */}
      <SimpleConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setServiceToDelete(null);
        }}
        onConfirm={confirmDeleteService}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa dịch vụ "${serviceToDelete?.TenDichVu}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default ServiceManagement;
