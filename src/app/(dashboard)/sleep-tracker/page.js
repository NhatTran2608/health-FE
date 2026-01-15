/**
 * ===================================
 * TRANG THEO DÕI GIẤC NGỦ
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiMoon } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal } from '@/components';
import { sleepTrackerService } from '@/services';
import { formatDate } from '@/utils';

const QUALITY_LABELS = {
    excellent: 'Tuyệt vời',
    good: 'Tốt',
    fair: 'Trung bình',
    poor: 'Kém'
};

export default function SleepTrackerPage() {
    const [sleeps, setSleeps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSleep, setSelectedSleep] = useState(null);
    const [formData, setFormData] = useState({
        sleepDate: new Date().toISOString().split('T')[0],
        bedtime: '22:00',
        wakeTime: '07:00',
        quality: 'good',
        wakeUpCount: 0,
        note: ''
    });

    useEffect(() => {
        fetchSleeps();
    }, []);

    const fetchSleeps = async () => {
        try {
            setLoading(true);
            const response = await sleepTrackerService.getAll({ limit: 20 });
            if (response.data) {
                setSleeps(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const formatSleepTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                wakeUpCount: parseInt(formData.wakeUpCount) || 0
            };
            if (selectedSleep) {
                await sleepTrackerService.update(selectedSleep._id, data);
                toast.success('Cập nhật thành công');
            } else {
                await sleepTrackerService.add(data);
                toast.success('Thêm bản ghi thành công');
            }
            setShowModal(false);
            fetchSleeps();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await sleepTrackerService.delete(id);
            toast.success('Xóa thành công');
            fetchSleeps();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Theo dõi giấc ngủ</h1>
                    <p className="text-gray-500">Ghi lại thông tin giấc ngủ của bạn</p>
                </div>
                <Button onClick={() => { setSelectedSleep(null); setFormData({ sleepDate: new Date().toISOString().split('T')[0], bedtime: '22:00', wakeTime: '07:00', quality: 'good', wakeUpCount: 0, note: '' }); setShowModal(true); }}>
                    <FiPlus /> Thêm bản ghi
                </Button>
            </div>

            {sleeps.length === 0 ? (
                <EmptyState
                    icon="😴"
                    title="Chưa có bản ghi"
                    description="Bắt đầu theo dõi giấc ngủ của bạn"
                />
            ) : (
                <div className="space-y-3">
                    {sleeps.map((sleep) => (
                        <Card key={sleep._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="text-3xl">😴</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{formatDate(sleep.sleepDate)}</h3>
                                        <div className="mt-2 flex gap-4 text-sm text-gray-600">
                                            <span>🌙 {sleep.bedtime}</span>
                                            <span>☀️ {sleep.wakeTime}</span>
                                            <span>⏱️ {formatSleepTime(sleep.totalSleepMinutes || 0)}</span>
                                        </div>
                                        <div className="mt-2 flex gap-4 text-sm">
                                            <span className={`px-2 py-1 rounded ${sleep.quality === 'excellent' ? 'bg-green-100 text-green-800' : sleep.quality === 'good' ? 'bg-blue-100 text-blue-800' : sleep.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {QUALITY_LABELS[sleep.quality]}
                                            </span>
                                            {sleep.wakeUpCount > 0 && <span>🔄 Thức dậy {sleep.wakeUpCount} lần</span>}
                                        </div>
                                        {sleep.note && <p className="text-sm text-gray-600 mt-2">{sleep.note}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setSelectedSleep(sleep); setFormData({ sleepDate: sleep.sleepDate.split('T')[0], bedtime: sleep.bedtime, wakeTime: sleep.wakeTime, quality: sleep.quality, wakeUpCount: sleep.wakeUpCount || 0, note: sleep.note || '' }); setShowModal(true); }}
                                    >
                                        <FiEdit2 />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(sleep._id)}
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
                title={selectedSleep ? 'Sửa bản ghi' : 'Thêm bản ghi giấc ngủ'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày ngủ</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.sleepDate}
                            onChange={(e) => setFormData({ ...formData, sleepDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Giờ đi ngủ</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.bedtime}
                                onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Giờ thức dậy</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.wakeTime}
                                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Chất lượng</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.quality}
                                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                            >
                                {Object.entries(QUALITY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số lần thức giấc</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={formData.wakeUpCount}
                                onChange={(e) => setFormData({ ...formData, wakeUpCount: e.target.value })}
                                min="0"
                            />
                        </div>
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



