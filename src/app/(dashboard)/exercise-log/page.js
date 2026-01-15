/**
 * ===================================
 * TRANG NHẬT KÝ TẬP LUYỆN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiActivity } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal } from '@/components';
import { exerciseLogService } from '@/services';
import { formatDate } from '@/utils';

const EXERCISE_TYPES = {
    running: { label: 'Chạy bộ', icon: '🏃' },
    walking: { label: 'Đi bộ', icon: '🚶' },
    cycling: { label: 'Đạp xe', icon: '🚴' },
    swimming: { label: 'Bơi lội', icon: '🏊' },
    gym: { label: 'Gym', icon: '💪' },
    yoga: { label: 'Yoga', icon: '🧘' },
    dancing: { label: 'Khiêu vũ', icon: '💃' },
    sports: { label: 'Thể thao', icon: '⚽' },
    other: { label: 'Khác', icon: '🏋️' }
};

export default function ExerciseLogPage() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [formData, setFormData] = useState({
        exerciseType: 'running',
        exerciseName: '',
        duration: '',
        intensity: 'moderate',
        caloriesBurned: '',
        distance: '',
        exerciseDate: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await exerciseLogService.getAll({ limit: 20 });
            if (response.data) {
                setExercises(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                duration: parseInt(formData.duration),
                caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : undefined,
                distance: formData.distance ? parseFloat(formData.distance) : undefined
            };
            if (selectedExercise) {
                await exerciseLogService.update(selectedExercise._id, data);
                toast.success('Cập nhật thành công');
            } else {
                await exerciseLogService.add(data);
                toast.success('Thêm bản ghi thành công');
            }
            setShowModal(false);
            fetchExercises();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await exerciseLogService.delete(id);
            toast.success('Xóa thành công');
            fetchExercises();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Nhật ký tập luyện</h1>
                    <p className="text-gray-500">Ghi lại các hoạt động thể chất của bạn</p>
                </div>
                <Button onClick={() => { setSelectedExercise(null); setFormData({ exerciseType: 'running', exerciseName: '', duration: '', intensity: 'moderate', caloriesBurned: '', distance: '', exerciseDate: new Date().toISOString().split('T')[0], note: '' }); setShowModal(true); }}>
                    <FiPlus /> Thêm bản ghi
                </Button>
            </div>

            {exercises.length === 0 ? (
                <EmptyState
                    icon="🏃"
                    title="Chưa có bản ghi"
                    description="Bắt đầu ghi lại các hoạt động tập luyện của bạn"
                />
            ) : (
                <div className="space-y-3">
                    {exercises.map((exercise) => (
                        <Card key={exercise._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="text-3xl">{EXERCISE_TYPES[exercise.exerciseType]?.icon || '🏋️'}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{exercise.exerciseName}</h3>
                                        <p className="text-sm text-gray-500">{EXERCISE_TYPES[exercise.exerciseType]?.label}</p>
                                        <div className="mt-2 flex gap-4 text-sm text-gray-600">
                                            <span>⏱️ {exercise.duration} phút</span>
                                            {exercise.distance && <span>📏 {exercise.distance} km</span>}
                                            {exercise.caloriesBurned && <span>🔥 {exercise.caloriesBurned} cal</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(exercise.exerciseDate)}</p>
                                        {exercise.note && <p className="text-sm text-gray-600 mt-2">{exercise.note}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setSelectedExercise(exercise); setFormData({ exerciseType: exercise.exerciseType, exerciseName: exercise.exerciseName, duration: exercise.duration, intensity: exercise.intensity, caloriesBurned: exercise.caloriesBurned || '', distance: exercise.distance || '', exerciseDate: exercise.exerciseDate.split('T')[0], note: exercise.note || '' }); setShowModal(true); }}
                                    >
                                        <FiEdit2 />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(exercise._id)}
                                    >
                                        <FiTrash2 />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={selectedExercise ? 'Sửa bản ghi' : 'Thêm bản ghi tập luyện'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Loại bài tập</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.exerciseType}
                            onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                            required
                        >
                            {Object.entries(EXERCISE_TYPES).map(([key, value]) => (
                                <option key={key} value={key}>{value.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên bài tập</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.exerciseName}
                            onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Thời gian (phút)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cường độ</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.intensity}
                                onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                            >
                                <option value="low">Thấp</option>
                                <option value="moderate">Trung bình</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Khoảng cách (km)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.distance}
                                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Calo đốt cháy</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.caloriesBurned}
                                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày tập</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.exerciseDate}
                            onChange={(e) => setFormData({ ...formData, exerciseDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit">Lưu</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}



