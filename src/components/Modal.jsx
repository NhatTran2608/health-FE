/**
 * ===================================
 * COMPONENT: MODAL - HỘP THOẠI
 * ===================================
 */

'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) {
    // Các kích thước modal
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    // Ngăn scroll khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Không render nếu không mở
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className={`
                relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]}
                max-h-[90vh] overflow-hidden
                transform transition-all
            `}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Modal xác nhận
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Xác nhận',
    message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    confirmVariant = 'danger'
}) {
    const variants = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        primary: 'bg-primary-500 hover:bg-primary-600 text-white'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg ${variants[confirmVariant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
