const fs = require('fs');
const path = require('path');

class DataService {
  constructor() {
    this.dataPath = path.join(__dirname, '../data');
  }

  // Đọc dữ liệu từ file JSON
  readData(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  // Ghi dữ liệu vào file JSON
  writeData(filename, data) {
    try {
      const filePath = path.join(this.dataPath, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  // Tạo ID mới cho các entity
  generateId(data, idField = 'id') {
    if (!data || data.length === 0) return 1;
    
    const ids = data.map(item => {
      const id = item[idField];
      return typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) : id;
    }).filter(id => !isNaN(id));
    
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  // CRUD operations cho từng loại data
  
  // Khách hàng
  getCustomers() {
    return this.readData('khachhang.json');
  }

  saveCustomers(customers) {
    return this.writeData('khachhang.json', customers);
  }

  // Phòng
  getRooms() {
    return this.readData('phong.json');
  }

  saveRooms(rooms) {
    return this.writeData('phong.json', rooms);
  }

  // Loại phòng
  getRoomTypes() {
    return this.readData('loaiphong.json');
  }

  saveRoomTypes(roomTypes) {
    return this.writeData('loaiphong.json', roomTypes);
  }

  // Đặt phòng
  getBookings() {
    return this.readData('datphong.json');
  }

  saveBookings(bookings) {
    return this.writeData('datphong.json', bookings);
  }

  // Dịch vụ
  getServices() {
    return this.readData('dichvu.json');
  }

  saveServices(services) {
    return this.writeData('dichvu.json', services);
  }

  // Hóa đơn
  getInvoices() {
    return this.readData('hoadon.json');
  }

  saveInvoices(invoices) {
    return this.writeData('hoadon.json', invoices);
  }

  // Nhân viên
  getStaff() {
    return this.readData('nhanvien.json');
  }

  saveStaff(staff) {
    return this.writeData('nhanvien.json', staff);
  }

  // Trạng thái
  getStatuses() {
    return this.readData('trangthai.json');
  }

  // Vai trò
  getRoles() {
    return this.readData('vaitro.json');
  }
}

module.exports = new DataService();