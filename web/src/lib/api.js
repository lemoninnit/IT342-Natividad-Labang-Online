import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

const getHeaders = () => {
  const userId = localStorage.getItem('userId')
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId || ''
  }
}

// Certificate Request APIs
export const certificateAPI = {
  submit: (data) =>
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

  verify: (paymentId, referenceNumber) =>
    axios.post(
      `${API_BASE}/payments/verify`,
      {
        paymentId,
        referenceNumber
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
    })
}

// Auth APIs for getting user ID
export const authAPI = {
  setUserId: (userId) => localStorage.setItem('userId', userId)
}
