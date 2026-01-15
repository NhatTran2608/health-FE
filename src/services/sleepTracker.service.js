/**
 * ===================================
 * SLEEP TRACKER SERVICE - THEO DÕI GIẤC NGỦ
 * ===================================
 */

import api from './api';

const sleepTrackerService = {
    add: async (data) => {
        return await api.post('/sleep-tracker', data);
    },

    getAll: async (params = {}) => {
        return await api.get('/sleep-tracker', { params });
    },

    getById: async (id) => {
        return await api.get(`/sleep-tracker/${id}`);
    },

    update: async (id, data) => {
        return await api.put(`/sleep-tracker/${id}`, data);
    },

    delete: async (id) => {
        return await api.delete(`/sleep-tracker/${id}`);
    },

    getStatistics: async (period = 'week') => {
        return await api.get('/sleep-tracker/statistics', { params: { period } });
    }
};

export default sleepTrackerService;



