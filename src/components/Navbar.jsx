/**
 * ===================================
 * COMPONENT: NAVBAR - THANH ĐIỀU HƯỚNG
 * ===================================
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import { authService } from '@/services';

export default function Navbar({ user, onToggleSidebar, isAdmin = false }) {
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Xử lý đăng xuất
    const handleLogout = async () => {
        await authService.logout();
        router.push('/login');
    };

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="px-4 h-16 flex items-center justify-between">
                {/* Left: Menu button & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        <FiMenu size={24} />
                    </button>

                    <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        <span className="font-bold text-xl text-primary-600 hidden sm:block">
                            {isAdmin ? 'Admin Panel' : 'Health Care'}
                        </span>
                    </Link>
                </div>

                {/* Center: Search bar */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </form>

                {/* Right: User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-medium text-sm">{user?.name || 'Người dùng'}</p>
                            {user?.role === 'admin' && (
                                <p className="text-xs text-purple-600 font-medium">Admin</p>
                            )}
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <FiUser />
                                <span>Hồ sơ cá nhân</span>
                            </Link>
                            <hr className="my-2" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                            >
                                <FiLogOut />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
