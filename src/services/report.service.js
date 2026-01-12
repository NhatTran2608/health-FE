/**
 * ===================================
 * REPORT SERVICE - BÁO CÁO & THỐNG KÊ
 * ===================================
 * Service lấy dữ liệu báo cáo
 */

import api from './api';

const reportService = {
    /**
     * Lấy báo cáo sức khỏe (dữ liệu cho biểu đồ)
     * @param {object} params - { startDate, endDate }
     */
    getHealthReport: async (params = {}) => {
        return await api.get('/reports/health', { params });
    },

    /**
     * Lấy báo cáo lịch sử chatbot
     * @param {object} params - { startDate, endDate }
     */
    getChatbotReport: async (params = {}) => {
        return await api.get('/reports/chatbot', { params });
    },

    /**
     * Lấy báo cáo tổng quan (dashboard)
     */
    getDashboard: async () => {
        return await api.get('/reports/dashboard');
    }
};

export default reportService;
