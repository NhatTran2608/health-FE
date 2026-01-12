/**
 * ===================================
 * HOOK: useAuth - QUẢN LÝ XÁC THỰC
 * ===================================
 * Custom hook để quản lý trạng thái đăng nhập
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Kiểm tra xác thực
    const checkAuth = async () => {
        try {
            setLoading(true);

            // Kiểm tra token trong localStorage
            if (!authService.isAuthenticated()) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Lấy thông tin user từ API
            const response = await authService.getMe();
            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            // Xóa token nếu không hợp lệ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập
    const login = async (email, password) => {
        const response = await authService.login({ email, password });
        setUser(response.data.user);
        return response;
    };

    // Đăng ký
    const register = async (name, email, password) => {
        const response = await authService.register({ name, email, password });
        setUser(response.data.user);
        return response;
    };

    // Đăng xuất
    const logout = async () => {
        await authService.logout();
        setUser(null);
        router.push('/login');
    };

    // Cập nhật user
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        checkAuth
    };
}
