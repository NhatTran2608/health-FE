/**
 * ===================================
 * HEALTH RECORD SERVICE - HỒ SƠ SỨC KHỎE
 * ===================================
 * Service xử lý CRUD hồ sơ sức khỏe
 */

import api from './api';

const healthRecordService = {
    /**
     * Tạo bản ghi sức khỏe mới
     * @param {object} data - { height, weight, bloodPressure, heartRate, bloodSugar, temperature, note }
     */
    create: async (data) => {
        return await api.post('/health-records', data);
    },

    /**
     * Lấy danh sách bản ghi sức khỏe
     * @param {object} params - { page, limit, startDate, endDate }
     */
    getAll: async (params = {}) => {
        return await api.get('/health-records', { params });
    },

    /**
     * Lấy bản ghi sức khỏe mới nhất
     */
    getLatest: async () => {
        return await api.get('/health-records/latest');
    },

    /**
     * Lấy bản ghi sức khỏe theo ID
     * @param {string} id
     */
    getById: async (id) => {
        return await api.get(`/health-records/${id}`);
    },

    /**
     * Cập nhật bản ghi sức khỏe
     * @param {string} id
     * @param {object} data
     */
    update: async (id, data) => {
        return await api.put(`/health-records/${id}`, data);
    },

    /**
     * Xóa bản ghi sức khỏe
     * @param {string} id
     */
    delete: async (id) => {
        return await api.delete(`/health-records/${id}`);
    }
};

export default healthRecordService;
