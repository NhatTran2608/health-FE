/**
 * ===================================
 * TRANG HỒ SƠ CÁ NHÂN
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiLock } from 'react-icons/fi';
import { Card, Button, Input, Loading, Modal } from '@/components';
import { authService, userService } from '@/services';
import { formatDate } from '@/utils';

export default function ProfilePage() {
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

    // Lấy thông tin user
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await authService.getMe();
            // BE trả về: { success, message, data: user }
            // API interceptor trả về: { success, message, data: user }
            // => response.data là user object
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

    // Xử lý cập nhật profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await userService.updateProfile(formData);
            // BE trả về: { success, message, data: user }
            // API interceptor trả về: { success, message, data: user }
            // => response.data là user object
            setUser(response.data);
            setIsEditing(false);
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setSaving(false);
        }
    };

    // Xử lý đổi mật khẩu
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
                <p className="text-gray-500">Quản lý thông tin tài khoản của bạn</p>
            </div>

            {/* Avatar & Basic Info */}
            <Card className="mb-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className={`
                            inline-block mt-2 px-3 py-1 rounded-full text-sm
                            ${user?.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }
                        `}>
                            {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
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
                <form onSubmit={handleUpdateProfile}>
                    {/* Họ tên */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiUser className="inline mr-2" />
                            Họ và tên
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        ) : (
                            <p className="py-2 text-gray-800">{user?.name}</p>
                        )}
                    </div>

                    {/* Email (không cho sửa) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiMail className="inline mr-2" />
                            Email
                        </label>
                        <p className="py-2 text-gray-500">{user?.email}</p>
                    </div>

                    {/* Số điện thoại */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiPhone className="inline mr-2" />
                            Số điện thoại
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        ) : (
                            <p className="py-2 text-gray-800">{user?.phone || 'Chưa cập nhật'}</p>
                        )}
                    </div>

                    {/* Ngày sinh */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FiCalendar className="inline mr-2" />
                            Ngày sinh
                        </label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        ) : (
                            <p className="py-2 text-gray-800">
                                {user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'}
                            </p>
                        )}
                    </div>

                    {/* Giới tính */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                        </label>
                        {isEditing ? (
                            <div className="flex gap-6">
                                {['male', 'female', 'other'].map((gender) => (
                                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            checked={formData.gender === gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="text-primary-500"
                                        />
                                        <span>{gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác'}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="py-2 text-gray-800">
                                {user?.gender === 'male' ? 'Nam' : user?.gender === 'female' ? 'Nữ' : 'Khác'}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    {isEditing && (
                        <div className="flex gap-3">
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

            {/* Change Password */}
            <Card title="Bảo mật" className="mt-6">
                <p className="text-gray-500 mb-4">
                    Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                </p>
                <Button
                    variant="outline"
                    onClick={() => setShowPasswordModal(true)}
                >
                    <FiLock className="mr-2" />
                    Đổi mật khẩu
                </Button>
            </Card>

            {/* Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="Đổi mật khẩu"
            >
                <form onSubmit={handleChangePassword}>
                    <Input
                        type="password"
                        label="Mật khẩu hiện tại"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        label="Mật khẩu mới"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        label="Xác nhận mật khẩu mới"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                    />
                    <div className="flex gap-3 mt-6">
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
        </div>
    );
}
