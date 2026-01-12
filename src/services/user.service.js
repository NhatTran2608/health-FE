/**
 * ===================================
 * USER SERVICE - QUẢN LÝ NGƯỜI DÙNG
 * ===================================
 * Service xử lý cập nhật thông tin người dùng
 */

import api from './api';

const userService = {
    /**
     * Cập nhật thông tin profile
     * @param {object} data - { name, age, gender, height, weight, medicalHistory, lifestyle }
     */
    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        // Cập nhật user trong localStorage
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response;
    },

    /**
     * Thay đổi mật khẩu
     * @param {object} data - { currentPassword, newPassword }
     */
    changePassword: async (data) => {
        return await api.put('/users/change-password', data);
    },

    /**
     * Lấy danh sách tất cả users (Admin)
     * @param {object} params - { page, limit }
     */
    getAllUsers: async (params = {}) => {
        return await api.get('/users', { params });
    },

    /**
     * Xóa user (Admin)
     * @param {string} userId
     */
    deleteUser: async (userId) => {
        return await api.delete(`/users/${userId}`);
    }
};

export default userService;
