import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const SimpleBookingModal = ({
  isOpen,
  onClose,
  booking,
  onSave,
  customers = [],
  rooms = [],
  roomTypes = [],
}) => {
  const { showNotification } = useApp();
  const [formData, setFormData] = useState({
    MaKhachHang: "",
    MaPhong: "",
    NgayNhan: "",
    NgayTra: "",
    SoLuongKhach: 1,
    GhiChu: "",
    TrangThai: "DaDat",
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        MaKhachHang: booking.MaKhachHang || "",
        MaPhong: booking.MaPhong || "",
        NgayNhan: booking.NgayNhan || "",
        NgayTra: booking.NgayTra || "",
        SoLuongKhach: booking.SoLuongKhach || 1,
        GhiChu: booking.GhiChu || "",
        TrangThai: booking.TrangThai || "DaDat",
      });
    } else {
      setFormData({
        MaKhachHang: "",
        MaPhong: "",
        NgayNhan: "",
        NgayTra: "",
        SoLuongKhach: 1,
        GhiChu: "",
        TrangThai: "DaDat",
      });
    }
  }, [booking, isOpen]);

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
    if (!formData.MaKhachHang.trim()) {
      showNotification("Vui lòng chọn khách hàng", "error");
      return;
    }
    if (!formData.MaPhong.trim()) {
      showNotification("Vui lòng chọn phòng", "error");
      return;
    }
    if (!formData.NgayNhan) {
      showNotification("Vui lòng nhập ngày nhận phòng", "error");
      return;
    }
    if (!formData.NgayTra) {
      showNotification("Vui lòng nhập ngày trả phòng", "error");
      return;
    }

    // Check dates
    const checkinDate = new Date(formData.NgayNhan);
    const checkoutDate = new Date(formData.NgayTra);
    if (checkoutDate <= checkinDate) {
      showNotification("Ngày trả phòng phải sau ngày nhận phòng", "error");
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
          {booking ? "Cập nhật đặt phòng" : "Thêm đặt phòng mới"}
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
                Phòng *
              </label>
              <select
                name="MaPhong"
                value={formData.MaPhong}
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
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.MaPhong} value={room.MaPhong}>
                    {room.TenPhong} - {room.MaPhong}
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
                Ngày nhận phòng *
              </label>
              <input
                type="date"
                name="NgayNhan"
                value={formData.NgayNhan}
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
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  color: "#374151",
                }}
              >
                Ngày trả phòng *
              </label>
              <input
                type="date"
                name="NgayTra"
                value={formData.NgayTra}
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
                Số lượng khách
              </label>
              <input
                type="number"
                name="SoLuongKhach"
                value={formData.SoLuongKhach}
                onChange={handleInputChange}
                min="1"
                max="10"
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
                <option value="DaDat">Đã đặt</option>
                <option value="DaNhan">Đã nhận</option>
                <option value="DaTra">Đã trả</option>
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
              placeholder="Ghi chú về đặt phòng..."
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
              {booking ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleBookingModal;
