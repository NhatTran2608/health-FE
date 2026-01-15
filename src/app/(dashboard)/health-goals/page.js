/**
 * ===================================
 * TRANG MỤC TIÊU SỨC KHỎE
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiTarget } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal, Pagination } from '@/components';
import { healthGoalService } from '@/services';
import { formatDate } from '@/utils';

const GOAL_TYPES = {
    weight_loss: { label: 'Giảm cân', icon: '⚖️' },
    weight_gain: { label: 'Tăng cân', icon: '📈' },
    exercise: { label: 'Tập luyện', icon: '🏃' },
    water_intake: { label: 'Uống nước', icon: '💧' },
    sleep: { label: 'Giấc ngủ', icon: '😴' },
    nutrition: { label: 'Dinh dưỡng', icon: '🥗' },
    other: { label: 'Khác', icon: '🎯' }
};

const STATUS_COLORS = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800'
};

export default function HealthGoalsPage() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'other',
        targetValue: '',
        unit: '',
        endDate: ''
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await healthGoalService.getAll();
            if (response.data) {
                setGoals(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách mục tiêu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedGoal) {
                await healthGoalService.update(selectedGoal._id, formData);
                toast.success('Cập nhật mục tiêu thành công');
            } else {
                await healthGoalService.create(formData);
                toast.success('Tạo mục tiêu thành công');
            }
            setShowModal(false);
            fetchGoals();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async () => {
        try {
            await healthGoalService.delete(selectedGoal._id);
            toast.success('Xóa mục tiêu thành công');
            setShowDeleteModal(false);
            fetchGoals();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mục tiêu sức khỏe</h1>
                    <p className="text-gray-500">Theo dõi và đạt được mục tiêu của bạn</p>
                </div>
                <Button onClick={() => { setSelectedGoal(null); setFormData({ title: '', description: '', type: 'other', targetValue: '', unit: '', endDate: '' }); setShowModal(true); }}>
                    <FiPlus /> Tạo mục tiêu
                </Button>
            </div>

            {goals.length === 0 ? (
                <EmptyState
                    icon="🎯"
                    title="Chưa có mục tiêu"
                    description="Bắt đầu tạo mục tiêu sức khỏe của bạn"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => (
                        <Card key={goal._id}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{GOAL_TYPES[goal.type]?.icon || '🎯'}</span>
                                    <h3 className="font-semibold">{goal.title}</h3>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[goal.status]}`}>
                                    {goal.status === 'active' ? 'Đang thực hiện' : goal.status === 'completed' ? 'Hoàn thành' : goal.status === 'paused' ? 'Tạm dừng' : 'Đã hủy'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Tiến độ: {goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                                    <span>{Math.round(goal.progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, goal.progress)}%` }}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Hạn: {formatDate(goal.endDate)}</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedGoal(goal); setFormData({ title: goal.title, description: goal.description || '', type: goal.type, targetValue: goal.targetValue, unit: goal.unit, endDate: goal.endDate.split('T')[0] }); setShowModal(true); }}
                                >
                                    <FiEdit2 /> Sửa
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedGoal(goal); setShowDeleteModal(true); }}
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
                title={selectedGoal ? 'Sửa mục tiêu' : 'Tạo mục tiêu mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Loại</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            {Object.entries(GOAL_TYPES).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Mục tiêu</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.targetValue}
                                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Đơn vị</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="kg, L, giờ..."
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                        />
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
                <p className="mb-4">Bạn có chắc muốn xóa mục tiêu này?</p>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </div>
            </Modal>
        </div>
    );
}



