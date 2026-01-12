/**
 * ===================================
 * REMINDER SERVICE - NHẮC NHỞ
 * ===================================
 * Service xử lý CRUD nhắc nhở
 */

import api from './api';

const reminderService = {
    /**
     * Tạo nhắc nhở mới
     * @param {object} data - { title, description, type, time, daysOfWeek, isActive }
     */
    create: async (data) => {
        return await api.post('/reminders', data);
    },

    /**
     * Lấy danh sách nhắc nhở
     * @param {object} params - { page, limit, isActive, type }
     */
    getAll: async (params = {}) => {
        return await api.get('/reminders', { params });
    },

    /**
     * Lấy nhắc nhở theo ID
     * @param {string} id
     */
    getById: async (id) => {
        return await api.get(`/reminders/${id}`);
    },

    /**
     * Cập nhật nhắc nhở
     * @param {string} id
     * @param {object} data
     */
    update: async (id, data) => {
        return await api.put(`/reminders/${id}`, data);
    },

    /**
     * Bật/tắt nhắc nhở
     * @param {string} id
     * @param {boolean} isActive
     */
    toggle: async (id, isActive) => {
        return await api.put(`/reminders/${id}/toggle`, { isActive });
    },

    /**
     * Xóa nhắc nhở
     * @param {string} id
     */
    delete: async (id) => {
        return await api.delete(`/reminders/${id}`);
    }
};

export default reminderService;
