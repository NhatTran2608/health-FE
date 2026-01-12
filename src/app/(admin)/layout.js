/**
 * ===================================
 * LAYOUT CHO ADMIN (Protected - Admin Only)
 * ===================================
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Sidebar, FullPageLoading } from '@/components';
import { authService } from '@/services';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                router.push('/login');
                return;
            }

            try {
                const response = await authService.getMe();
                const userData = response.data;

                // Kiểm tra phải là admin
                if (userData.role !== 'admin') {
                    router.push('/dashboard');
                    return;
                }

                setUser(userData);
            } catch (error) {
                authService.logout();
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return <FullPageLoading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                user={user}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                isAdmin={true}
            />

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isAdmin={true}
            />

            <main className="pt-16 lg:pl-64 min-h-screen">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
