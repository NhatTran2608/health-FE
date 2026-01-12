/**
 * ===================================
 * TRANG QUẢN TRỊ - DASHBOARD ADMIN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiUsers,
    FiActivity,
    FiMessageSquare,
    FiBell,
    FiTrendingUp,
    FiShield
} from 'react-icons/fi';
import { Card, StatCard, Loading } from '@/components';
import { userService, reportService } from '@/services';

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecords: 0,
        totalChats: 0,
        totalReminders: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);

            // Gọi song song các API
            const [usersRes, adminStatsRes] = await Promise.all([
                userService.getAllUsers({ page: 1, limit: 5 }).catch(() => null),
                reportService.getAdminStats().catch(() => null)
            ]);

            if (usersRes?.data) {
                setRecentUsers(usersRes.data);
                setStats(prev => ({ ...prev, totalUsers: usersRes.pagination?.totalItems || 0 }));
            }

            if (adminStatsRes?.data) {
                setStats(prev => ({
                    ...prev,
                    totalRecords: adminStatsRes.data.totalHealthRecords || 0,
                    totalChats: adminStatsRes.data.totalChatQuestions || 0,
                    totalReminders: adminStatsRes.data.totalActiveReminders || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Không thể tải dữ liệu quản trị');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Đang tải dữ liệu quản trị..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <FiShield className="text-purple-600" size={32} />
                    <h1 className="text-2xl font-bold text-gray-800">Quản trị hệ thống</h1>
                </div>
                <p className="text-gray-500">Chào mừng Admin quay trở lại!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon="👥"
                    label="Tổng người dùng"
                    value={stats.totalUsers}
                    change="+12 tuần này"
                    changeType="positive"
                />
                <StatCard
                    icon="📊"
                    label="Hồ sơ sức khỏe"
                    value={stats.totalRecords}
                    change="Toàn hệ thống"
                    changeType="neutral"
                />
                <StatCard
                    icon="💬"
                    label="Cuộc tư vấn"
                    value={stats.totalChats}
                    change="Toàn hệ thống"
                    changeType="neutral"
                />
                <StatCard
                    icon="🔔"
                    label="Nhắc nhở đang hoạt động"
                    value={stats.totalReminders}
                    change="Toàn hệ thống"
                    changeType="neutral"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <Card
                    title="Người dùng mới nhất"
                    headerAction={
                        <Link
                            href="/admin/users"
                            className="text-primary-500 hover:underline text-sm"
                        >
                            Xem tất cả
                        </Link>
                    }
                >
                    {recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {recentUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`
                                        px-3 py-1 rounded-full text-xs font-medium
                                        ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-green-100 text-green-700'
                                        }
                                    `}>
                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-8">Chưa có người dùng</p>
                    )}
                </Card>

                {/* Quick Actions */}
                <Card title="Thao tác nhanh">
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/users"
                            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <FiUsers className="text-blue-600 mb-2" size={24} />
                            <p className="font-medium text-blue-900">Quản lý Users</p>
                            <p className="text-sm text-blue-600">Xem & quản lý người dùng</p>
                        </Link>

                        <Link
                            href="/admin/profile"
                            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <FiActivity className="text-green-600 mb-2" size={24} />
                            <p className="font-medium text-green-900">Hồ sơ cá nhân</p>
                            <p className="text-sm text-green-600">Xem hồ sơ của bạn</p>
                        </Link>

                        <Link
                            href="/admin/reports"
                            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <FiTrendingUp className="text-purple-600 mb-2" size={24} />
                            <p className="font-medium text-purple-900">Báo cáo tổng thể</p>
                            <p className="text-sm text-purple-600">Thống kê hệ thống</p>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                            <FiShield className="text-orange-600 mb-2" size={24} />
                            <p className="font-medium text-orange-900">Cài đặt</p>
                            <p className="text-sm text-orange-600">Cấu hình hệ thống</p>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
