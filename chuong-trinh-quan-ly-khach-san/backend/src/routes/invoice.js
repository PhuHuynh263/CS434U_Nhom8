const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/invoices - Lấy tất cả hóa đơn
router.get('/', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// GET /api/invoices/:id - Lấy hóa đơn theo ID
router.get('/:id', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const invoice = invoices.find(i => i.MaHoaDon === req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice'
    });
  }
});

// POST /api/invoices - Tạo hóa đơn mới
router.post('/', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const newInvoice = {
      MaHoaDon: `HD${String(dataService.generateId(invoices, 'MaHoaDon')).padStart(3, '0')}`,
      ...req.body,
      NgayTao: new Date().toISOString(),
      TrangThai: req.body.TrangThai || "Chưa thanh toán"
    };
    
    invoices.push(newInvoice);
    
    if (dataService.saveInvoices(invoices)) {
      res.status(201).json({
        success: true,
        data: newInvoice,
        message: 'Invoice created successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save invoice'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

// PUT /api/invoices/:id - Cập nhật hóa đơn
router.put('/:id', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const invoiceIndex = invoices.findIndex(i => i.MaHoaDon === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      ...req.body,
      MaHoaDon: req.params.id,
      NgayCapNhat: new Date().toISOString()
    };
    
    if (dataService.saveInvoices(invoices)) {
      res.json({
        success: true,
        data: invoices[invoiceIndex],
        message: 'Invoice updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save invoice'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update invoice'
    });
  }
});

// DELETE /api/invoices/:id - Xóa hóa đơn
router.delete('/:id', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const invoiceIndex = invoices.findIndex(i => i.MaHoaDon === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    const deletedInvoice = invoices.splice(invoiceIndex, 1)[0];
    
    if (dataService.saveInvoices(invoices)) {
      res.json({
        success: true,
        data: deletedInvoice,
        message: 'Invoice deleted successfully'
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
      error: 'Failed to delete invoice'
    });
  }
});

// GET /api/invoices/customer/:customerId - Lấy hóa đơn theo khách hàng
router.get('/customer/:customerId', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const customerInvoices = invoices.filter(i => i.MaKhachHang === req.params.customerId);
    
    res.json({
      success: true,
      data: customerInvoices,
      count: customerInvoices.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer invoices'
    });
  }
});

// PATCH /api/invoices/:id/status - Cập nhật trạng thái hóa đơn
router.patch('/:id/status', (req, res) => {
  try {
    const invoices = dataService.getInvoices();
    const invoiceIndex = invoices.findIndex(i => i.MaHoaDon === req.params.id);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    invoices[invoiceIndex].TrangThai = req.body.TrangThai;
    invoices[invoiceIndex].NgayCapNhat = new Date().toISOString();
    
    if (dataService.saveInvoices(invoices)) {
      res.json({
        success: true,
        data: invoices[invoiceIndex],
        message: 'Invoice status updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save invoice'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update invoice status'
    });
  }
});

module.exports = router;