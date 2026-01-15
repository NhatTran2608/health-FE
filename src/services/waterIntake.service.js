/**
 * ===================================
 * WATER INTAKE SERVICE - THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 */

import api from './api';

const waterIntakeService = {
    add: async (data) => {
        return await api.post('/water-intake', data);
    },

    getAll: async (params = {}) => {
        return await api.get('/water-intake', { params });
    },

    getDailyTotal: async (date) => {
        return await api.get('/water-intake/daily', { params: { date } });
    },

    getStatistics: async (period = 'week') => {
        return await api.get('/water-intake/statistics', { params: { period } });
    },

    delete: async (id) => {
        return await api.delete(`/water-intake/${id}`);
    }
};

export default waterIntakeService;



