/**
 * ===================================
 * COMPONENT: SIDEBAR - THANH BÊN
 * ===================================
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUser,
    FiActivity,
    FiMessageSquare,
    FiBell,
    FiBarChart2,
    FiSearch,
    FiX,
    FiUsers,
    FiShield,
    FiSettings,
    FiTrendingUp
} from 'react-icons/fi';

// Danh sách menu cho user
const userMenuItems = [
    { href: '/dashboard', icon: FiHome, label: 'Tổng quan' },
    { href: '/profile', icon: FiUser, label: 'Hồ sơ cá nhân' },
    { href: '/health-records', icon: FiActivity, label: 'Hồ sơ sức khỏe' },
    { href: '/chatbot', icon: FiMessageSquare, label: 'Tư vấn sức khỏe' },
    { href: '/reminders', icon: FiBell, label: 'Nhắc nhở' },
    { href: '/reports', icon: FiBarChart2, label: 'Thống kê' },
    { href: '/search', icon: FiSearch, label: 'Tìm kiếm' },
];

// Danh sách menu cho admin
const adminMenuItems = [
    { href: '/admin', icon: FiShield, label: 'Quản trị' },
    { href: '/admin/users', icon: FiUsers, label: 'Quản lý Users' },
    { href: '/admin/reports', icon: FiTrendingUp, label: 'Báo cáo tổng thể' },
    { href: '/admin/profile', icon: FiUser, label: 'Hồ sơ cá nhân' },
    { href: '/admin/settings', icon: FiSettings, label: 'Cài đặt' },
];

export default function Sidebar({ isOpen, onClose, isAdmin = false }) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay khi sidebar mở trên mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg z-40
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Close button (mobile) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                    <FiX size={20} />
                </button>

                {/* Menu items */}
                <nav className="p-4 pt-8 lg:pt-4">
                    <ul className="space-y-2">
                        {(isAdmin ? adminMenuItems : userMenuItems).map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg
                                            transition-colors duration-200
                                            ${isActive
                                                ? 'bg-primary-500 text-white'
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-sm text-primary-700 font-medium">
                            💡 Mẹo sức khỏe
                        </p>
                        <p className="text-xs text-primary-600 mt-1">
                            Uống đủ 2 lít nước mỗi ngày để giữ cơ thể khỏe mạnh!
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}
