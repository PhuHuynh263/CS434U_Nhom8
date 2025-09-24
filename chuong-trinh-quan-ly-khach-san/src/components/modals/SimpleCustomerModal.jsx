import { useState, useEffect } from "react";

const SimpleCustomerModal = ({
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
    CMND_HoChieu: "",
    NgayDangKy: "",
    GioiTinh: "Nam",
  });

  const [errors, setErrors] = useState({});

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        HoTen: customer.HoTen || "",
        Email: customer.Email || "",
        SoDienThoai: customer.SoDienThoai || "",
        DiaChi: customer.DiaChi || "",
        CMND_HoChieu: customer.CMND_HoChieu || "",
        NgayDangKy: formatDateForInput(customer.NgayDangKy),
        GioiTinh: customer.GioiTinh || "Nam",
      });
    } else {
      setFormData({
        HoTen: "",
        Email: "",
        SoDienThoai: "",
        DiaChi: "",
        CMND_HoChieu: "",
        NgayDangKy: "",
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

    if (!formData.CMND_HoChieu.trim()) {
      newErrors.CMND_HoChieu = "CCCD/CMND là bắt buộc";
    } else if (!/^[0-9]{9,12}$/.test(formData.CMND_HoChieu)) {
      newErrors.CMND_HoChieu = "CCCD/CMND phải có 9-12 chữ số";
    }

    if (!formData.NgayDangKy) {
      newErrors.NgayDangKy = "Ngày đăng ký là bắt buộc";
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
            {mode === "create" ? "Thêm khách hàng mới" : "Chỉnh sửa khách hàng"}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Họ tên *
            </label>
            <input
              type="text"
              name="HoTen"
              value={formData.HoTen}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="Nhập họ tên"
            />
            {errors.HoTen && (
              <p
                style={{ color: "red", fontSize: "12px", margin: "4px 0 0 0" }}
              >
                {errors.HoTen}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Email *
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="Nhập email"
            />
            {errors.Email && (
              <p
                style={{ color: "red", fontSize: "12px", margin: "4px 0 0 0" }}
              >
                {errors.Email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="Nhập số điện thoại"
            />
            {errors.SoDienThoai && (
              <p
                style={{ color: "red", fontSize: "12px", margin: "4px 0 0 0" }}
              >
                {errors.SoDienThoai}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              CCCD/CMND *
            </label>
            <input
              type="text"
              name="CMND_HoChieu"
              value={formData.CMND_HoChieu}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="Nhập số CCCD/CMND"
            />
            {errors.CMND_HoChieu && (
              <p
                style={{ color: "red", fontSize: "12px", margin: "4px 0 0 0" }}
              >
                {errors.CMND_HoChieu}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Ngày đăng ký *
            </label>
            <input
              type="date"
              name="NgayDangKy"
              value={formData.NgayDangKy}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            {errors.NgayDangKy && (
              <p
                style={{ color: "red", fontSize: "12px", margin: "4px 0 0 0" }}
              >
                {errors.NgayDangKy}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Giới tính
            </label>
            <select
              name="GioiTinh"
              value={formData.GioiTinh}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              Địa chỉ
            </label>
            <textarea
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
                resize: "vertical",
              }}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {mode === "create" ? "Thêm mới" : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleCustomerModal;
