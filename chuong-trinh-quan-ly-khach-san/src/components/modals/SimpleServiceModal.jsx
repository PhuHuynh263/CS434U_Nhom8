import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const SimpleServiceModal = ({ isOpen, onClose, service, onSave }) => {
  const { showNotification } = useApp();
  const [formData, setFormData] = useState({
    TenDichVu: "",
    MoTa: "",
    Gia: 0,
    DonVi: "Lần",
    TrangThai: "HoatDong",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        TenDichVu: service.TenDichVu || "",
        MoTa: service.MoTa || "",
        Gia: service.Gia || 0,
        DonVi: service.DonVi || "Lần",
        TrangThai: service.TrangThai || "HoatDong",
      });
    } else {
      setFormData({
        TenDichVu: "",
        MoTa: "",
        Gia: 0,
        DonVi: "Lần",
        TrangThai: "HoatDong",
      });
    }
  }, [service, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.TenDichVu.trim()) {
      showNotification("Vui lòng nhập tên dịch vụ", "error");
      return;
    }
    if (formData.Gia < 0) {
      showNotification("Giá dịch vụ không được âm", "error");
      return;
    }

    onSave(formData);
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
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1f2937",
          }}
        >
          {service ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "4px",
                color: "#374151",
              }}
            >
              Tên dịch vụ *
            </label>
            <input
              type="text"
              name="TenDichVu"
              value={formData.TenDichVu}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
              placeholder="Nhập tên dịch vụ"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                name="Gia"
                value={formData.Gia}
                onChange={handleInputChange}
                min="0"
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
                placeholder="0"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Đơn vị
              </label>
              <select
                name="DonVi"
                value={formData.DonVi}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="Lần">Lần</option>
                <option value="Giờ">Giờ</option>
                <option value="Ngày">Ngày</option>
                <option value="Cái">Cái</option>
                <option value="Suất">Suất</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "4px",
                color: "#374151",
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
              <option value="HoatDong">Hoạt động</option>
              <option value="TamNgung">Tạm ngưng</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "4px",
                color: "#374151",
              }}
            >
              Mô tả
            </label>
            <textarea
              name="MoTa"
              value={formData.MoTa}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
              }}
              placeholder="Mô tả chi tiết về dịch vụ..."
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
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#3b82f6",
                color: "white",
                cursor: "pointer",
              }}
            >
              {service ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleServiceModal;
