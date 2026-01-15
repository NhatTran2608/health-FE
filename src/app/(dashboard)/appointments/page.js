/**
 * ===================================
 * TRANG ĐẶT LỊCH KHÁM - USER
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUser, FiPhone, FiFileText } from 'react-icons/fi';
import { Card, Button, Loading, Modal } from '@/components';
import { doctorService, appointmentService } from '@/services';
import { formatDate } from '@/utils';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
};

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy'
};

export default function AppointmentsPage() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        patientName: '',
        phoneNumber: '',
        description: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await doctorService.getAvailable();
            if (response.data) {
                setDoctors(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách bác sĩ');
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getMyAppointments();
            if (response.data) {
                setAppointments(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await appointmentService.create(formData);
            toast.success('Đặt lịch thành công! Vui lòng chờ xác nhận từ admin.');
            setShowModal(false);
            setFormData({ doctorId: '', appointmentDate: '', appointmentTime: '', patientName: '', phoneNumber: '', description: '' });
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
        try {
            await appointmentService.cancel(id);
            toast.success('Hủy lịch hẹn thành công');
            fetchAppointments();
        } catch (error) {
            toast.error('Không thể hủy lịch hẹn này');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Đặt lịch khám</h1>
                    <p className="text-gray-500">Đặt lịch hẹn với bác sĩ</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <FiCalendar /> Đặt lịch mới
                </Button>
            </div>

            {/* Lịch hẹn của tôi */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Lịch hẹn của tôi</h2>
                {appointments.length === 0 ? (
                    <Card>
                        <p className="text-center text-gray-400 py-8">Chưa có lịch hẹn nào</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <Card key={appointment._id}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {appointment.doctorId?.name || 'Bác sĩ'}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[appointment.status]}`}>
                                                {STATUS_LABELS[appointment.status]}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {appointment.doctorId?.specialty}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                                            <span className="flex items-center gap-1">
                                                <FiCalendar /> {formatDate(appointment.appointmentDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock /> {appointment.appointmentTime}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiUser /> {appointment.patientName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiPhone /> {appointment.phoneNumber}
                                            </span>
                                        </div>
                                        {appointment.description && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <FiFileText className="inline mr-1" />
                                                {appointment.description}
                                            </p>
                                        )}
                                        {appointment.adminNote && (
                                            <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                                                <strong>Ghi chú từ admin:</strong> {appointment.adminNote}
                                            </p>
                                        )}
                                    </div>
                                    {appointment.status === 'pending' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCancel(appointment._id)}
                                        >
                                            Hủy lịch
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal đặt lịch */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Đặt lịch khám"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Chọn bác sĩ *</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            required
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name} - {doctor.specialty}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày khám *</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.appointmentDate}
                                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Giờ khám *</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.appointmentTime}
                                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Họ tên *</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            pattern="[0-9]{10,11}"
                            placeholder="0123456789"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mô tả triệu chứng/Lý do khám</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            maxLength={500}
                            placeholder="Mô tả ngắn gọn về triệu chứng hoặc lý do khám..."
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit">Xác nhận đặt lịch</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

