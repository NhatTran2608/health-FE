/**
 * ===================================
 * AUTH SERVICE - XÁC THỰC NGƯỜI DÙNG
 * ===================================
 * Service xử lý đăng nhập, đăng ký, đăng xuất
 */

import api from './api';

const authService = {
    /**
     * Đăng ký tài khoản mới
     * @param {object} data - { name, email, password }
     */
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        // Lưu token và user vào localStorage
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    /**
     * Đăng nhập
     * @param {object} data - { email, password }
     */
    login: async (data) => {
        const response = await api.post('/auth/login', data);
        // Lưu token và user vào localStorage
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    /**
     * Lấy thông tin user hiện tại
     */
    getMe: async () => {
        return await api.get('/auth/me');
    },

    /**
     * Đăng xuất
     */
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            // Xóa token và user khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Kiểm tra đã đăng nhập chưa
     */
    isAuthenticated: () => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    },

    /**
     * Lấy user từ localStorage
     */
    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    /**
     * Lấy token từ localStorage
     */
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }
};

export default authService;
