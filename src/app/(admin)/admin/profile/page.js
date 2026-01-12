/**
 * ===================================
 * TRANG HỒ SƠ CÁ NHÂN - ADMIN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiLock } from 'react-icons/fi';
import { Card, Button, Input, Loading, Modal } from '@/components';
import { authService, userService } from '@/services';
import { formatDate } from '@/utils';

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await authService.getMe();
            const userData = response.data;
            setUser(userData);
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                dateOfBirth: userData.dateOfBirth?.split('T')[0] || '',
                gender: userData.gender || 'male'
            });
        } catch (error) {
            toast.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await userService.updateProfile(formData);
            setUser(response.data);
            setIsEditing(false);
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setSaving(true);
        try {
            await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Đổi mật khẩu thành công!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading text="Đang tải thông tin..." />;
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                <p className="text-gray-500">Quản lý thông tin tài khoản Admin</p>
            </div>

            {/* Avatar & Basic Info */}
            <Card className="mb-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                            Quản trị viên
                        </span>
                    </div>
                </div>
            </Card>

            {/* Profile Form */}
            <Card
                title="Thông tin cá nhân"
                headerAction={
                    !isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <FiEdit2 className="mr-1" />
                            Chỉnh sửa
                        </Button>
                    )
                }
            >
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <Input
                            icon={FiUser}
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <Input
                            icon={FiPhone}
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Chưa cập nhật"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày sinh
                        </label>
                        <Input
                            type="date"
                            icon={FiCalendar}
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giới tính
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button type="submit" loading={saving}>
                                Lưu thay đổi
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: user?.name || '',
                                        phone: user?.phone || '',
                                        dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
                                        gender: user?.gender || 'male'
                                    });
                                }}
                            >
                                Hủy
                            </Button>
                        </div>
                    )}
                </form>
            </Card>

            {/* Security */}
            <Card title="Bảo mật" className="mt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Mật khẩu</p>
                        <p className="text-sm text-gray-500">Đổi mật khẩu đăng nhập</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <FiLock className="mr-2" />
                        Đổi mật khẩu
                    </Button>
                </div>
            </Card>

            {/* Password Modal */}
            {showPasswordModal && (
                <Modal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    title="Đổi mật khẩu"
                >
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu hiện tại
                            </label>
                            <Input
                                type="password"
                                icon={FiLock}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                icon={FiLock}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu mới
                            </label>
                            <Input
                                type="password"
                                icon={FiLock}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" loading={saving}>
                                Xác nhận
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPasswordModal(false)}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
