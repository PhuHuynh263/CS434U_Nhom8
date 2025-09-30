// API service để kết nối với backend
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function để gọi API
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API (giữ nguyên như cũ vì chưa có authentication trong backend)
export const authAPI = {
  login: async (email, password) => {
    // Temporary: Gọi API staff để kiểm tra login
    const staffData = await staffAPI.getAll();
    const user = staffData.data.find(
      (nv) => nv.Email === email && nv.password === password
    );
    if (user) {
      return { success: true, data: user };
    }
    throw new Error("Invalid credentials");
  },

  logout: async () => {
    localStorage.removeItem("user");
    return { success: true };
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    return await apiCall('/customers');
  },

  getById: async (id) => {
    return await apiCall(`/customers/${id}`);
  },

  create: async (customerData) => {
    return await apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  update: async (id, customerData) => {
    return await apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rooms API
export const roomsAPI = {
  getAll: async () => {
    return await apiCall('/rooms');
  },

  getTypes: async () => {
    return await apiCall('/rooms/types');
  },

  getById: async (id) => {
    return await apiCall(`/rooms/${id}`);
  },

  getAvailable: async (date) => {
    return await apiCall(`/rooms/available/${date}`);
  },

  create: async (roomData) => {
    return await apiCall('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  update: async (id, roomData) => {
    return await apiCall(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    return await apiCall('/bookings');
  },

  getById: async (id) => {
    return await apiCall(`/bookings/${id}`);
  },

  getByCustomer: async (customerId) => {
    return await apiCall(`/bookings/customer/${customerId}`);
  },

  create: async (bookingData) => {
    return await apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id, bookingData) => {
    return await apiCall(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    return await apiCall('/services');
  },

  getById: async (id) => {
    return await apiCall(`/services/${id}`);
  },

  create: async (serviceData) => {
    return await apiCall('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  update: async (id, serviceData) => {
    return await apiCall(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async () => {
    return await apiCall('/invoices');
  },

  getById: async (id) => {
    return await apiCall(`/invoices/${id}`);
  },

  getByCustomer: async (customerId) => {
    return await apiCall(`/invoices/customer/${customerId}`);
  },

  create: async (invoiceData) => {
    return await apiCall('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  },

  update: async (id, invoiceData) => {
    return await apiCall(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  },

  updateStatus: async (id, status) => {
    return await apiCall(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ TrangThai: status }),
    });
  },

  delete: async (id) => {
    return await apiCall(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    return await apiCall('/staff');
  },

  getRoles: async () => {
    return await apiCall('/staff/roles');
  },

  getById: async (id) => {
    return await apiCall(`/staff/${id}`);
  },

  create: async (staffData) => {
    return await apiCall('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  update: async (id, staffData) => {
    return await apiCall(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/staff/${id}`, {
      method: 'DELETE',
    });
  },
};

// Roles API (từ staff API)
export const rolesAPI = {
  getAll: async () => {
    return await staffAPI.getRoles();
  },
};

// Legacy aliases để tương thích với code cũ
export const customerAPI = customersAPI;
export const roomAPI = roomsAPI;
export const bookingAPI = bookingsAPI;
export const serviceAPI = servicesAPI;
export const invoiceAPI = invoicesAPI;