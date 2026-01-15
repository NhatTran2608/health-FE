/**
 * ===================================
 * APPOINTMENT SERVICE - QUẢN LÝ LỊCH HẸN
 * ===================================
 */

import api from './api';

const appointmentService = {
    // User: Tạo lịch hẹn mới
    create: async (data) => {
        return await api.post('/appointments', data);
    },

    // User: Lấy lịch hẹn của mình
    getMyAppointments: async (params = {}) => {
        return await api.get('/appointments/my-appointments', { params });
    },

    // User: Lấy một lịch hẹn của mình
    getMyAppointmentById: async (id) => {
        return await api.get(`/appointments/my-appointments/${id}`);
    },

    // User: Hủy lịch hẹn
    cancel: async (id) => {
        return await api.put(`/appointments/my-appointments/${id}/cancel`);
    },

    // Admin: Lấy tất cả lịch hẹn
    getAll: async (params = {}) => {
        return await api.get('/appointments', { params });
    },

    // Admin: Lấy một lịch hẹn
    getById: async (id) => {
        return await api.get(`/appointments/${id}`);
    },

    // Admin: Cập nhật trạng thái lịch hẹn
    updateStatus: async (id, status, adminNote = '') => {
        return await api.put(`/appointments/${id}/status`, { status, adminNote });
    }
};

export default appointmentService;

