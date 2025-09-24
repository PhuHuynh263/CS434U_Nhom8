import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { staffAPI, rolesAPI } from "../../services/api";
import { useApp } from "../../context/AppContext";
import Loading from "../../components/common/Loading";
import SimpleStaffModal from "../../components/modals/SimpleStaffModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteStaff, setDeleteStaff] = useState(null);
  const { showNotification } = useApp();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [staffResponse, rolesResponse] = await Promise.all([
        staffAPI.getAll(),
        rolesAPI.getAll(),
      ]);
      setStaff(staffResponse.data);
      setRoles(rolesResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      if (selectedStaff) {
        // Update existing staff
        await staffAPI.update(selectedStaff.MaNhanVien, staffData);
        showNotification("Cập nhật thông tin nhân viên thành công", "success");
      } else {
        // Create new staff
        await staffAPI.create(staffData);
        showNotification("Thêm nhân viên mới thành công", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving staff:", error);
      showNotification("Lỗi khi lưu thông tin nhân viên", "error");
      throw error;
    }
  };

  const confirmDeleteStaff = (staffMember) => {
    setDeleteStaff(staffMember);
  };

  const handleDeleteStaff = async () => {
    if (!deleteStaff) return;

    try {
      await staffAPI.delete(deleteStaff.MaNhanVien);
      showNotification("Xóa nhân viên thành công", "success");
      await loadData();
    } catch (error) {
      console.error("Error deleting staff:", error);
      showNotification("Lỗi khi xóa nhân viên", "error");
    } finally {
      setDeleteStaff(null);
    }
  };

  const getRoleName = (maVaiTro) => {
    const role = roles.find((r) => r.MaVaiTro === maVaiTro);
    return role ? role.TenVaiTro : "Không xác định";
  };

  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case "Hoạt động":
        return "bg-green-100 text-green-800";
      case "Nghỉ việc":
        return "bg-red-100 text-red-800";
      case "Tạm nghỉ":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.TenNhanVien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.SoDienThoai?.includes(searchTerm) ||
      s.ChucVu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleName(s.MaVaiTro)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý nhân sự & phân quyền
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin nhân viên và phân quyền hệ thống
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddStaff}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Thêm nhân viên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm font-medium text-gray-500">
            Tổng nhân viên
          </div>
          <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm font-medium text-gray-500">
            Đang hoạt động
          </div>
          <div className="text-2xl font-bold text-green-600">
            {staff.filter((s) => s.TrangThai === "Hoạt động").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm font-medium text-gray-500">Tạm nghỉ</div>
          <div className="text-2xl font-bold text-yellow-600">
            {staff.filter((s) => s.TrangThai === "Tạm nghỉ").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm font-medium text-gray-500">Nghỉ việc</div>
          <div className="text-2xl font-bold text-red-600">
            {staff.filter((s) => s.TrangThai === "Nghỉ việc").length}
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "Không tìm thấy nhân viên nào phù hợp"
                      : "Chưa có nhân viên nào"}
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staffMember) => (
                  <tr key={staffMember.MaNhanVien} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {staffMember.TenNhanVien}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {staffMember.MaNhanVien}
                        </div>
                        <div className="text-sm text-gray-500">
                          CCCD: {staffMember.CCCD}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {staffMember.Email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {staffMember.SoDienThoai}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {staffMember.ChucVu}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getRoleName(staffMember.MaVaiTro)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          staffMember.TrangThai
                        )}`}
                      >
                        {staffMember.TrangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staffMember.NgayTao
                        ? new Date(staffMember.NgayTao).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditStaff(staffMember)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteStaff(staffMember)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
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

      {/* Total count */}
      <div className="mt-4 text-sm text-gray-500">
        Hiển thị {filteredStaff.length} / {staff.length} nhân viên
      </div>

      {/* Staff Modal */}
      <SimpleStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStaff}
        staff={selectedStaff}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={handleDeleteStaff}
        title="Xác nhận xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${deleteStaff?.TenNhanVien}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default StaffManagement;
