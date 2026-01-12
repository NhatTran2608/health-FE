/**
 * ===================================
 * TRANG NHẮC NHỞ - QUẢN LÝ NHẮC NHỞ
 * ===================================
 * CRUD nhắc nhở sức khỏe (uống thuốc, tập thể dục, ngủ nghỉ...)
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiBell,
    FiClock,
    FiToggleLeft,
    FiToggleRight,
    FiCalendar
} from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal, Pagination } from '@/components';
import { reminderService } from '@/services';
import { formatDate } from '@/utils';

// Các loại nhắc nhở
const REMINDER_TYPES = [
    { value: 'medicine', label: 'Uống thuốc', icon: '💊', color: 'bg-red-100 text-red-600' },
    { value: 'exercise', label: 'Tập thể dục', icon: '🏃', color: 'bg-green-100 text-green-600' },
    { value: 'sleep', label: 'Ngủ nghỉ', icon: '😴', color: 'bg-purple-100 text-purple-600' },
    { value: 'water', label: 'Uống nước', icon: '💧', color: 'bg-blue-100 text-blue-600' },
    { value: 'meal', label: 'Bữa ăn', icon: '🍽️', color: 'bg-orange-100 text-orange-600' },
    { value: 'checkup', label: 'Khám bệnh', icon: '🏥', color: 'bg-pink-100 text-pink-600' },
    { value: 'other', label: 'Khác', icon: '📝', color: 'bg-gray-100 text-gray-600' }
];

// Các ngày trong tuần
const DAYS_OF_WEEK = [
    { value: 0, label: 'CN', fullLabel: 'Chủ nhật' },
    { value: 1, label: 'T2', fullLabel: 'Thứ 2' },
    { value: 2, label: 'T3', fullLabel: 'Thứ 3' },
    { value: 3, label: 'T4', fullLabel: 'Thứ 4' },
    { value: 4, label: 'T5', fullLabel: 'Thứ 5' },
    { value: 5, label: 'T6', fullLabel: 'Thứ 6' },
    { value: 6, label: 'T7', fullLabel: 'Thứ 7' }
];

export default function RemindersPage() {
    // State quản lý dữ liệu
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // State form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'other',
        time: '08:00',
        daysOfWeek: [1, 2, 3, 4, 5], // Mặc định các ngày trong tuần
        isActive: true
    });

    // Lấy danh sách reminders khi load
    useEffect(() => {
        fetchReminders();
    }, [pagination.page]);

    /**
     * Lấy danh sách nhắc nhở
     */
    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await reminderService.getAll({
                page: pagination.page,
                limit: pagination.limit
            });

            // BE trả về: { success, message, data: reminders[], pagination }
            // => response.data là mảng reminders, response.pagination là thông tin phân trang
            if (response.data) {
                setReminders(response.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination?.totalItems || 0,
                    totalPages: response.pagination?.totalPages || 0
                }));
            }
        } catch (error) {
            toast.error('Không thể tải danh sách nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mở modal thêm mới
     */
    const handleAdd = () => {
        setSelectedReminder(null);
        setFormData({
            title: '',
            description: '',
            type: 'other',
            time: '08:00',
            daysOfWeek: [1, 2, 3, 4, 5],
            isActive: true
        });
        setShowModal(true);
    };

    /**
     * Mở modal chỉnh sửa
     */
    const handleEdit = (reminder) => {
        setSelectedReminder(reminder);
        setFormData({
            title: reminder.title || '',
            description: reminder.description || '',
            type: reminder.type || 'other',
            time: reminder.time || '08:00',
            daysOfWeek: reminder.daysOfWeek || [],
            isActive: reminder.isActive ?? true
        });
        setShowModal(true);
    };

    /**
     * Mở modal xác nhận xóa
     */
    const handleDelete = (reminder) => {
        setSelectedReminder(reminder);
        setShowDeleteModal(true);
    };

    /**
     * Bật/tắt nhắc nhở
     */
    const handleToggle = async (reminder) => {
        try {
            await reminderService.toggle(reminder._id, !reminder.isActive);
            toast.success(reminder.isActive ? 'Đã tắt nhắc nhở' : 'Đã bật nhắc nhở');
            fetchReminders();
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    /**
     * Toggle ngày trong tuần
     */
    const toggleDay = (dayValue) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(dayValue)
                ? prev.daysOfWeek.filter(d => d !== dayValue)
                : [...prev.daysOfWeek, dayValue].sort((a, b) => a - b)
        }));
    };

    /**
     * Xử lý submit form (thêm/sửa)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề');
            return;
        }
        if (!formData.time) {
            toast.error('Vui lòng chọn thời gian');
            return;
        }
        if (formData.daysOfWeek.length === 0) {
            toast.error('Vui lòng chọn ít nhất một ngày');
            return;
        }

        try {
            setFormLoading(true);

            if (selectedReminder) {
                // Cập nhật
                await reminderService.update(selectedReminder._id, formData);
                toast.success('Cập nhật thành công!');
            } else {
                // Thêm mới
                await reminderService.create(formData);
                toast.success('Thêm nhắc nhở thành công!');
            }

            setShowModal(false);
            fetchReminders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setFormLoading(false);
        }
    };

    /**
     * Xác nhận xóa
     */
    const confirmDelete = async () => {
        try {
            await reminderService.delete(selectedReminder._id);
            toast.success('Xóa thành công!');
            setShowDeleteModal(false);
            fetchReminders();
        } catch (error) {
            toast.error('Không thể xóa nhắc nhở');
        }
    };

    /**
     * Lấy thông tin loại nhắc nhở
     */
    const getReminderType = (type) => {
        return REMINDER_TYPES.find(t => t.value === type) || REMINDER_TYPES[6];
    };

    /**
     * Format các ngày trong tuần
     */
    const formatDays = (days) => {
        if (!days || days.length === 0) return 'Không có ngày';
        if (days.length === 7) return 'Hàng ngày';
        if (JSON.stringify(days.sort()) === JSON.stringify([1, 2, 3, 4, 5])) return 'Thứ 2 - Thứ 6';
        if (JSON.stringify(days.sort()) === JSON.stringify([0, 6])) return 'Cuối tuần';
        return days.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ');
    };

    // Loading state
    if (loading && reminders.length === 0) {
        return <Loading text="Đang tải nhắc nhở..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Nhắc nhở</h1>
                    <p className="text-gray-500">Quản lý các nhắc nhở sức khỏe của bạn</p>
                </div>
                <Button onClick={handleAdd}>
                    <FiPlus /> Thêm nhắc nhở
                </Button>
            </div>

            {/* Thống kê nhanh */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-primary-600">{reminders.length}</p>
                    <p className="text-sm text-gray-500">Tổng nhắc nhở</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-green-600">
                        {reminders.filter(r => r.isActive).length}
                    </p>
                    <p className="text-sm text-gray-500">Đang hoạt động</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-red-600">
                        {reminders.filter(r => r.type === 'medicine').length}
                    </p>
                    <p className="text-sm text-gray-500">Nhắc uống thuốc</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">
                        {reminders.filter(r => r.type === 'exercise').length}
                    </p>
                    <p className="text-sm text-gray-500">Nhắc tập thể dục</p>
                </div>
            </div>

            {/* Danh sách reminders */}
            {reminders.length === 0 ? (
                <EmptyState
                    icon={<FiBell size={48} />}
                    title="Chưa có nhắc nhở nào"
                    description="Tạo nhắc nhở để không quên các hoạt động sức khỏe"
                    action={
                        <Button onClick={handleAdd}>
                            <FiPlus /> Thêm ngay
                        </Button>
                    }
                />
            ) : (
                <>
                    {/* Grid cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reminders.map((reminder) => {
                            const typeInfo = getReminderType(reminder.type);

                            return (
                                <Card
                                    key={reminder._id}
                                    className={`hover:shadow-lg transition-shadow ${!reminder.isActive ? 'opacity-60' : ''}`}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                                            <span className="text-xl">{typeInfo.icon}</span>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(reminder)}
                                            className={`text-2xl ${reminder.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {reminder.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                        {reminder.title}
                                    </h3>
                                    {reminder.description && (
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                            {reminder.description}
                                        </p>
                                    )}

                                    {/* Time & Days */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <FiClock />
                                            <span className="font-medium">{reminder.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiCalendar />
                                            <span>{formatDays(reminder.daysOfWeek)}</span>
                                        </div>
                                    </div>

                                    {/* Type badge */}
                                    <div className="mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${typeInfo.color}`}>
                                            {typeInfo.label}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(reminder)}
                                        >
                                            <FiEdit2 /> Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(reminder)}
                                            className="text-red-500 hover:bg-red-50"
                                        >
                                            <FiTrash2 /> Xóa
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Modal Thêm/Sửa */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedReminder ? 'Cập nhật nhắc nhở' : 'Thêm nhắc nhở mới'}
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    {/* Tiêu đề */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="VD: Uống thuốc huyết áp"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            rows="2"
                            placeholder="Mô tả chi tiết..."
                        />
                    </div>

                    {/* Loại nhắc nhở */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại nhắc nhở
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {REMINDER_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                    className={`p-2 rounded-lg border-2 transition-colors ${formData.type === type.value
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-xl block">{type.icon}</span>
                                    <span className="text-xs">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời gian <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Ngày trong tuần */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày lặp lại <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            {DAYS_OF_WEEK.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={`w-10 h-10 rounded-full font-medium transition-colors ${formData.daysOfWeek.includes(day.value)
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    title={day.fullLabel}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, daysOfWeek: [0, 1, 2, 3, 4, 5, 6] })}
                                className="text-xs text-primary-500 hover:underline"
                            >
                                Hàng ngày
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, daysOfWeek: [1, 2, 3, 4, 5] })}
                                className="text-xs text-primary-500 hover:underline"
                            >
                                Trong tuần
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, daysOfWeek: [0, 6] })}
                                className="text-xs text-primary-500 hover:underline"
                            >
                                Cuối tuần
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" loading={formLoading}>
                            {selectedReminder ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Xác nhận xóa */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                size="sm"
            >
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa nhắc nhở "{selectedReminder?.title}"?
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Xóa
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
