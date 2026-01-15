/**
 * ===================================
 * TRANG THEO DÕI LƯỢNG NƯỚC UỐNG
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiDroplet } from 'react-icons/fi';
import { Card, Button, Loading, EmptyState, Modal } from '@/components';
import { waterIntakeService } from '@/services';
import { formatDate } from '@/utils';

export default function WaterIntakePage() {
    const [intakes, setIntakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ amount: '', date: new Date().toISOString().split('T')[0], note: '' });

    useEffect(() => {
        fetchIntakes();
        fetchDailyTotal();
    }, []);

    const fetchIntakes = async () => {
        try {
            setLoading(true);
            const response = await waterIntakeService.getAll({ limit: 20 });
            if (response.data) {
                setIntakes(response.data || []);
            }
        } catch (error) {
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyTotal = async () => {
        try {
            const response = await waterIntakeService.getDailyTotal();
            if (response.data) {
                setDailyTotal(response.data.total || 0);
            }
        } catch (error) {
            // Ignore
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await waterIntakeService.add({
                ...formData,
                amount: parseInt(formData.amount)
            });
            toast.success('Thêm bản ghi thành công');
            setShowModal(false);
            setFormData({ amount: '', date: new Date().toISOString().split('T')[0], note: '' });
            fetchIntakes();
            fetchDailyTotal();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa?')) return;
        try {
            await waterIntakeService.delete(id);
            toast.success('Xóa thành công');
            fetchIntakes();
            fetchDailyTotal();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    if (loading) return <Loading text="Đang tải..." />;

    const targetAmount = 2000; // 2L nước mỗi ngày
    const progress = Math.min(100, (dailyTotal / targetAmount) * 100);

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Theo dõi lượng nước uống</h1>
                    <p className="text-gray-500">Ghi lại lượng nước bạn uống mỗi ngày</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <FiPlus /> Thêm bản ghi
                </Button>
            </div>

            {/* Thống kê hôm nay */}
            <Card className="mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">💧</div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">Hôm nay</h3>
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span>{dailyTotal} ml / {targetAmount} ml</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Danh sách */}
            {intakes.length === 0 ? (
                <EmptyState
                    icon="💧"
                    title="Chưa có bản ghi"
                    description="Bắt đầu ghi lại lượng nước bạn uống"
                />
            ) : (
                <div className="space-y-3">
                    {intakes.map((intake) => (
                        <Card key={intake._id}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">💧</div>
                                    <div>
                                        <p className="font-semibold">{intake.amount} ml</p>
                                        <p className="text-sm text-gray-500">{formatDate(intake.date)}</p>
                                        {intake.note && <p className="text-sm text-gray-600 mt-1">{intake.note}</p>}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(intake._id)}
                                >
                                    <FiTrash2 />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal thêm */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Thêm bản ghi uống nước"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Lượng nước (ml)</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ngày</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit">Thêm</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}



