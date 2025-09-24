import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CustomerModal = ({
  isOpen,
  onClose,
  customer,
  onSave,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    HoTen: "",
    Email: "",
    SoDienThoai: "",
    DiaChi: "",
    CCCD: "",
    NgaySinh: "",
    GioiTinh: "Nam",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        HoTen: customer.HoTen || "",
        Email: customer.Email || "",
        SoDienThoai: customer.SoDienThoai || "",
        DiaChi: customer.DiaChi || "",
        CCCD: customer.CCCD || "",
        NgaySinh: customer.NgaySinh || "",
        GioiTinh: customer.GioiTinh || "Nam",
      });
    } else {
      setFormData({
        HoTen: "",
        Email: "",
        SoDienThoai: "",
        DiaChi: "",
        CCCD: "",
        NgaySinh: "",
        GioiTinh: "Nam",
      });
    }
    setErrors({});
  }, [customer, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.HoTen.trim()) {
      newErrors.HoTen = "Họ tên là bắt buộc";
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = "Email không hợp lệ";
    }

    if (!formData.SoDienThoai.trim()) {
      newErrors.SoDienThoai = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.SoDienThoai)) {
      newErrors.SoDienThoai = "Số điện thoại phải có 10-11 chữ số";
    }

    if (!formData.CCCD.trim()) {
      newErrors.CCCD = "CCCD là bắt buộc";
    } else if (!/^[0-9]{12}$/.test(formData.CCCD)) {
      newErrors.CCCD = "CCCD phải có 12 chữ số";
    }

    if (!formData.NgaySinh) {
      newErrors.NgaySinh = "Ngày sinh là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const customerData = {
        ...formData,
        MaKhachHang: customer?.MaKhachHang || `KH${Date.now()}`,
      };
      onSave(customerData);
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
      <div
        className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        style={{ zIndex: 10000 }}
      >
        <div
          className="fixed inset-0 transition-opacity"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9998,
          }}
          onClick={onClose}
        ></div>

        <div
          className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          style={{
            zIndex: 10001,
            position: "relative",
          }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === "create"
                  ? "Thêm khách hàng mới"
                  : "Chỉnh sửa khách hàng"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="HoTen"
                  value={formData.HoTen}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nhập họ tên"
                />
                {errors.HoTen && (
                  <p className="mt-1 text-sm text-red-600">{errors.HoTen}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nhập email"
                />
                {errors.Email && (
                  <p className="mt-1 text-sm text-red-600">{errors.Email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="SoDienThoai"
                  value={formData.SoDienThoai}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nhập số điện thoại"
                />
                {errors.SoDienThoai && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.SoDienThoai}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CCCD *
                </label>
                <input
                  type="text"
                  name="CCCD"
                  value={formData.CCCD}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nhập số CCCD"
                />
                {errors.CCCD && (
                  <p className="mt-1 text-sm text-red-600">{errors.CCCD}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  name="NgaySinh"
                  value={formData.NgaySinh}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.NgaySinh && (
                  <p className="mt-1 text-sm text-red-600">{errors.NgaySinh}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính
                </label>
                <select
                  name="GioiTinh"
                  value={formData.GioiTinh}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <textarea
                  name="DiaChi"
                  value={formData.DiaChi}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {mode === "create" ? "Thêm mới" : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
