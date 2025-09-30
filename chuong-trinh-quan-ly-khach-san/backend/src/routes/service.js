const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/services - Lấy tất cả dịch vụ
router.get('/', (req, res) => {
  try {
    const services = dataService.getServices();
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    });
  }
});

// GET /api/services/:id - Lấy dịch vụ theo ID
router.get('/:id', (req, res) => {
  try {
    const services = dataService.getServices();
    const service = services.find(s => s.MaDichVu == req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service'
    });
  }
});

// POST /api/services - Tạo dịch vụ mới
router.post('/', (req, res) => {
  try {
    const services = dataService.getServices();
    const newService = {
      MaDichVu: dataService.generateId(services, 'MaDichVu'),
      ...req.body,
      NgayTao: new Date().toISOString()
    };
    
    services.push(newService);
    
    if (dataService.saveServices(services)) {
      res.status(201).json({
        success: true,
        data: newService,
        message: 'Service created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save service'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create service'
    });
  }
});

// PUT /api/services/:id - Cập nhật dịch vụ
router.put('/:id', (req, res) => {
  try {
    const services = dataService.getServices();
    const serviceIndex = services.findIndex(s => s.MaDichVu == req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...req.body,
      MaDichVu: parseInt(req.params.id),
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveServices(services)) {
      res.json({
        success: true,
        data: services[serviceIndex],
        message: 'Service updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save service'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update service'
    });
  }
});

// DELETE /api/services/:id - Xóa dịch vụ
router.delete('/:id', (req, res) => {
  try {
    const services = dataService.getServices();
    const serviceIndex = services.findIndex(s => s.MaDichVu == req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }
    
    const deletedService = services.splice(serviceIndex, 1)[0];
    
    if (dataService.saveServices(services)) {
      res.json({
        success: true,
        data: deletedService,
        message: 'Service deleted successfully'
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
      error: 'Failed to delete service'
    });
  }
});

module.exports = router;