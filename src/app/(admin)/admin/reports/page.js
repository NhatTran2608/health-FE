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
    FiCalendar,
    FiTarget,
    FiDroplet,
    FiMoon
} from 'react-icons/fi';
import { Card, Loading, LineChart, BarChart } from '@/components';
import { userService, reportService } from '@/services';
import { formatDate } from '@/utils';

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        totalRecords: 0,
        totalChats: 0,
        totalReminders: 0,
        healthGoals: { total: 0, active: 0, completed: 0 },
        waterIntake: { totalRecords: 0, totalLiters: 0 },
        exerciseLog: { totalRecords: 0, totalDuration: 0, totalCalories: 0 },
        sleepTracker: { totalRecords: 0, averageSleepHours: 0 }
    });
    const [chartData, setChartData] = useState({
        userGrowth: [],
        dailyActivity: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Gọi song song các API
            const [usersRes, adminStatsRes] = await Promise.all([
                userService.getAllUsers({ page: 1, limit: 1 }).catch(() => null),
                reportService.getAdminStats().catch(() => null)
            ]);

            if (usersRes?.pagination) {
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersRes.pagination.totalItems || 0
                }));
            }

            if (adminStatsRes?.data) {
                setStats(prev => ({
                    ...prev,
                    totalRecords: adminStatsRes.data.totalHealthRecords || 0,
                    totalChats: adminStatsRes.data.totalChatQuestions || 0,
                    totalReminders: adminStatsRes.data.totalActiveReminders || 0,
                    healthGoals: adminStatsRes.data.healthGoals || { total: 0, active: 0, completed: 0 },
                    waterIntake: adminStatsRes.data.waterIntake || { totalRecords: 0, totalLiters: 0 },
                    exerciseLog: adminStatsRes.data.exerciseLog || { totalRecords: 0, totalDuration: 0, totalCalories: 0 },
                    sleepTracker: adminStatsRes.data.sleepTracker || { totalRecords: 0, averageSleepHours: 0 }
                }));
                
                // Set chart data
                setChartData({
                    userGrowth: adminStatsRes.data.userGrowth || [],
                    dailyActivity: adminStatsRes.data.dailyActivity || []
                });
            }
        } catch (error) {
            console.error('Error fetching admin reports:', error);
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

            {/* New Features Stats */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thống kê tính năng mới</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Mục tiêu sức khỏe</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.healthGoals.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <FiTarget className="text-pink-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {stats.healthGoals.active} đang thực hiện • {stats.healthGoals.completed} hoàn thành
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Theo dõi nước uống</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.waterIntake.totalRecords}</p>
                            </div>
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                                <FiDroplet className="text-cyan-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Tổng: {stats.waterIntake.totalLiters}L nước</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Nhật ký tập luyện</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.exerciseLog.totalRecords}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FiActivity className="text-red-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {Math.round(stats.exerciseLog.totalDuration / 60)}h tập • {stats.exerciseLog.totalCalories} cal
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Theo dõi giấc ngủ</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.sleepTracker.totalRecords}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FiMoon className="text-indigo-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">TB: {stats.sleepTracker.averageSleepHours}h/đêm</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <Card title="Tăng trưởng người dùng">
                    {chartData.userGrowth.length > 0 ? (
                        <div className="h-64">
                            <LineChart
                                labels={chartData.userGrowth.map(item => formatDate(item.date, 'date'))}
                                datasets={[{
                                    label: 'Người dùng mới',
                                    data: chartData.userGrowth.map(item => item.count),
                                    color: '#3B82F6',
                                    bgColor: 'rgba(59, 130, 246, 0.1)'
                                }]}
                                height={250}
                            />
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <FiTrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Chưa có dữ liệu</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Activity Chart */}
                <Card title="Hoạt động theo ngày">
                    {chartData.dailyActivity.length > 0 ? (
                        <div className="h-64">
                            <BarChart
                                labels={chartData.dailyActivity.map(item => formatDate(item.date, 'date'))}
                                datasets={[
                                    {
                                        label: 'Hồ sơ sức khỏe',
                                        data: chartData.dailyActivity.map(item => item.healthRecords),
                                        color: '#10B981'
                                    },
                                    {
                                        label: 'Cuộc tư vấn',
                                        data: chartData.dailyActivity.map(item => item.chats),
                                        color: '#8B5CF6'
                                    }
                                ]}
                                height={250}
                            />
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Chưa có dữ liệu</p>
                            </div>
                        </div>
                    )}
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
                            <tr>
                                <td className="px-6 py-4 font-medium">Mục tiêu sức khỏe</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.healthGoals.total} ({stats.healthGoals.active} đang thực hiện)</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">Bản ghi uống nước</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.waterIntake.totalRecords} ({stats.waterIntake.totalLiters}L)</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">Bản ghi tập luyện</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.exerciseLog.totalRecords} ({Math.round(stats.exerciseLog.totalDuration / 60)}h)</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium">Bản ghi giấc ngủ</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4 font-bold text-primary-600">{stats.sleepTracker.totalRecords} (TB: {stats.sleepTracker.averageSleepHours}h)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
