/**
 * ===================================
 * ROOT LAYOUT - LAYOUT GỐC
 * ===================================
 */

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata = {
    title: 'Health Care - Hệ thống Tư vấn & Quản lý Sức khỏe',
    description: 'Hệ thống quản lý và tư vấn sức khỏe cá nhân',
    keywords: 'sức khỏe, tư vấn, quản lý, health care',
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <body className={inter.className}>
                {children}
                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                        success: {
                            style: {
                                background: '#10b981',
                            },
                        },
                        error: {
                            style: {
                                background: '#ef4444',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
