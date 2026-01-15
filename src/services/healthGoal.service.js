/**
 * ===================================
 * HEALTH GOAL SERVICE - MỤC TIÊU SỨC KHỎE
 * ===================================
 */

import api from './api';

const healthGoalService = {
    create: async (data) => {
        return await api.post('/health-goals', data);
    },

    getAll: async (params = {}) => {
        return await api.get('/health-goals', { params });
    },

    getById: async (id) => {
        return await api.get(`/health-goals/${id}`);
    },

    update: async (id, data) => {
        return await api.put(`/health-goals/${id}`, data);
    },

    delete: async (id) => {
        return await api.delete(`/health-goals/${id}`);
    },

    updateProgress: async (id, currentValue) => {
        return await api.put(`/health-goals/${id}/progress`, { currentValue });
    }
};

export default healthGoalService;



