/**
 * ===================================
 * API SERVICE - CẤU HÌNH AXIOS
 * ===================================
 * File này cấu hình axios instance để gọi API backend
 * Tự động gắn Authorization header khi có token
 */

import axios from 'axios';

// URL của Backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Timeout 10 giây
});

/**
 * Request Interceptor
 * Tự động thêm token vào header trước mỗi request
 */
api.interceptors.request.use(
    (config) => {
        // Kiểm tra nếu đang chạy trên client (browser)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Xử lý response và lỗi từ server
 */
api.interceptors.response.use(
    (response) => {
        // Trả về data từ response
        return response.data;
    },
    (error) => {
        // Xử lý lỗi
        const message = error.response?.data?.message || 'Có lỗi xảy ra';

        // Nếu lỗi 401 (Unauthorized) - token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect đến trang login
                window.location.href = '/login';
            }
        }

        // Trả về error với format giống axios để pages handle được
        return Promise.reject({
            response: {
                data: error.response?.data || { message },
                status: error.response?.status
            },
            message
        });
    }
);

export default api;
