import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { rolesAPI } from "../../services/api";
import { useApp } from "../../context/AppContext";

const SimpleStaffModal = ({ isOpen, onClose, onSave, staff }) => {
  const [formData, setFormData] = useState({
    TenNhanVien: "",
    Email: "",
    SoDienThoai: "",
    CCCD: "",
    ChucVu: "",
    MaVaiTro: "",
    TrangThai: "Hoạt động",
    MatKhau: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useApp();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await rolesAPI.getAll();
        setRoles(response.data);
      } catch (error) {
        console.error("Error loading roles:", error);
        showNotification("Lỗi khi tải danh sách vai trò", "error");
      }
    };

    if (isOpen) {
      loadRoles();
    }
  }, [isOpen, showNotification]);

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        TenNhanVien: "",
        Email: "",
        SoDienThoai: "",
        CCCD: "",
        ChucVu: "",
        MaVaiTro: "",
        TrangThai: "Hoạt động",
        MatKhau: "",
      });
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.TenNhanVien ||
        !formData.Email ||
        !formData.SoDienThoai ||
        !formData.CCCD ||
        !formData.ChucVu ||
        !formData.MaVaiTro
      ) {
        showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.Email)) {
        showNotification("Email không hợp lệ", "error");
        return;
      }

      // Validate phone number (Vietnamese format)
      const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.SoDienThoai)) {
        showNotification("Số điện thoại không hợp lệ", "error");
        return;
      }

      // Validate CCCD (12 digits)
      if (formData.CCCD.length !== 12 || !/^\d+$/.test(formData.CCCD)) {
        showNotification("CCCD phải có 12 chữ số", "error");
        return;
      }

      // If creating new staff, password is required
      if (!staff && !formData.MatKhau) {
        showNotification("Mật khẩu là bắt buộc khi tạo nhân viên mới", "error");
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        NgayTao: staff ? staff.NgayTao : new Date().toISOString(),
        NgayCapNhat: new Date().toISOString(),
      };

      // If editing and password is empty, remove it from submission
      if (staff && !formData.MatKhau) {
        delete submitData.MatKhau;
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving staff:", error);
      showNotification("Lỗi khi lưu thông tin nhân viên", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
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
          <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
            {staff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "4px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            <XMarkIcon style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "16px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Tên nhân viên *
                </label>
                <input
                  type="text"
                  name="TenNhanVien"
                  value={formData.TenNhanVien}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
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
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
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
                  required
                  placeholder="0xxxxxxxxx"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  CCCD *
                </label>
                <input
                  type="text"
                  name="CCCD"
                  value={formData.CCCD}
                  onChange={handleInputChange}
                  required
                  placeholder="12 chữ số"
                  maxLength="12"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Chức vụ *
                </label>
                <input
                  type="text"
                  name="ChucVu"
                  value={formData.ChucVu}
                  onChange={handleInputChange}
                  required
                  placeholder="VD: Nhân viên lễ tân, Quản lý..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Vai trò *
                </label>
                <select
                  name="MaVaiTro"
                  value={formData.MaVaiTro}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.MaVaiTro} value={role.MaVaiTro}>
                      {role.TenVaiTro}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Trạng thái
                </label>
                <select
                  name="TrangThai"
                  value={formData.TrangThai}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                  <option value="Tạm nghỉ">Tạm nghỉ</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Mật khẩu {!staff && "*"}
                </label>
                <input
                  type="password"
                  name="MatKhau"
                  value={formData.MatKhau}
                  onChange={handleInputChange}
                  required={!staff}
                  placeholder={
                    staff ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: loading ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Đang lưu..." : staff ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleStaffModal;
