
import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    loading,
    children,
    disabled,
    ...props
}: ButtonProps) {

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:bg-blue-800',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200',
        outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            className={clsx(
                'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            {children}
        </button>
    );
}
