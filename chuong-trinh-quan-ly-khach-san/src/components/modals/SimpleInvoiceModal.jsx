import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const SimpleInvoiceModal = ({
  isOpen,
  onClose,
  invoice,
  onSave,
  customers = [],
  bookings = [],
  services = [],
}) => {
  const { showNotification } = useApp();
  const [formData, setFormData] = useState({
    MaKhachHang: "",
    MaDatPhong: "",
    MaDichVu: "",
    SoLuong: 1,
    DonGia: 0,
    TongTien: 0,
    TrangThai: "ChuaThanhToan",
    GhiChu: "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        MaKhachHang: invoice.MaKhachHang || "",
        MaDatPhong: invoice.MaDatPhong || "",
        MaDichVu: invoice.MaDichVu || "",
        SoLuong: invoice.SoLuong || 1,
        DonGia: invoice.DonGia || 0,
        TongTien: invoice.TongTien || 0,
        TrangThai: invoice.TrangThai || "ChuaThanhToan",
        GhiChu: invoice.GhiChu || "",
      });
    } else {
      setFormData({
        MaKhachHang: "",
        MaDatPhong: "",
        MaDichVu: "",
        SoLuong: 1,
        DonGia: 0,
        TongTien: 0,
        TrangThai: "ChuaThanhToan",
        GhiChu: "",
      });
    }
  }, [invoice, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Tự động tính toán tổng tiền khi thay đổi số lượng hoặc đơn giá
    if (name === "SoLuong" || name === "DonGia") {
      const soLuong =
        parseFloat(name === "SoLuong" ? value : newFormData.SoLuong) || 0;
      const donGia =
        parseFloat(name === "DonGia" ? value : newFormData.DonGia) || 0;
      newFormData.TongTien = soLuong * donGia;
    }

    // Tự động cập nhật đơn giá khi chọn dịch vụ
    if (name === "MaDichVu") {
      const selectedService = services.find((s) => s.MaDichVu === value);
      if (selectedService) {
        newFormData.DonGia = selectedService.Gia || 0;
        const soLuong = parseFloat(newFormData.SoLuong) || 0;
        newFormData.TongTien = soLuong * newFormData.DonGia;
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.MaKhachHang.trim()) {
      showNotification("Vui lòng chọn khách hàng", "error");
      return;
    }
    if (!formData.MaDatPhong.trim()) {
      showNotification("Vui lòng chọn đặt phòng", "error");
      return;
    }
    if (formData.TongTien <= 0) {
      showNotification("Tổng tiền phải lớn hơn 0", "error");
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
          maxWidth: "600px",
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
          {invoice ? "Cập nhật hóa đơn" : "Thêm hóa đơn mới"}
        </h2>

        <form onSubmit={handleSubmit}>
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
                Khách hàng *
              </label>
              <select
                name="MaKhachHang"
                value={formData.MaKhachHang}
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
                <option value="">Chọn khách hàng</option>
                {customers.map((customer) => (
                  <option
                    key={customer.MaKhachHang}
                    value={customer.MaKhachHang}
                  >
                    {customer.HoTen} - {customer.MaKhachHang}
                  </option>
                ))}
              </select>
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
                Đặt phòng *
              </label>
              <select
                name="MaDatPhong"
                value={formData.MaDatPhong}
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
                <option value="">Chọn đặt phòng</option>
                {bookings.map((booking) => (
                  <option key={booking.MaDatPhong} value={booking.MaDatPhong}>
                    {booking.MaDatPhong} - Phòng {booking.MaPhong}
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
                Dịch vụ
              </label>
              <select
                name="MaDichVu"
                value={formData.MaDichVu}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="">Chọn dịch vụ (tùy chọn)</option>
                {services.map((service) => (
                  <option key={service.MaDichVu} value={service.MaDichVu}>
                    {service.TenDichVu} - {service.Gia?.toLocaleString("vi-VN")}
                    đ
                  </option>
                ))}
              </select>
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
                Số lượng
              </label>
              <input
                type="number"
                name="SoLuong"
                value={formData.SoLuong}
                onChange={handleInputChange}
                min="1"
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
                Đơn giá (VNĐ)
              </label>
              <input
                type="number"
                name="DonGia"
                value={formData.DonGia}
                onChange={handleInputChange}
                min="0"
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
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Tổng tiền (VNĐ)
              </label>
              <input
                type="number"
                name="TongTien"
                value={formData.TongTien}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "#f9fafb",
                }}
                readOnly
              />
            </div>
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
                <option value="ChuaThanhToan">Chưa thanh toán</option>
                <option value="DaThanhToan">Đã thanh toán</option>
                <option value="DaHuy">Đã hủy</option>
              </select>
            </div>
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
              Ghi chú
            </label>
            <textarea
              name="GhiChu"
              value={formData.GhiChu}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
              }}
              placeholder="Ghi chú về hóa đơn..."
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
              {invoice ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleInvoiceModal;
