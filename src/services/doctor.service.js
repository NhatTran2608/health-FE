/**
 * ===================================
 * DOCTOR SERVICE - QUẢN LÝ BÁC SĨ
 * ===================================
 */

import api from './api';

const doctorService = {
    // Lấy danh sách bác sĩ sẵn sàng (public)
    getAvailable: async () => {
        return await api.get('/doctors/available');
    },

    // Admin: Tạo bác sĩ mới
    create: async (data) => {
        return await api.post('/doctors', data);
    },

    // Admin: Lấy danh sách bác sĩ
    getAll: async (params = {}) => {
        return await api.get('/doctors', { params });
    },

    // Lấy thông tin bác sĩ theo ID
    getById: async (id) => {
        return await api.get(`/doctors/${id}`);
    },

    // Admin: Cập nhật bác sĩ
    update: async (id, data) => {
        return await api.put(`/doctors/${id}`, data);
    },

    // Admin: Xóa bác sĩ
    delete: async (id) => {
        return await api.delete(`/doctors/${id}`);
    }
};

export default doctorService;

