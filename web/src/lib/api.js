import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api'

const getHeaders = () => {
  const userId = localStorage.getItem('userId')
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId || ''
  }
}

// Certificate Request APIs
export const certificateAPI = {
  create: (data) =>
    axios.post(`${API_BASE}/certificate-requests/submit`, data, {
      headers: getHeaders()
    }),

  getUserRequests: () =>
    axios.get(`${API_BASE}/certificate-requests/my-requests`, {
      headers: getHeaders()
    }),

  getRequest: (requestId) =>
    axios.get(`${API_BASE}/certificate-requests/${requestId}`, {
      headers: getHeaders()
    }),

  updateStatus: (requestId, status) =>
    axios.put(`${API_BASE}/certificate-requests/${requestId}/status`, { status }, {
      headers: getHeaders()
    })
}

// Report/Complaint APIs
export const reportAPI = {
  create: (data) =>
    axios.post(`${API_BASE}/complaints/submit`, data, {
      headers: getHeaders()
    }),

  getUserReports: () =>
    axios.get(`${API_BASE}/complaints/my-reports`, {
      headers: getHeaders()
    })
}

// Announcement APIs
export const announcementAPI = {
  getAll: () =>
    axios.get(`${API_BASE}/announcements`, {
      headers: getHeaders()
    }),

  create: (data) =>
    axios.post(`${API_BASE}/announcements`, data, {
      headers: getHeaders()
    }),

  update: (id, data) =>
    axios.put(`${API_BASE}/announcements/${id}`, data, {
      headers: getHeaders()
    }),

  delete: (id) =>
    axios.delete(`${API_BASE}/announcements/${id}`, {
      headers: getHeaders()
    })
}

// Admin APIs
export const adminAPI = {
  // User Management
  getUnconfirmedUsers: () => axios.get(`${API_BASE}/admin/users/unconfirmed`, { headers: getHeaders() }),
  getAllUsers: () => axios.get(`${API_BASE}/admin/users/all`, { headers: getHeaders() }),
  confirmUser: (id) => axios.put(`${API_BASE}/admin/users/${id}/confirm`, {}, { headers: getHeaders() }),

  // Certificate Management
  getAllCertificates: () => axios.get(`${API_BASE}/admin/certificates/all`, { headers: getHeaders() }),
  updateCertificateStatus: (id, status) => 
    axios.put(`${API_BASE}/admin/certificates/${id}/status`, { status }, { headers: getHeaders() }),

  // Complaint Management
  getAllComplaints: () => axios.get(`${API_BASE}/admin/complaints/all`, { headers: getHeaders() }),
  updateComplaintStatus: (id, status) => 
    axios.put(`${API_BASE}/admin/complaints/${id}/status`, { status }, { headers: getHeaders() })
}

// Payment APIs
export const paymentAPI = {
  initiate: (certificateRequestId, amount, paymentMethod) =>
    axios.post(
      `${API_BASE}/payments/initiate`,
      {
        certificateRequestId,
        amount,
        paymentMethod
      },
      { headers: getHeaders() }
    ),

  verify: (paymentId, referenceNumber, proofImage = null) =>
    axios.post(
      `${API_BASE}/payments/verify`,
      {
        paymentId,
        referenceNumber,
        proofImage
      },
      { headers: getHeaders() }
    ),

  getPaymentStatus: (certificateRequestId) =>
    axios.get(`${API_BASE}/payments/certificate-request/${certificateRequestId}`, {
      headers: getHeaders()
    }),

  markFailed: (paymentId) =>
    axios.put(`${API_BASE}/payments/${paymentId}/failed`, {}, {
      headers: getHeaders()
    }),

  approve: (paymentId) =>
    axios.put(`${API_BASE}/payments/${paymentId}/approve`, {}, {
      headers: getHeaders()
    }),

  reject: (paymentId) =>
    axios.put(`${API_BASE}/payments/${paymentId}/reject`, {}, {
      headers: getHeaders()
    })
}

// Auth APIs for getting user ID
export const authAPI = {
  setUserId: (userId) => localStorage.setItem('userId', userId),
  
  register: (data) =>
    axios.post(`${API_BASE}/auth/register`, data),

  getProfile: (userId) => 
    axios.get(`${API_BASE}/users/${userId}`, {
      headers: getHeaders()
    }),

  updateProfile: (userId, data) => {
    // If data contains byte arrays for images, they will be sent as arrays of numbers
    // which the backend should handle appropriately or convert to byte[]
    return axios.put(`${API_BASE}/users/${userId}`, data, {
      headers: getHeaders()
    })
  }
}
