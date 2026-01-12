/**
 * ===================================
 * TRANG HỒ SƠ SỨC KHỎE - DANH SÁCH
 * ===================================
 * Hiển thị danh sách các bản ghi sức khỏe
 * Cho phép thêm, sửa, xóa bản ghi
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiActivity,
    FiHeart,
    FiDroplet,
    FiThermometer
} from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal, Pagination } from '@/components';
import { healthRecordService } from '@/services';
import { formatDate, calculateBMI, getBMIStatus } from '@/utils';

export default function HealthRecordsPage() {
    // State quản lý dữ liệu
    const [records, setRecords] = useState([]);
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
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // State form data
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        bloodSugar: '',
        temperature: '',
        note: ''
    });

    // Lấy danh sách records khi load
    useEffect(() => {
        fetchRecords();
    }, [pagination.page]);

    /**
     * Lấy danh sách bản ghi sức khỏe
     */
    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await healthRecordService.getAll({
                page: pagination.page,
                limit: pagination.limit
            });

            // BE trả về: { success, message, data: records[], pagination }
            // API interceptor trả về cùng object
            // => response.data là mảng records, response.pagination là thông tin phân trang
            if (response.data) {
                setRecords(response.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination?.totalItems || 0,
                    totalPages: response.pagination?.totalPages || 0
                }));
            }
        } catch (error) {
            toast.error('Không thể tải danh sách hồ sơ sức khỏe');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mở modal thêm mới
     */
    const handleAdd = () => {
        setSelectedRecord(null);
        setFormData({
            height: '',
            weight: '',
            systolic: '',
            diastolic: '',
            heartRate: '',
            bloodSugar: '',
            temperature: '',
            note: ''
        });
        setShowModal(true);
    };

    /**
     * Mở modal chỉnh sửa
     */
    const handleEdit = (record) => {
        setSelectedRecord(record);
        setFormData({
            height: record.height || '',
            weight: record.weight || '',
            systolic: record.bloodPressure?.systolic || '',
            diastolic: record.bloodPressure?.diastolic || '',
            heartRate: record.heartRate || '',
            bloodSugar: record.bloodSugar || '',
            temperature: record.temperature || '',
            note: record.note || ''
        });
        setShowModal(true);
    };

    /**
     * Xem chi tiết
     */
    const handleView = (record) => {
        setSelectedRecord(record);
        setShowDetailModal(true);
    };

    /**
     * Mở modal xác nhận xóa
     */
    const handleDelete = (record) => {
        setSelectedRecord(record);
        setShowDeleteModal(true);
    };

    /**
     * Xử lý submit form (thêm/sửa)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.height && !formData.weight) {
            toast.error('Vui lòng nhập ít nhất chiều cao hoặc cân nặng');
            return;
        }

        try {
            setFormLoading(true);

            // Chuẩn bị data
            const data = {
                height: formData.height ? Number(formData.height) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                bloodPressure: (formData.systolic || formData.diastolic) ? {
                    systolic: formData.systolic ? Number(formData.systolic) : undefined,
                    diastolic: formData.diastolic ? Number(formData.diastolic) : undefined
                } : undefined,
                heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
                bloodSugar: formData.bloodSugar ? Number(formData.bloodSugar) : undefined,
                temperature: formData.temperature ? Number(formData.temperature) : undefined,
                note: formData.note || undefined
            };

            if (selectedRecord) {
                // Cập nhật
                await healthRecordService.update(selectedRecord._id, data);
                toast.success('Cập nhật thành công!');
            } else {
                // Thêm mới
                await healthRecordService.create(data);
                toast.success('Thêm mới thành công!');
            }

            setShowModal(false);
            fetchRecords();
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
            await healthRecordService.delete(selectedRecord._id);
            toast.success('Xóa thành công!');
            setShowDeleteModal(false);
            fetchRecords();
        } catch (error) {
            toast.error('Không thể xóa bản ghi');
        }
    };

    // Loading state
    if (loading && records.length === 0) {
        return <Loading text="Đang tải hồ sơ sức khỏe..." />;
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hồ sơ sức khỏe</h1>
                    <p className="text-gray-500">Quản lý các bản ghi sức khỏe của bạn</p>
                </div>
                <Button onClick={handleAdd}>
                    <FiPlus /> Thêm bản ghi
                </Button>
            </div>

            {/* Danh sách records */}
            {records.length === 0 ? (
                <EmptyState
                    icon={<FiActivity size={48} />}
                    title="Chưa có bản ghi nào"
                    description="Hãy thêm bản ghi sức khỏe đầu tiên của bạn"
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
                        {records.map((record) => {
                            const bmi = calculateBMI(record.weight, record.height);
                            const bmiStatus = getBMIStatus(bmi);

                            return (
                                <Card key={record._id} className="hover:shadow-lg transition-shadow">
                                    {/* Header với ngày */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(record.createdAt, 'datetime')}
                                        </span>
                                        {bmi && (
                                            <span className={`px-2 py-1 rounded-full text-xs ${bmiStatus.bg} ${bmiStatus.color}`}>
                                                BMI: {bmi}
                                            </span>
                                        )}
                                    </div>

                                    {/* Thông số */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {record.weight && (
                                            <div className="flex items-center gap-2">
                                                <FiActivity className="text-blue-500" />
                                                <span className="text-sm">{record.weight} kg</span>
                                            </div>
                                        )}
                                        {record.height && (
                                            <div className="flex items-center gap-2">
                                                <FiActivity className="text-green-500" />
                                                <span className="text-sm">{record.height} cm</span>
                                            </div>
                                        )}
                                        {record.bloodPressure?.systolic && (
                                            <div className="flex items-center gap-2">
                                                <FiHeart className="text-red-500" />
                                                <span className="text-sm">
                                                    {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                                                </span>
                                            </div>
                                        )}
                                        {record.heartRate && (
                                            <div className="flex items-center gap-2">
                                                <FiHeart className="text-pink-500" />
                                                <span className="text-sm">{record.heartRate} bpm</span>
                                            </div>
                                        )}
                                        {record.bloodSugar && (
                                            <div className="flex items-center gap-2">
                                                <FiDroplet className="text-purple-500" />
                                                <span className="text-sm">{record.bloodSugar} mg/dL</span>
                                            </div>
                                        )}
                                        {record.temperature && (
                                            <div className="flex items-center gap-2">
                                                <FiThermometer className="text-orange-500" />
                                                <span className="text-sm">{record.temperature}°C</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ghi chú (nếu có) */}
                                    {record.note && (
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {record.note}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleView(record)}
                                        >
                                            <FiEye />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(record)}
                                        >
                                            <FiEdit2 />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(record)}
                                            className="text-red-500 hover:bg-red-50"
                                        >
                                            <FiTrash2 />
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
                title={selectedRecord ? 'Cập nhật bản ghi' : 'Thêm bản ghi mới'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Chiều cao */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chiều cao (cm)
                            </label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 170"
                            />
                        </div>

                        {/* Cân nặng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cân nặng (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 65"
                            />
                        </div>

                        {/* Huyết áp tâm thu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Huyết áp tâm thu (mmHg)
                            </label>
                            <input
                                type="number"
                                value={formData.systolic}
                                onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 120"
                            />
                        </div>

                        {/* Huyết áp tâm trương */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Huyết áp tâm trương (mmHg)
                            </label>
                            <input
                                type="number"
                                value={formData.diastolic}
                                onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 80"
                            />
                        </div>

                        {/* Nhịp tim */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhịp tim (bpm)
                            </label>
                            <input
                                type="number"
                                value={formData.heartRate}
                                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 72"
                            />
                        </div>

                        {/* Đường huyết */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đường huyết (mg/dL)
                            </label>
                            <input
                                type="number"
                                value={formData.bloodSugar}
                                onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 100"
                            />
                        </div>

                        {/* Nhiệt độ */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nhiệt độ cơ thể (°C)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.temperature}
                                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="VD: 36.5"
                            />
                        </div>

                        {/* Ghi chú */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                rows="3"
                                placeholder="Ghi chú thêm về tình trạng sức khỏe..."
                            />
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
                            {selectedRecord ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Chi tiết */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Chi tiết bản ghi sức khỏe"
                size="md"
            >
                {selectedRecord && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <p className="text-gray-500">
                                {formatDate(selectedRecord.createdAt, 'datetime')}
                            </p>
                            {selectedRecord.weight && selectedRecord.height && (
                                <div className="mt-2">
                                    <span className={`px-3 py-1 rounded-full ${getBMIStatus(calculateBMI(selectedRecord.weight, selectedRecord.height)).bg}`}>
                                        BMI: {calculateBMI(selectedRecord.weight, selectedRecord.height)} - {getBMIStatus(calculateBMI(selectedRecord.weight, selectedRecord.height)).status}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {selectedRecord.height || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Chiều cao (cm)</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {selectedRecord.weight || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Cân nặng (kg)</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-red-600">
                                    {selectedRecord.bloodPressure?.systolic || '--'}/
                                    {selectedRecord.bloodPressure?.diastolic || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Huyết áp (mmHg)</p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-pink-600">
                                    {selectedRecord.heartRate || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Nhịp tim (bpm)</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    {selectedRecord.bloodSugar || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Đường huyết (mg/dL)</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                    {selectedRecord.temperature || '--'}
                                </p>
                                <p className="text-sm text-gray-500">Nhiệt độ (°C)</p>
                            </div>
                        </div>

                        {selectedRecord.note && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</p>
                                <p className="text-gray-600">{selectedRecord.note}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal Xác nhận xóa */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                size="sm"
            >
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.
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
