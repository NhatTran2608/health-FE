/**
 * ===================================
 * TRANG THỐNG KÊ & BÁO CÁO
 * ===================================
 * Hiển thị biểu đồ sức khỏe, thống kê tư vấn
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiTrendingUp,
    FiActivity,
    FiMessageSquare,
    FiCalendar,
    FiChevronDown
} from 'react-icons/fi';
import { Card, Loading, LineChart, BarChart } from '@/components';
import { reportService, healthRecordService, chatbotService } from '@/services';
import { formatDate, calculateBMI, getBMIStatus } from '@/utils';

export default function ReportsPage() {
    // State quản lý dữ liệu
    const [loading, setLoading] = useState(true);
    const [healthData, setHealthData] = useState(null);
    const [chatbotData, setChatbotData] = useState(null);
    const [period, setPeriod] = useState('month'); // week, month, year

    // Lấy dữ liệu khi load hoặc thay đổi period
    useEffect(() => {
        fetchReports();
    }, [period]);

    /**
     * Lấy dữ liệu báo cáo
     */
    const fetchReports = async () => {
        try {
            setLoading(true);

            // Chuyển đổi period sang startDate và endDate
            const endDate = new Date();
            const startDate = new Date();
            
            switch (period) {
                case 'week':
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setDate(endDate.getDate() - 30);
                    break;
                case 'year':
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
            }

            const dateParams = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            };

            // Gọi các API
            // Fetch records without date filtering để có dữ liệu cho charts
            const [healthRes, chatbotRes, recordsRes, chatHistoryRes] = await Promise.all([
                reportService.getHealthReport(dateParams).catch(() => null),
                reportService.getChatbotReport(dateParams).catch(() => null),
                healthRecordService.getAll({ limit: 100 }).catch(() => null), // Fetch all records for charts
                chatbotService.getHistory({ limit: 100 }).catch(() => null)
            ]);

            // Transform health data
            const recordsArray = recordsRes?.data || [];
            const activeDaysSet = new Set(
                recordsArray.map(record => new Date(record.createdAt).toDateString())
            );

            // Tính toán từ records nếu có
            const weightHistory = recordsArray
                .filter(r => r.weight)
                .map(r => ({
                    date: r.createdAt,
                    weight: r.weight
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const bmiHistory = recordsArray
                .filter(r => r.weight && r.height)
                .map(r => ({
                    date: r.createdAt,
                    bmi: parseFloat(calculateBMI(r.weight, r.height))
                }))
                .filter(d => d.bmi && !isNaN(d.bmi))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const bloodPressureHistory = recordsArray
                .filter(r => r.bloodPressure?.systolic && r.bloodPressure?.diastolic)
                .map(r => ({
                    date: r.createdAt,
                    systolic: r.bloodPressure.systolic,
                    diastolic: r.bloodPressure.diastolic
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            // Tính average weight
            let averageWeight = null;
            if (weightHistory.length > 0) {
                const weights = weightHistory.map(d => d.weight);
                averageWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
            }

            // Tạo health data - ưu tiên backend data, fallback về records
            const transformedHealthData = {
                totalRecords: healthRes?.data?.stats?.totalRecords || recordsArray.length,
                averageWeight: healthRes?.data?.stats?.weight?.avg 
                    ? parseFloat(healthRes.data.stats.weight.avg) 
                    : averageWeight,
                activeDays: activeDaysSet.size,
                weightHistory: (healthRes?.data?.chartData?.weight || []).length > 0
                    ? healthRes.data.chartData.weight.map(d => ({
                        date: d.date,
                        weight: d.value
                    }))
                    : weightHistory,
                bmiHistory: (healthRes?.data?.chartData?.bmi || []).length > 0
                    ? healthRes.data.chartData.bmi.map(d => ({
                        date: d.date,
                        bmi: parseFloat(d.value)
                    }))
                    : bmiHistory,
                bloodPressureHistory: (healthRes?.data?.chartData?.bloodPressure || []).length > 0
                    ? healthRes.data.chartData.bloodPressure.map(d => ({
                        date: d.date,
                        systolic: d.systolic,
                        diastolic: d.diastolic
                    }))
                    : bloodPressureHistory,
                records: recordsArray
            };
            setHealthData(transformedHealthData);

            // Transform chatbot data
            const chatHistoryArray = chatHistoryRes?.data || [];
            
            // Tính average rating từ chat history
            let averageRating = 0;
            if (chatHistoryArray.length > 0) {
                const ratings = chatHistoryArray
                    .filter(chat => chat.rating)
                    .map(chat => chat.rating);
                if (ratings.length > 0) {
                    averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                }
            }

            // Tạo recent activity từ chat history nếu không có từ API
            const recentActivityFromHistory = chatHistoryArray
                .reduce((acc, chat) => {
                    const date = new Date(chat.createdAt).toISOString().split('T')[0];
                    const existing = acc.find(item => item.date === date);
                    if (existing) {
                        existing.count++;
                    } else {
                        acc.push({ date, count: 1 });
                    }
                    return acc;
                }, [])
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5);

            // Tạo popular topics từ chat history
            const popularTopicsFromHistory = chatHistoryArray
                .reduce((acc, chat) => {
                    const category = chat.category || 'other';
                    const existing = acc.find(item => item.name === category);
                    if (existing) {
                        existing.count++;
                    } else {
                        acc.push({ name: category, count: 1 });
                    }
                    return acc;
                }, [])
                .sort((a, b) => b.count - a.count);

            if (chatbotRes?.data) {
                const backendData = chatbotRes.data;
                const transformedChatbotData = {
                    totalChats: backendData.summary?.totalQuestions || chatHistoryArray.length,
                    recentActivity: (backendData.dailyStats || []).length > 0
                        ? backendData.dailyStats.map(d => ({
                            date: d.date,
                            count: d.count
                        }))
                        : recentActivityFromHistory,
                    popularTopics: (backendData.categoryStats || []).length > 0
                        ? backendData.categoryStats.map(item => ({
                            name: item.category,
                            count: item.count
                        }))
                        : popularTopicsFromHistory,
                    averageRating: averageRating
                };
                setChatbotData(transformedChatbotData);
            } else {
                // Nếu không có dữ liệu từ report, tạo từ chat history
                setChatbotData({
                    totalChats: chatHistoryArray.length,
                    recentActivity: recentActivityFromHistory,
                    popularTopics: popularTopicsFromHistory,
                    averageRating: averageRating
                });
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Không thể tải dữ liệu báo cáo');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return <Loading text="Đang tải báo cáo..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Thống kê & Báo cáo</h1>
                    <p className="text-gray-500">Theo dõi sức khỏe và lịch sử tư vấn</p>
                </div>

                {/* Period selector */}
                <div className="relative">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    >
                        <option value="week">7 ngày qua</option>
                        <option value="month">30 ngày qua</option>
                        <option value="year">1 năm qua</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                        <FiActivity />
                        <span className="text-sm">Bản ghi sức khỏe</span>
                    </div>
                    <p className="text-2xl font-bold">{healthData?.totalRecords || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                        <FiTrendingUp />
                        <span className="text-sm">Cân nặng TB</span>
                    </div>
                    <p className="text-2xl font-bold">
                        {healthData?.averageWeight?.toFixed(1) || '--'} <span className="text-sm">kg</span>
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-500 mb-2">
                        <FiMessageSquare />
                        <span className="text-sm">Câu hỏi tư vấn</span>
                    </div>
                    <p className="text-2xl font-bold">{chatbotData?.totalChats || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <FiCalendar />
                        <span className="text-sm">Ngày hoạt động</span>
                    </div>
                    <p className="text-2xl font-bold">{healthData?.activeDays || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ cân nặng */}
                <Card title="Biểu đồ cân nặng" className="min-h-[400px]">
                    {healthData?.weightHistory?.length > 0 ? (
                        <div className="h-80">
                            <LineChart
                                labels={healthData.weightHistory.map(d => formatDate(d.date, 'date'))}
                                datasets={[{
                                    label: 'Cân nặng (kg)',
                                    data: healthData.weightHistory.map(d => d.weight),
                                    color: '#3B82F6'
                                }]}
                                height={300}
                            />
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            Chưa có dữ liệu cân nặng
                        </div>
                    )}
                </Card>

                {/* Biểu đồ BMI */}
                <Card title="Biểu đồ BMI" className="min-h-[400px]">
                    {healthData?.bmiHistory?.length > 0 ? (
                        <div className="h-80">
                            <LineChart
                                labels={healthData.bmiHistory.map(d => formatDate(d.date, 'date'))}
                                datasets={[{
                                    label: 'BMI',
                                    data: healthData.bmiHistory.map(d => d.bmi),
                                    color: '#10B981'
                                }]}
                                height={300}
                                options={{
                                    plugins: {
                                        annotation: {
                                            annotations: {
                                                line1: {
                                                    type: 'line',
                                                    yMin: 18.5,
                                                    yMax: 18.5,
                                                    borderColor: '#F59E0B',
                                                    borderDash: [5, 5],
                                                    label: { content: 'Thiếu cân (18.5)', enabled: true }
                                                },
                                                line2: {
                                                    type: 'line',
                                                    yMin: 25,
                                                    yMax: 25,
                                                    borderColor: '#EF4444',
                                                    borderDash: [5, 5],
                                                    label: { content: 'Thừa cân (25)', enabled: true }
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            Chưa có dữ liệu BMI
                        </div>
                    )}
                </Card>

                {/* Biểu đồ huyết áp */}
                <Card title="Biểu đồ huyết áp" className="min-h-[400px]">
                    {healthData?.bloodPressureHistory?.length > 0 ? (
                        <div className="h-80">
                            <LineChart
                                labels={healthData.bloodPressureHistory.map(d => formatDate(d.date, 'date'))}
                                datasets={[
                                    {
                                        label: 'Tâm thu (mmHg)',
                                        data: healthData.bloodPressureHistory.map(d => d.systolic),
                                        color: '#EF4444'
                                    },
                                    {
                                        label: 'Tâm trương (mmHg)',
                                        data: healthData.bloodPressureHistory.map(d => d.diastolic),
                                        color: '#F59E0B'
                                    }
                                ]}
                                height={300}
                            />
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            Chưa có dữ liệu huyết áp
                        </div>
                    )}
                </Card>

                {/* Thống kê tư vấn */}
                <Card title="Thống kê tư vấn">
                    <div className="space-y-4">
                        {/* Số câu hỏi theo ngày */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Hoạt động gần đây</h4>
                            {chatbotData?.recentActivity?.length > 0 ? (
                                <div className="space-y-2">
                                    {chatbotData.recentActivity.slice(0, 5).map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                {formatDate(item.date)}
                                            </span>
                                            <span className="text-sm font-medium text-primary-600">
                                                {item.count} câu hỏi
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Chưa có hoạt động</p>
                            )}
                        </div>

                        {/* Chủ đề phổ biến */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Chủ đề phổ biến</h4>
                            {chatbotData?.popularTopics?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {chatbotData.popularTopics.map((topic, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                        >
                                            {topic.name} ({topic.count})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
                            )}
                        </div>

                        {/* Đánh giá trung bình */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Đánh giá tư vấn</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-yellow-500">
                                    {chatbotData?.averageRating?.toFixed(1) || '--'}
                                </span>
                                <span className="text-gray-500">/ 5 sao</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bảng lịch sử chi tiết */}
            <Card title="Lịch sử bản ghi sức khỏe" className="mt-6">
                {healthData?.records?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cân nặng</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Chiều cao</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">BMI</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Huyết áp</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nhịp tim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {healthData.records.slice(0, 10).map((record, index) => {
                                    const bmi = calculateBMI(record.weight, record.height);
                                    const bmiStatus = getBMIStatus(bmi);

                                    return (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">
                                                {formatDate(record.createdAt)}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {record.weight || '--'} kg
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {record.height || '--'} cm
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {bmi && (
                                                    <span className={`px-2 py-1 rounded-full text-xs ${bmiStatus.bg} ${bmiStatus.color}`}>
                                                        {bmi}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {record.bloodPressure?.systolic
                                                    ? `${record.bloodPressure.systolic}/${record.bloodPressure.diastolic}`
                                                    : '--'
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {record.heartRate || '--'} bpm
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        Chưa có dữ liệu sức khỏe
                    </div>
                )}
            </Card>
        </div>
    );
}
