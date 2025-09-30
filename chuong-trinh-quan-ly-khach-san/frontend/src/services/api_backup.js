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
        NgayTao: new Date().toISOString().split('T')[0]
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
    return { success: true, data: khachHangData };
  },

  getById: async (id) => {
    await delay(300);
    const customer = khachHangData.find((kh) => kh.MaKhachHang === id);
    if (customer) {
      return { success: true, data: customer };
    }
    throw new Error("Customer not found");
  },

  create: async (customerData) => {
    await delay(800);
    return {
      success: true,
      data: { ...customerData, MaKhachHang: `KH${Date.now()}` },
    };
  },

  update: async (id, customerData) => {
    await delay(800);
    return { success: true, data: { ...customerData, MaKhachHang: id } };
  },

  delete: async (id) => {
    await delay(500);
    return { success: true };
  },
};

// Rooms API
export const roomsAPI = {
  getAll: async () => {
    await delay(500);
    return { success: true, data: phongData };
  },

  getById: async (id) => {
    await delay(300);
    const room = phongData.find((p) => p.MaPhong === id);
    if (room) {
      return { success: true, data: room };
    }
    throw new Error("Room not found");
  },

  getAvailable: async (checkIn, checkOut) => {
    await delay(500);
    // In real app, this would check availability based on dates
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
    return { success: true, data: loaiPhongData };
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    await delay(500);
    return { success: true, data: datPhongData };
  },

  getById: async (id) => {
    await delay(300);
    const booking = datPhongData.find((dp) => dp.MaDatPhong === id);
    if (booking) {
      return { success: true, data: booking };
    }
    throw new Error("Booking not found");
  },

  create: async (bookingData) => {
    await delay(800);
    return {
      success: true,
      data: {
        ...bookingData,
        MaDatPhong: `DP${Date.now()}`,
        NgayTao: new Date().toISOString(),
      },
    };
  },

  update: async (id, bookingData) => {
    await delay(800);
    return { success: true, data: { ...bookingData, MaDatPhong: id } };
  },

  delete: async (id) => {
    await delay(500);
    return { success: true };
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    await delay(500);
    return { success: true, data: dichVuData };
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    await delay(500);
    return { success: true, data: hoaDonData };
  },

  getById: async (id) => {
    await delay(300);
    const invoice = hoaDonData.find((hd) => hd.MaHoaDon === id);
    if (invoice) {
      return { success: true, data: invoice };
    }
    throw new Error("Invoice not found");
  },

  create: async (invoiceData) => {
    await delay(800);
    return {
      success: true,
      data: {
        ...invoiceData,
        MaHoaDon: `HD${Date.now()}`,
        NgayLap: new Date().toISOString(),
      },
    };
  },

  pay: async (id, paymentData) => {
    await delay(1000);
    return {
      success: true,
      data: {
        ...paymentData,
        MaHoaDon: id,
        TrangThai: "Đã thanh toán",
        NgayThanhToan: new Date().toISOString(),
      },
    };
  },
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    await delay(800);

    const totalRooms = phongData.length;
    const occupiedRooms = phongData.filter(
      (room) => room.TinhTrang !== "Trống"
    ).length;
    const totalBookings = datPhongData.length;
    const totalRevenue = hoaDonData.reduce(
      (sum, invoice) => sum + invoice.TongTien,
      0
    );

    return {
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        occupancyRate: ((occupiedRooms / totalRooms) * 100).toFixed(1),
        totalBookings,
        totalRevenue,
        totalCustomers: khachHangData.length,
        totalStaff: nhanVienData.length,
      },
    };
  },
};
