# Hotel Management Backend API

Backend API cho hệ thống quản lý khách sạn sử dụng Node.js và Express.

## Cài đặt

1. Cài đặt dependencies:
```bash
cd backend
npm install
```

2. Chạy server:
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên port 3001: http://localhost:3001

## API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Khách hàng (Customers)
- `GET /api/customers` - Lấy tất cả khách hàng
- `GET /api/customers/:id` - Lấy khách hàng theo ID
- `POST /api/customers` - Tạo khách hàng mới
- `PUT /api/customers/:id` - Cập nhật khách hàng
- `DELETE /api/customers/:id` - Xóa khách hàng

### Phòng (Rooms)
- `GET /api/rooms` - Lấy tất cả phòng
- `GET /api/rooms/types` - Lấy tất cả loại phòng
- `GET /api/rooms/:id` - Lấy phòng theo ID
- `GET /api/rooms/available/:date` - Lấy phòng trống theo ngày
- `POST /api/rooms` - Tạo phòng mới
- `PUT /api/rooms/:id` - Cập nhật phòng
- `DELETE /api/rooms/:id` - Xóa phòng

### Đặt phòng (Bookings)
- `GET /api/bookings` - Lấy tất cả đặt phòng
- `GET /api/bookings/:id` - Lấy đặt phòng theo ID
- `GET /api/bookings/customer/:customerId` - Lấy đặt phòng theo khách hàng
- `POST /api/bookings` - Tạo đặt phòng mới
- `PUT /api/bookings/:id` - Cập nhật đặt phòng
- `DELETE /api/bookings/:id` - Xóa đặt phòng

### Dịch vụ (Services)
- `GET /api/services` - Lấy tất cả dịch vụ
- `GET /api/services/:id` - Lấy dịch vụ theo ID
- `POST /api/services` - Tạo dịch vụ mới
- `PUT /api/services/:id` - Cập nhật dịch vụ
- `DELETE /api/services/:id` - Xóa dịch vụ

### Hóa đơn (Invoices)
- `GET /api/invoices` - Lấy tất cả hóa đơn
- `GET /api/invoices/:id` - Lấy hóa đơn theo ID
- `GET /api/invoices/customer/:customerId` - Lấy hóa đơn theo khách hàng
- `POST /api/invoices` - Tạo hóa đơn mới
- `PUT /api/invoices/:id` - Cập nhật hóa đơn
- `DELETE /api/invoices/:id` - Xóa hóa đơn
- `PATCH /api/invoices/:id/status` - Cập nhật trạng thái hóa đơn

### Nhân viên (Staff)
- `GET /api/staff` - Lấy tất cả nhân viên
- `GET /api/staff/roles` - Lấy tất cả vai trò
- `GET /api/staff/:id` - Lấy nhân viên theo ID
- `POST /api/staff` - Tạo nhân viên mới
- `PUT /api/staff/:id` - Cập nhật nhân viên
- `DELETE /api/staff/:id` - Xóa nhân viên

## Cấu trúc dự án

```
backend/
├── src/
│   ├── app.js              # Entry point
│   ├── data/               # JSON data files
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── package.json
└── README.md
```

## Response Format

Tất cả API đều trả về JSON với format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## CORS

Backend đã được cấu hình CORS để cho phép frontend gọi API từ domain khác.

## Dependencies

- `express`: Web framework
- `cors`: Enable CORS
- `body-parser`: Parse request body
- `uuid`: Generate unique IDs
- `nodemon`: Development tool (auto restart)