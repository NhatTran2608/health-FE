/**
 * ===================================
 * EXERCISE LOG SERVICE - NHẬT KÝ TẬP LUYỆN
 * ===================================
 */

import api from './api';

const exerciseLogService = {
    add: async (data) => {
        return await api.post('/exercise-log', data);
    },

    getAll: async (params = {}) => {
        return await api.get('/exercise-log', { params });
    },

    getById: async (id) => {
        return await api.get(`/exercise-log/${id}`);
    },

    update: async (id, data) => {
        return await api.put(`/exercise-log/${id}`, data);
    },

    delete: async (id) => {
        return await api.delete(`/exercise-log/${id}`);
    },

    getStatistics: async (period = 'week') => {
        return await api.get('/exercise-log/statistics', { params: { period } });
    }
};

export default exerciseLogService;



