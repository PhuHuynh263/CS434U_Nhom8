const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/staff - Lấy tất cả nhân viên
router.get('/', (req, res) => {
  try {
    const staff = dataService.getStaff();
    res.json({
      success: true,
      data: staff,
      count: staff.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff'
    });
  }
});

// GET /api/staff/roles - Lấy tất cả vai trò
router.get('/roles', (req, res) => {
  try {
    const roles = dataService.getRoles();
    res.json({
      success: true,
      data: roles,
      count: roles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roles'
    });
  }
});

// GET /api/staff/:id - Lấy nhân viên theo ID
router.get('/:id', (req, res) => {
  try {
    const staff = dataService.getStaff();
    const employee = staff.find(s => s.MaNhanVien === req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff member'
    });
  }
});

// POST /api/staff - Tạo nhân viên mới
router.post('/', (req, res) => {
  try {
    const staff = dataService.getStaff();
    const newStaff = {
      MaNhanVien: `NV${String(dataService.generateId(staff, 'MaNhanVien')).padStart(3, '0')}`,
      ...req.body,
      NgayTao: new Date().toISOString()
    };
    
    staff.push(newStaff);
    
    if (dataService.saveStaff(staff)) {
      res.status(201).json({
        success: true,
        data: newStaff,
        message: 'Staff member created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save staff member'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create staff member'
    });
  }
});

// PUT /api/staff/:id - Cập nhật nhân viên
router.put('/:id', (req, res) => {
  try {
    const staff = dataService.getStaff();
    const staffIndex = staff.findIndex(s => s.MaNhanVien === req.params.id);
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }
    
    staff[staffIndex] = {
      ...staff[staffIndex],
      ...req.body,
      MaNhanVien: req.params.id,
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveStaff(staff)) {
      res.json({
        success: true,
        data: staff[staffIndex],
        message: 'Staff member updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save staff member'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update staff member'
    });
  }
});

// DELETE /api/staff/:id - Xóa nhân viên
router.delete('/:id', (req, res) => {
  try {
    const staff = dataService.getStaff();
    const staffIndex = staff.findIndex(s => s.MaNhanVien === req.params.id);
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      });
    }
    
    const deletedStaff = staff.splice(staffIndex, 1)[0];
    
    if (dataService.saveStaff(staff)) {
      res.json({
        success: true,
        data: deletedStaff,
        message: 'Staff member deleted successfully'
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
      error: 'Failed to delete staff member'
    });
  }
});

module.exports = router;