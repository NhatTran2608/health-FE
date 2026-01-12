/**
 * ===================================
 * TRANG DASHBOARD - TỔNG QUAN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiActivity,
    FiMessageSquare,
    FiBell,
    FiTrendingUp,
    FiPlus
} from 'react-icons/fi';
import { Card, StatCard, Loading, EmptyState } from '@/components';
import { reportService, healthRecordService, reminderService } from '@/services';
import { formatDate, calculateBMI, getBMIStatus } from '@/utils';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [latestRecord, setLatestRecord] = useState(null);
    const [todayReminders, setTodayReminders] = useState([]);
    const [totalReminders, setTotalReminders] = useState(0);

    // Lấy dữ liệu dashboard khi load
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Gọi song song các API
            const [dashboardRes, recordsRes, remindersRes, allRemindersRes] = await Promise.all([
                reportService.getDashboard().catch(() => null),
                healthRecordService.getAll({ limit: 1 }).catch(() => null),
                reminderService.getAll({ limit: 5, isActive: true }).catch(() => null),
                reminderService.getAll({ limit: 1 }).catch(() => null) // Just to get total count
            ]);

            // Dashboard: { success, message, data: { healthSummary: { totalRecords }, chatSummary: { totalQuestions } } }
            if (dashboardRes?.data) {
                setDashboardData(dashboardRes.data);
            }

            // Health Records: { success, message, data: records[], pagination }
            // => recordsRes.data là mảng records
            if (recordsRes?.data?.length > 0) {
                setLatestRecord(recordsRes.data[0]);
            }

            // Reminders: { success, message, data: reminders[], pagination }
            // => remindersRes.data là mảng reminders
            if (remindersRes?.data) {
                setTodayReminders(remindersRes.data);
            }

            // Get total reminders count from pagination
            if (allRemindersRes?.pagination) {
                setTotalReminders(allRemindersRes.pagination.totalItems || 0);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading text="Đang tải dashboard..." />;
    }

    // Tính BMI nếu có dữ liệu
    const bmi = latestRecord
        ? calculateBMI(latestRecord.weight, latestRecord.height)
        : null;
    const bmiStatus = bmi ? getBMIStatus(bmi) : null;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
                <p className="text-gray-500">Chào mừng bạn quay trở lại!</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon="📊"
                    label="Hồ sơ sức khỏe"
                    value={dashboardData?.healthSummary?.totalRecords || 0}
                    change="+2 tuần này"
                    changeType="positive"
                />
                <StatCard
                    icon="💬"
                    label="Cuộc tư vấn"
                    value={dashboardData?.chatSummary?.totalQuestions || 0}
                    change="+5 tuần này"
                    changeType="positive"
                />
                <StatCard
                    icon="🔔"
                    label="Nhắc nhở"
                    value={totalReminders}
                />
                <StatCard
                    icon="⚖️"
                    label="BMI hiện tại"
                    value={bmi || '--'}
                    change={bmiStatus?.label}
                    changeType={bmiStatus?.type === 'normal' ? 'positive' : 'neutral'}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latest Health Record */}
                <div className="lg:col-span-2">
                    <Card
                        title="Hồ sơ sức khỏe mới nhất"
                        headerAction={
                            <Link
                                href="/health-records"
                                className="text-primary-500 hover:underline text-sm"
                            >
                                Xem tất cả
                            </Link>
                        }
                    >
                        {latestRecord ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">
                                        {latestRecord.weight}
                                    </p>
                                    <p className="text-sm text-gray-500">Cân nặng (kg)</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        {latestRecord.height}
                                    </p>
                                    <p className="text-sm text-gray-500">Chiều cao (cm)</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-red-600">
                                        {latestRecord.bloodPressure?.systolic || '--'}/
                                        {latestRecord.bloodPressure?.diastolic || '--'}
                                    </p>
                                    <p className="text-sm text-gray-500">Huyết áp (mmHg)</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-purple-600">
                                        {latestRecord.heartRate || '--'}
                                    </p>
                                    <p className="text-sm text-gray-500">Nhịp tim (bpm)</p>
                                </div>
                                <div className="col-span-2 md:col-span-4 text-sm text-gray-500 text-center">
                                    Cập nhật: {formatDate(latestRecord.recordDate)}
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                icon="📋"
                                title="Chưa có hồ sơ"
                                description="Bắt đầu theo dõi sức khỏe của bạn ngay!"
                                action={
                                    <Link
                                        href="/health-records"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                                    >
                                        <FiPlus />
                                        Tạo hồ sơ
                                    </Link>
                                }
                            />
                        )}
                    </Card>
                </div>

                {/* Reminders */}
                <div>
                    <Card
                        title="Nhắc nhở hôm nay"
                        headerAction={
                            <Link
                                href="/reminders"
                                className="text-primary-500 hover:underline text-sm"
                            >
                                Xem tất cả
                            </Link>
                        }
                    >
                        {todayReminders.length > 0 ? (
                            <div className="space-y-3">
                                {todayReminders.map((reminder) => (
                                    <div
                                        key={reminder._id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="text-2xl">
                                            {reminder.type === 'medication' ? '💊' :
                                                reminder.type === 'exercise' ? '🏃' :
                                                    reminder.type === 'appointment' ? '📅' : '🔔'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{reminder.title}</p>
                                            <p className="text-sm text-gray-500">{reminder.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="🔔"
                                title="Không có nhắc nhở"
                                description="Tạo nhắc nhở để theo dõi sức khỏe"
                            />
                        )}
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/health-records"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FiActivity className="text-blue-600 text-xl" />
                        </div>
                        <span className="font-medium">Thêm hồ sơ</span>
                    </Link>
                    <Link
                        href="/chatbot"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FiMessageSquare className="text-green-600 text-xl" />
                        </div>
                        <span className="font-medium">Tư vấn ngay</span>
                    </Link>
                    <Link
                        href="/reminders"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiBell className="text-yellow-600 text-xl" />
                        </div>
                        <span className="font-medium">Đặt nhắc nhở</span>
                    </Link>
                    <Link
                        href="/reports"
                        className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FiTrendingUp className="text-purple-600 text-xl" />
                        </div>
                        <span className="font-medium">Xem thống kê</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
