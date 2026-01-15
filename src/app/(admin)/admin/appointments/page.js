/**
 * ===================================
 * TRANG QUẢN LÝ LỊCH HẸN - ADMIN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiEye, FiCalendar, FiClock, FiUser, FiPhone } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal, Pagination } from '@/components';
import { appointmentService } from '@/services';
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

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [action, setAction] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [statusFilter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await appointmentService.getAll(params);
            if (response.data) {
                setAppointments(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await appointmentService.updateStatus(selectedAppointment._id, action, adminNote);
            toast.success(`Đã ${action === 'approved' ? 'duyệt' : action === 'rejected' ? 'từ chối' : 'cập nhật'} lịch hẹn thành công`);
            setShowActionModal(false);
            setAdminNote('');
            fetchAppointments();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    const pendingCount = appointments.filter(a => a.status === 'pending').length;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h1>
                    <p className="text-gray-500">Duyệt và quản lý lịch hẹn khám bệnh</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="px-3 py-2 border rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>

            {pendingCount > 0 && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        <strong>Có {pendingCount} lịch hẹn đang chờ xác nhận</strong>
                    </p>
                </div>
            )}

            {appointments.length === 0 ? (
                <EmptyState
                    icon="📅"
                    title="Chưa có lịch hẹn"
                    description="Chưa có lịch hẹn nào trong hệ thống"
                />
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <Card key={appointment._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg">
                                            {appointment.patientName}
                                        </h3>
                                        <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[appointment.status]}`}>
                                            {STATUS_LABELS[appointment.status]}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-1">
                                            <FiUser /> <strong>Bác sĩ:</strong> {appointment.doctorId?.name || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiCalendar /> {formatDate(appointment.appointmentDate)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiClock /> {appointment.appointmentTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FiPhone /> {appointment.phoneNumber}
                                        </div>
                                    </div>
                                    {appointment.description && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Mô tả:</strong> {appointment.description}
                                        </p>
                                    )}
                                    {appointment.userId && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Người đặt: {appointment.userId.name} ({appointment.userId.email})
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setSelectedAppointment(appointment); setShowDetailModal(true); }}
                                    >
                                        <FiEye /> Chi tiết
                                    </Button>
                                    {appointment.status === 'pending' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setSelectedAppointment(appointment); setAction('approved'); setShowActionModal(true); }}
                                            >
                                                <FiCheck /> Duyệt
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { setSelectedAppointment(appointment); setAction('rejected'); setShowActionModal(true); }}
                                            >
                                                <FiX /> Từ chối
                                            </Button>
                                        </>
                                    )}
                                    {appointment.status === 'approved' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => { setSelectedAppointment(appointment); setAction('completed'); setShowActionModal(true); }}
                                        >
                                            Hoàn thành
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal chi tiết */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Chi tiết lịch hẹn"
            >
                {selectedAppointment && (
                    <div className="space-y-3">
                        <div>
                            <strong>Bác sĩ:</strong> {selectedAppointment.doctorId?.name || 'N/A'}
                        </div>
                        <div>
                            <strong>Chuyên khoa:</strong> {selectedAppointment.doctorId?.specialty || 'N/A'}
                        </div>
                        <div>
                            <strong>Ngày khám:</strong> {formatDate(selectedAppointment.appointmentDate)}
                        </div>
                        <div>
                            <strong>Giờ khám:</strong> {selectedAppointment.appointmentTime}
                        </div>
                        <div>
                            <strong>Họ tên:</strong> {selectedAppointment.patientName}
                        </div>
                        <div>
                            <strong>Số điện thoại:</strong> {selectedAppointment.phoneNumber}
                        </div>
                        {selectedAppointment.description && (
                            <div>
                                <strong>Mô tả:</strong> {selectedAppointment.description}
                            </div>
                        )}
                        <div>
                            <strong>Trạng thái:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${STATUS_COLORS[selectedAppointment.status]}`}>
                                {STATUS_LABELS[selectedAppointment.status]}
                            </span>
                        </div>
                        {selectedAppointment.adminNote && (
                            <div>
                                <strong>Ghi chú:</strong> {selectedAppointment.adminNote}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal duyệt/từ chối */}
            <Modal
                isOpen={showActionModal}
                onClose={() => { setShowActionModal(false); setAdminNote(''); }}
                title={action === 'approved' ? 'Duyệt lịch hẹn' : action === 'rejected' ? 'Từ chối lịch hẹn' : 'Hoàn thành lịch hẹn'}
            >
                <div className="space-y-4">
                    <p>Bạn có chắc muốn {action === 'approved' ? 'duyệt' : action === 'rejected' ? 'từ chối' : 'đánh dấu hoàn thành'} lịch hẹn này?</p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={3}
                            placeholder="Nhập ghi chú nếu cần..."
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => { setShowActionModal(false); setAdminNote(''); }}>Hủy</Button>
                        <Button onClick={handleStatusUpdate}>
                            {action === 'approved' ? 'Duyệt' : action === 'rejected' ? 'Từ chối' : 'Xác nhận'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

