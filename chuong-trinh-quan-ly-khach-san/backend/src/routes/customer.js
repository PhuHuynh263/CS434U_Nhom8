const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const { v4: uuidv4 } = require('uuid');

// GET /api/customers - Lấy tất cả khách hàng
router.get('/', (req, res) => {
  try {
    const customers = dataService.getCustomers();
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers'
    });
  }
});

// GET /api/customers/:id - Lấy khách hàng theo ID
router.get('/:id', (req, res) => {
  try {
    const customers = dataService.getCustomers();
    const customer = customers.find(c => c.MaKhachHang === req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer'
    });
  }
});

// POST /api/customers - Tạo khách hàng mới
router.post('/', (req, res) => {
  try {
    const customers = dataService.getCustomers();
    const newCustomer = {
      MaKhachHang: `KH${String(dataService.generateId(customers, 'MaKhachHang')).padStart(2, '0')}`,
      ...req.body,
      NgayTao: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    
    if (dataService.saveCustomers(customers)) {
      res.status(201).json({
        success: true,
        data: newCustomer,
        message: 'Customer created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save customer'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create customer'
    });
  }
});

// PUT /api/customers/:id - Cập nhật khách hàng
router.put('/:id', (req, res) => {
  try {
    const customers = dataService.getCustomers();
    const customerIndex = customers.findIndex(c => c.MaKhachHang === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...req.body,
      MaKhachHang: req.params.id, // Giữ nguyên ID
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveCustomers(customers)) {
      res.json({
        success: true,
        data: customers[customerIndex],
        message: 'Customer updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save customer'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update customer'
    });
  }
});

// DELETE /api/customers/:id - Xóa khách hàng
router.delete('/:id', (req, res) => {
  try {
    const customers = dataService.getCustomers();
    const customerIndex = customers.findIndex(c => c.MaKhachHang === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const deletedCustomer = customers.splice(customerIndex, 1)[0];
    
    if (dataService.saveCustomers(customers)) {
      res.json({
        success: true,
        data: deletedCustomer,
        message: 'Customer deleted successfully'
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
      error: 'Failed to delete customer'
    });
  }
});

module.exports = router;