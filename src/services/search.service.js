/**
 * ===================================
 * SEARCH SERVICE - TÌM KIẾM
 * ===================================
 * Service xử lý tìm kiếm
 */

import api from './api';

const searchService = {
    /**
     * Tìm kiếm tổng hợp
     * @param {string} keyword - Từ khóa tìm kiếm
     * @param {object} params - { page, limit, type }
     */
    search: async (keyword, params = {}) => {
        return await api.get('/search', { params: { keyword, ...params } });
    },

    /**
     * Tìm kiếm lịch sử chat
     * @param {string} keyword - Từ khóa tìm kiếm
     * @param {object} params - { page, limit }
     */
    searchChats: async (keyword, params = {}) => {
        return await api.get('/search/chats', { params: { keyword, ...params } });
    }
};

export default searchService;
