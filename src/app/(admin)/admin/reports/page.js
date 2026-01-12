/**
 * ===================================
 * TRANG BÁO CÁO TỔNG THỂ - ADMIN
 * ===================================
 * Hiển thị thống kê toàn hệ thống
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiTrendingUp,
    FiUsers,
    FiActivity,
    FiMessageSquare,
    FiBell,
    FiCalendar
} from 'react-icons/fi';
import { Card, Loading } from '@/components';
import { userService } from '@/services';

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalRecords: 0,
        totalChats: 0,
        totalReminders: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Lấy thống kê users
            const usersRes = await userService.getAllUsers({ page: 1, limit: 1 });
            if (usersRes.pagination) {
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.pagination.totalItems || 0
                }));
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu báo cáo');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Đang tải báo cáo..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiTrendingUp />
                    Báo cáo tổng thể
                </h1>
                <p className="text-gray-500">Thống kê toàn bộ hệ thống</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Tổng người dùng</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUsers className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">+12% so với tháng trước</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Hồ sơ sức khỏe</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalRecords}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FiActivity className="text-green-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Toàn hệ thống</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Cuộc tư vấn</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalChats}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <FiMessageSquare className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Toàn hệ thống</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Nhắc nhở</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.totalReminders}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <FiBell className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Đang hoạt động</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <Card title="Tăng trưởng người dùng">
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <FiTrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Biểu đồ tăng trưởng người dùng</p>
                            <p className="text-sm">Đang phát triển...</p>
                        </div>
                    </div>
                </Card>

                {/* Activity Chart */}
                <Card title="Hoạt động theo ngày">
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Biểu đồ hoạt động</p>
                            <p className="text-sm">Đang phát triển...</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Summary Table */}
            <Card title="Tổng kết hoạt động" className="mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Chỉ số
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Hôm nay
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tuần này
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tháng này
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tổng
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-6 py-4 font-medium">Người dùng mới</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4">2</td>
                                <td className="px-6 py-4">5</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.totalUsers}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">Hồ sơ sức khỏe</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.totalRecords}</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">Câu hỏi tư vấn</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4">0</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.totalChats}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
