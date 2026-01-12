/**
 * ===================================
 * COMPONENT: LOADING - HIỂN THỊ LOADING
 * ===================================
 */

export default function Loading({ size = 'md', text = 'Đang tải...' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`} />
            {text && <p className="mt-4 text-gray-500">{text}</p>}
        </div>
    );
}

// Component Loading toàn trang
export function FullPageLoading() {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <Loading size="lg" text="Đang tải..." />
        </div>
    );
}
