/**
 * ===================================
 * COMPONENT: BUTTON - NÚT BẤM
 * ===================================
 */

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    onClick,
    ...props
}) {
    // Các variant styles
    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white',
        secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        ghost: 'hover:bg-gray-100 text-gray-700'
    };

    // Các size styles
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-lg font-medium
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${className}
            `}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
