/**
 * ===================================
 * CHATBOT SERVICE - TƯ VẤN SỨC KHỎE
 * ===================================
 * Service xử lý chatbot tư vấn
 */

import api from './api';

const chatbotService = {
    /**
     * Gửi câu hỏi cho chatbot
     * @param {string} question - Câu hỏi của người dùng
     */
    ask: async (question) => {
        return await api.post('/chatbot/ask', { question });
    },

    /**
     * Lấy lịch sử hội thoại
     * @param {object} params - { page, limit }
     */
    getHistory: async (params = {}) => {
        return await api.get('/chatbot/history', { params });
    },

    /**
     * Đánh giá câu trả lời
     * @param {string} chatId - ID của cuộc hội thoại
     * @param {number} rating - Điểm đánh giá (1-5)
     */
    rateResponse: async (chatId, rating) => {
        return await api.put(`/chatbot/${chatId}/rate`, { rating });
    },

    /**
     * Xóa một cuộc hội thoại
     * @param {string} chatId
     */
    deleteChat: async (chatId) => {
        return await api.delete(`/chatbot/${chatId}`);
    },

    /**
     * Xóa toàn bộ lịch sử chat
     */
    clearHistory: async () => {
        return await api.delete('/chatbot/history/clear');
    }
};

export default chatbotService;
