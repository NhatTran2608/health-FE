/**
 * ===================================
 * TRANG CHỦ - REDIRECT ĐẾN DASHBOARD HOẶC LOGIN
 * ===================================
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { FullPageLoading } from '@/components';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra đăng nhập và redirect
        if (authService.isAuthenticated()) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [router]);

    return <FullPageLoading />;
}
