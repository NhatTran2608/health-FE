/**
 * ===================================
 * COMPONENT: PAGINATION - PHÂN TRANG
 * ===================================
 */

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    // Không hiển thị nếu chỉ có 1 trang
    if (totalPages <= 1) return null;

    // Tạo mảng các trang để hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Số trang tối đa hiển thị

        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {/* Nút Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FiChevronLeft />
            </button>

            {/* Các số trang */}
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                        w-10 h-10 rounded-lg
                        ${currentPage === page
                            ? 'bg-primary-500 text-white'
                            : 'border hover:bg-gray-100'
                        }
                    `}
                >
                    {page}
                </button>
            ))}

            {/* Nút Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FiChevronRight />
            </button>
        </div>
    );
}
