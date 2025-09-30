const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/bookings - Lấy tất cả đặt phòng
router.get('/', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/:id - Lấy đặt phòng theo ID
router.get('/:id', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    const booking = bookings.find(b => b.MaDatPhong === req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// POST /api/bookings - Tạo đặt phòng mới
router.post('/', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    const newBooking = {
      MaDatPhong: `DP${String(dataService.generateId(bookings, 'MaDatPhong')).padStart(3, '0')}`,
      ...req.body,
      NgayTao: new Date().toISOString(),
      TrangThai: req.body.TrangThai || "Chờ xác nhận"
    };
    
    bookings.push(newBooking);
    
    if (dataService.saveBookings(bookings)) {
      res.status(201).json({
        success: true,
        data: newBooking,
        message: 'Booking created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save booking'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// PUT /api/bookings/:id - Cập nhật đặt phòng
router.put('/:id', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    const bookingIndex = bookings.findIndex(b => b.MaDatPhong === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...req.body,
      MaDatPhong: req.params.id,
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveBookings(bookings)) {
      res.json({
        success: true,
        data: bookings[bookingIndex],
        message: 'Booking updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save booking'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update booking'
    });
  }
});

// DELETE /api/bookings/:id - Xóa đặt phòng
router.delete('/:id', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    const bookingIndex = bookings.findIndex(b => b.MaDatPhong === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    const deletedBooking = bookings.splice(bookingIndex, 1)[0];
    
    if (dataService.saveBookings(bookings)) {
      res.json({
        success: true,
        data: deletedBooking,
        message: 'Booking deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save changes'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete booking'
    });
  }
});

// GET /api/bookings/customer/:customerId - Lấy đặt phòng theo khách hàng
router.get('/customer/:customerId', (req, res) => {
  try {
    const bookings = dataService.getBookings();
    const customerBookings = bookings.filter(b => b.MaKhachHang === req.params.customerId);
    
    res.json({
      success: true,
      data: customerBookings,
      count: customerBookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer bookings'
    });
  }
});

module.exports = router;