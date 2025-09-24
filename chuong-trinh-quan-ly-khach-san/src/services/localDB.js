// Local Storage Database Service
import vaiTroData from "../data/vaitro.json";
import nhanVienData from "../data/nhanvien.json";
import khachHangData from "../data/khachhang.json";
import phongData from "../data/phong.json";
import loaiPhongData from "../data/loaiphong.json";
import datPhongData from "../data/datphong.json";
import dichVuData from "../data/dichvu.json";
import hoaDonData from "../data/hoadon.json";

class LocalStorageDB {
  constructor() {
    this.initializeData();
  }

  // Initialize data in localStorage if not exists
  initializeData() {
    const tables = {
      roles: vaiTroData,
      staff: nhanVienData,
      customers: khachHangData,
      rooms: phongData,
      roomTypes: loaiPhongData,
      bookings: datPhongData,
      services: dichVuData,
      invoices: hoaDonData,
    };

    Object.keys(tables).forEach((tableName) => {
      if (!localStorage.getItem(tableName)) {
        localStorage.setItem(tableName, JSON.stringify(tables[tableName]));
      }
    });
  }

  // Generic CRUD operations
  getAll(tableName) {
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : [];
  }

  getById(tableName, id, idField) {
    const data = this.getAll(tableName);
    return data.find((item) => item[idField] === id);
  }

  create(tableName, newItem) {
    const data = this.getAll(tableName);
    data.push(newItem);
    localStorage.setItem(tableName, JSON.stringify(data));
    return newItem;
  }

  update(tableName, id, updatedItem, idField) {
    const data = this.getAll(tableName);
    const index = data.findIndex((item) => item[idField] === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem };
      localStorage.setItem(tableName, JSON.stringify(data));
      return data[index];
    }
    throw new Error(`Item with ${idField} ${id} not found`);
  }

  delete(tableName, id, idField) {
    const data = this.getAll(tableName);
    const filteredData = data.filter((item) => item[idField] !== id);
    localStorage.setItem(tableName, JSON.stringify(filteredData));
    return true;
  }

  // Reset data to original state
  resetData() {
    const tables = {
      roles: vaiTroData,
      staff: nhanVienData,
      customers: khachHangData,
      rooms: phongData,
      roomTypes: loaiPhongData,
      bookings: datPhongData,
      services: dichVuData,
      invoices: hoaDonData,
    };

    Object.keys(tables).forEach((tableName) => {
      localStorage.setItem(tableName, JSON.stringify(tables[tableName]));
    });
  }

  // Export data (for backup)
  exportData() {
    const data = {};
    const tableNames = [
      "roles",
      "staff",
      "customers",
      "rooms",
      "roomTypes",
      "bookings",
      "services",
      "invoices",
    ];

    tableNames.forEach((tableName) => {
      data[tableName] = this.getAll(tableName);
    });

    return data;
  }

  // Import data (for restore)
  importData(data) {
    Object.keys(data).forEach((tableName) => {
      localStorage.setItem(tableName, JSON.stringify(data[tableName]));
    });
  }
}

// Create singleton instance
const localDB = new LocalStorageDB();

export default localDB;
