/**
 * ===================================
 * TRANG CÀI ĐẶT HỆ THỐNG - ADMIN
 * ===================================
 */

'use client';

import { useState } from 'react';
import { FiSettings, FiDatabase, FiShield, FiBell } from 'react-icons/fi';
import { Card } from '@/components';

export default function AdminSettingsPage() {
    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiSettings />
                    Cài đặt hệ thống
                </h1>
                <p className="text-gray-500">Quản lý cấu hình hệ thống</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Database Settings */}
                <Card title="Cơ sở dữ liệu">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Trạng thái kết nối</p>
                                <p className="text-sm text-gray-500">MongoDB</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                Đang hoạt động
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Sao lưu tự động</p>
                                <p className="text-sm text-gray-500">Mỗi ngày lúc 2:00 AM</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                Đã bật
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Security Settings */}
                <Card title="Bảo mật">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">JWT Token Expiry</p>
                                <p className="text-sm text-gray-500">Thời gian hết hạn token</p>
                            </div>
                            <span className="text-sm font-medium text-gray-700">7 ngày</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Xác thực 2 yếu tố</p>
                                <p className="text-sm text-gray-500">2FA cho admin</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                                Chưa bật
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card title="Thông báo">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email thông báo</p>
                                <p className="text-sm text-gray-500">Gửi email khi có user mới</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* System Info */}
                <Card title="Thông tin hệ thống">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phiên bản</span>
                            <span className="font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Node.js</span>
                            <span className="font-medium">v20.x</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">MongoDB</span>
                            <span className="font-medium">v7.x</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
