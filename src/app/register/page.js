/**
 * ===================================
 * TRANG ĐĂNG KÝ
 * ===================================
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiCalendar } from 'react-icons/fi';
import { authService } from '@/services';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const { confirmPassword, ...userData } = formData;
            await authService.register(userData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in my-8">
                {/* Logo & Title */}
                <div className="text-center mb-6">
                    <span className="text-5xl">🏥</span>
                    <h1 className="text-2xl font-bold mt-4 text-gray-800">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Tạo tài khoản để sử dụng hệ thống
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Họ tên */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên *
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nguyễn Văn A"
                                className={`
                                    w-full pl-10 pr-4 py-2.5 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary-500
                                    ${errors.name ? 'border-red-500' : 'border-gray-300'}
                                `}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className={`
                                    w-full pl-10 pr-4 py-2.5 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary-500
                                    ${errors.email ? 'border-red-500' : 'border-gray-300'}
                                `}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••"
                                    className={`
                                        w-full pl-10 pr-10 py-2.5 border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-primary-500
                                        ${errors.password ? 'border-red-500' : 'border-gray-300'}
                                    `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận *
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••"
                                className={`
                                    w-full px-4 py-2.5 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary-500
                                    ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                                `}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/* Phone & DOB row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0123456789"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh *
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={`
                                        w-full pl-10 pr-4 py-2.5 border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-primary-500
                                        ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}
                                    `}
                                />
                            </div>
                            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                    className="text-primary-500 focus:ring-primary-500"
                                />
                                <span>Nam</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                    className="text-primary-500 focus:ring-primary-500"
                                />
                                <span>Nữ</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={handleChange}
                                    className="text-primary-500 focus:ring-primary-500"
                                />
                                <span>Khác</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang xử lý...
                            </span>
                        ) : (
                            'Đăng ký'
                        )}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center mt-6 text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-primary-500 hover:underline font-medium">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
