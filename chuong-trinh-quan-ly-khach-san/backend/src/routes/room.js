const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/rooms - Lấy tất cả phòng
router.get('/', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    res.json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms'
    });
  }
});

// GET /api/rooms/types - Lấy tất cả loại phòng
router.get('/types', (req, res) => {
  try {
    const roomTypes = dataService.getRoomTypes();
    res.json({
      success: true,
      data: roomTypes,
      count: roomTypes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch room types'
    });
  }
});

// GET /api/rooms/:id - Lấy phòng theo ID
router.get('/:id', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    const room = rooms.find(r => r.MaPhong === req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch room'
    });
  }
});

// POST /api/rooms - Tạo phòng mới
router.post('/', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    const newRoom = {
      MaPhong: req.body.MaPhong || `P${String(dataService.generateId(rooms, 'MaPhong')).padStart(3, '0')}`,
      ...req.body,
      NgayTao: new Date().toISOString()
    };
    
    // Kiểm tra trùng mã phòng
    const existingRoom = rooms.find(r => r.MaPhong === newRoom.MaPhong);
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        error: 'Room ID already exists'
      });
    }
    
    rooms.push(newRoom);
    
    if (dataService.saveRooms(rooms)) {
      res.status(201).json({
        success: true,
        data: newRoom,
        message: 'Room created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save room'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create room'
    });
  }
});

// PUT /api/rooms/:id - Cập nhật phòng
router.put('/:id', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    const roomIndex = rooms.findIndex(r => r.MaPhong === req.params.id);
    
    if (roomIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      ...req.body,
      MaPhong: req.params.id,
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveRooms(rooms)) {
      res.json({
        success: true,
        data: rooms[roomIndex],
        message: 'Room updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save room'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update room'
    });
  }
});

// DELETE /api/rooms/:id - Xóa phòng
router.delete('/:id', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    const roomIndex = rooms.findIndex(r => r.MaPhong === req.params.id);
    
    if (roomIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    const deletedRoom = rooms.splice(roomIndex, 1)[0];
    
    if (dataService.saveRooms(rooms)) {
      res.json({
        success: true,
        data: deletedRoom,
        message: 'Room deleted successfully'
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
      error: 'Failed to delete room'
    });
  }
});

// GET /api/rooms/available/:date - Lấy phòng trống theo ngày
router.get('/available/:date', (req, res) => {
  try {
    const rooms = dataService.getRooms();
    const bookings = dataService.getBookings();
    const targetDate = new Date(req.params.date);
    
    // Logic để kiểm tra phòng trống (cần được cải thiện)
    const availableRooms = rooms.filter(room => {
      const roomBookings = bookings.filter(booking => 
        booking.MaLoaiPhong === room.MaLoaiPhong &&
        new Date(booking.NgayDen) <= targetDate &&
        new Date(booking.NgayDi) > targetDate
      );
      return roomBookings.length === 0;
    });
    
    res.json({
      success: true,
      data: availableRooms,
      count: availableRooms.length,
      date: req.params.date
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available rooms'
    });
  }
});

module.exports = router;