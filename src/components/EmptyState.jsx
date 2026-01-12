/**
 * ===================================
 * COMPONENT: EMPTY STATE - TRỐNG DỮ LIỆU
 * ===================================
 */

export default function EmptyState({
    icon = '📭',
    title = 'Không có dữ liệu',
    description = 'Chưa có dữ liệu để hiển thị',
    action
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-6xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
