/**
 * ===================================
 * COMPONENT: CARD - THẺ HIỂN THỊ
 * ===================================
 */

export default function Card({
    children,
    title,
    subtitle,
    className = '',
    headerAction,
    ...props
}) {
    return (
        <div
            className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
            {...props}
        >
            {(title || headerAction) && (
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div>
                        {title && <h3 className="font-semibold text-lg">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

// Card con cho thống kê
export function StatCard({ icon, label, value, change, changeType = 'neutral' }) {
    const changeColors = {
        positive: 'text-green-500',
        negative: 'text-red-500',
        neutral: 'text-gray-500'
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
                <div className="text-3xl">{icon}</div>
                {change && (
                    <span className={`text-sm ${changeColors[changeType]}`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
        </div>
    );
}
