/**
 * ===================================
 * LAYOUT CHO DASHBOARD (Protected)
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Sidebar, FullPageLoading } from '@/components';
import { authService } from '@/services';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Kiểm tra authentication khi load
    useEffect(() => {
        const checkAuth = async () => {
            // Kiểm tra token có tồn tại không
            if (!authService.isAuthenticated()) {
                router.push('/login');
                return;
            }

            try {
                // Lấy thông tin user từ API
                // BE trả về: { success, message, data: user }
                const response = await authService.getMe();
                setUser(response.data);
            } catch (error) {
                // Token hết hạn hoặc không hợp lệ
                authService.logout();
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    // Loading state
    if (loading) {
        return <FullPageLoading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar
                user={user}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <main className="pt-16 lg:pl-64 min-h-screen">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
