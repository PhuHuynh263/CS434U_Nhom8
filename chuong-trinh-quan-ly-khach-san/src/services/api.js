// Mock API service để simulate real API calls
import localDB from "./localDB.js";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    await delay(1000);
    const nhanVienData = localDB.getAll("staff");
    const user = nhanVienData.find(
      (nv) => nv.Email === email && nv.password === password
    );
    if (user) {
      return { success: true, data: user };
    }
    throw new Error("Invalid credentials");
  },

  logout: async () => {
    await delay(500);
    localStorage.removeItem("user");
    return { success: true };
  },
};

// Roles API
export const rolesAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("roles");
    return { success: true, data };
  },
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("staff");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const staff = localDB.getById("staff", id, "MaNhanVien");
    if (staff) {
      return { success: true, data: staff };
    }
    throw new Error("Staff not found");
  },

  create: async (staffData) => {
    await delay(800);
    try {
      const newStaff = {
        MaNhanVien: `NV${Date.now()}`,
        ...staffData,
        NgayTao: new Date().toISOString().split("T")[0],
      };
      const result = localDB.create("staff", newStaff);
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to create staff");
    }
  },

  update: async (id, staffData) => {
    await delay(800);
    try {
      const result = localDB.update("staff", id, staffData, "MaNhanVien");
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update staff");
    }
  },

  delete: async (id) => {
    await delay(600);
    try {
      localDB.delete("staff", id, "MaNhanVien");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete staff");
    }
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("customers");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const customer = localDB.getById("customers", id, "MaKhachHang");
    if (customer) {
      return { success: true, data: customer };
    }
    throw new Error("Customer not found");
  },

  create: async (customerData) => {
    await delay(800);
    try {
      const newCustomer = {
        MaKhachHang: `KH${Date.now()}`,
        ...customerData,
        NgayDangKy: new Date().toISOString().split("T")[0],
      };
      const result = localDB.create("customers", newCustomer);
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to create customer");
    }
  },

  update: async (id, customerData) => {
    await delay(800);
    try {
      const result = localDB.update(
        "customers",
        id,
        customerData,
        "MaKhachHang"
      );
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update customer");
    }
  },

  delete: async (id) => {
    await delay(600);
    try {
      localDB.delete("customers", id, "MaKhachHang");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete customer");
    }
  },
};

// Rooms API
export const roomsAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("rooms");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const room = localDB.getById("rooms", id, "MaPhong");
    if (room) {
      return { success: true, data: room };
    }
    throw new Error("Room not found");
  },

  getAvailable: async (checkIn, checkOut) => {
    await delay(500);
    const phongData = localDB.getAll("rooms");
    const datPhongData = localDB.getAll("bookings");
    // Filter available rooms
    const availableRooms = phongData.filter(
      (room) => room.TinhTrang === "Trống"
    );
    return { success: true, data: availableRooms };
  },
};

// Room Types API
export const roomTypesAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("roomTypes");
    return { success: true, data };
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("bookings");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const booking = localDB.getById("bookings", id, "MaDatPhong");
    if (booking) {
      return { success: true, data: booking };
    }
    throw new Error("Booking not found");
  },

  create: async (bookingData) => {
    await delay(800);
    try {
      const newBooking = {
        MaDatPhong: `DP${Date.now()}`,
        ...bookingData,
        NgayDat: new Date().toISOString().split("T")[0],
        TrangThai: "DaDat",
      };
      const result = localDB.create("bookings", newBooking);
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to create booking");
    }
  },

  update: async (id, bookingData) => {
    await delay(800);
    try {
      const result = localDB.update("bookings", id, bookingData, "MaDatPhong");
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update booking");
    }
  },

  delete: async (id) => {
    await delay(600);
    try {
      localDB.delete("bookings", id, "MaDatPhong");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete booking");
    }
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("services");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const service = localDB.getById("services", id, "MaDichVu");
    if (service) {
      return { success: true, data: service };
    }
    throw new Error("Service not found");
  },

  create: async (serviceData) => {
    await delay(800);
    try {
      const newService = {
        MaDichVu: `DV${Date.now()}`,
        ...serviceData,
      };
      const result = localDB.create("services", newService);
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to create service");
    }
  },

  update: async (id, serviceData) => {
    await delay(800);
    try {
      const result = localDB.update("services", id, serviceData, "MaDichVu");
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update service");
    }
  },

  delete: async (id) => {
    await delay(600);
    try {
      localDB.delete("services", id, "MaDichVu");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete service");
    }
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    await delay(500);
    const data = localDB.getAll("invoices");
    return { success: true, data };
  },

  getById: async (id) => {
    await delay(300);
    const invoice = localDB.getById("invoices", id, "MaHoaDon");
    if (invoice) {
      return { success: true, data: invoice };
    }
    throw new Error("Invoice not found");
  },

  create: async (invoiceData) => {
    await delay(800);
    try {
      const newInvoice = {
        MaHoaDon: `HD${Date.now()}`,
        ...invoiceData,
        NgayLap: new Date().toISOString().split("T")[0],
        TrangThai: "ChuaThanhToan",
      };
      const result = localDB.create("invoices", newInvoice);
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to create invoice");
    }
  },

  update: async (id, invoiceData) => {
    await delay(800);
    try {
      const result = localDB.update("invoices", id, invoiceData, "MaHoaDon");
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update invoice");
    }
  },

  delete: async (id) => {
    await delay(600);
    try {
      localDB.delete("invoices", id, "MaHoaDon");
      return { success: true };
    } catch (error) {
      throw new Error("Failed to delete invoice");
    }
  },

  updateStatus: async (id, status) => {
    await delay(500);
    try {
      const result = localDB.update(
        "invoices",
        id,
        { TrangThai: status },
        "MaHoaDon"
      );
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to update invoice status");
    }
  },

  pay: async (id, paymentData) => {
    await delay(1000);
    try {
      const result = localDB.update(
        "invoices",
        id,
        {
          ...paymentData,
          TrangThai: "DaThanhToan",
          NgayThanhToan: new Date().toISOString().split("T")[0],
        },
        "MaHoaDon"
      );
      return { success: true, data: result };
    } catch (error) {
      throw new Error("Failed to process payment");
    }
  },
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    await delay(800);

    const phongData = localDB.getAll("rooms");
    const datPhongData = localDB.getAll("bookings");
    const hoaDonData = localDB.getAll("invoices");
    const khachHangData = localDB.getAll("customers");
    const nhanVienData = localDB.getAll("staff");

    const totalRooms = phongData.length;
    const occupiedRooms = phongData.filter(
      (room) => room.TinhTrang !== "Trống"
    ).length;
    const totalBookings = datPhongData.length;
    const totalRevenue = hoaDonData.reduce(
      (sum, invoice) => sum + (invoice.TongTien || 0),
      0
    );

    return {
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupancyRate:
          totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0,
        totalBookings,
        totalRevenue,
        totalCustomers: khachHangData.length,
        totalStaff: nhanVienData.length,
        pendingPayments: hoaDonData.filter(
          (invoice) => invoice.TrangThai === "ChuaThanhToan"
        ).length,
      },
    };
  },

  getRecentActivities: async () => {
    await delay(500);
    // Mock recent activities based on actual data
    const activities = [
      {
        id: 1,
        type: "booking",
        message: "Đặt phòng mới từ khách hàng",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 2,
        type: "payment",
        message: "Thanh toán hóa đơn",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: 3,
        type: "checkin",
        message: "Khách hàng check-in",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
    ];

    return { success: true, data: activities };
  },
};
