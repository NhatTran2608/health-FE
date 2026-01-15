/**
 * ===================================
 * TRANG QUẢN LÝ BÁC SĨ - ADMIN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal } from '@/components';
import { doctorService } from '@/services';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        qualification: '',
        image: '',
        availableSlots: [],
        status: 'available'
    });
    const [newSlot, setNewSlot] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await doctorService.getAll();
            if (response.data) {
                setDoctors(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách bác sĩ');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedDoctor) {
                await doctorService.update(selectedDoctor._id, formData);
                toast.success('Cập nhật bác sĩ thành công');
            } else {
                await doctorService.create(formData);
                toast.success('Tạo bác sĩ thành công');
            }
            setShowModal(false);
            fetchDoctors();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async () => {
        try {
            await doctorService.delete(selectedDoctor._id);
            toast.success('Xóa bác sĩ thành công');
            setShowDeleteModal(false);
            fetchDoctors();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const addSlot = () => {
        if (newSlot && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newSlot)) {
            setFormData({
                ...formData,
                availableSlots: [...formData.availableSlots, newSlot]
            });
            setNewSlot('');
        } else {
            toast.error('Định dạng khung giờ không hợp lệ (VD: 08:00-10:00)');
        }
    };

    const removeSlot = (index) => {
        setFormData({
            ...formData,
            availableSlots: formData.availableSlots.filter((_, i) => i !== index)
        });
    };

    if (loading) return <Loading text="Đang tải..." />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý bác sĩ</h1>
                    <p className="text-gray-500">Thêm, sửa, xóa thông tin bác sĩ</p>
                </div>
                <Button onClick={() => { setSelectedDoctor(null); setFormData({ name: '', specialty: '', qualification: '', image: '', availableSlots: [], status: 'available' }); setShowModal(true); }}>
                    <FiPlus /> Thêm bác sĩ
                </Button>
            </div>

            {doctors.length === 0 ? (
                <EmptyState
                    icon="👨‍⚕️"
                    title="Chưa có bác sĩ"
                    description="Bắt đầu thêm bác sĩ vào hệ thống"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <Card key={doctor._id}>
                            <div className="flex items-start gap-4 mb-4">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                                ) : (
                                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                        <FiUser className="text-primary-600" size={24} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                    <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${doctor.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {doctor.status === 'available' ? 'Sẵn sàng' : 'Bận'}
                                </span>
                            </div>
                            {doctor.availableSlots && doctor.availableSlots.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">Khung giờ khám:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.availableSlots.map((slot, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedDoctor(doctor); setFormData({ name: doctor.name, specialty: doctor.specialty, qualification: doctor.qualification, image: doctor.image || '', availableSlots: doctor.availableSlots || [], status: doctor.status }); setShowModal(true); }}
                                >
                                    <FiEdit2 /> Sửa
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedDoctor(doctor); setShowDeleteModal(true); }}
                                >
                                    <FiTrash2 /> Xóa
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal thêm/sửa */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedDoctor ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên bác sĩ *</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Chuyên khoa *</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Trình độ *</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                            placeholder="VD: Tiến sĩ, Thạc sĩ..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">URL ảnh</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Khung giờ khám</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border rounded-lg"
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                placeholder="VD: 08:00-10:00"
                            />
                            <Button type="button" onClick={addSlot}>Thêm</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.availableSlots.map((slot, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm flex items-center gap-1">
                                    {slot}
                                    <button type="button" onClick={() => removeSlot(idx)} className="text-blue-700 hover:text-blue-900">
                                        <FiX size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Trạng thái</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="available">Sẵn sàng</option>
                            <option value="busy">Bận</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit">Lưu</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal xóa */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
            >
                <p className="mb-4">Bạn có chắc muốn xóa bác sĩ <strong>{selectedDoctor?.name}</strong>?</p>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </div>
            </Modal>
        </div>
    );
}

