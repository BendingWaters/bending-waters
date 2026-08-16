
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'glass' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    className?: string;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    href,
    className = '',
    ...props
}: ButtonProps) => {

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none rounded-none text-white";

    const variants = {
        primary: "bg-np-orange text-white hover:bg-black hover:text-white uppercase disabled:opacity-50 disabled:cursor-not-allowed",
        glass: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm",
        outline: "border border-current bg-transparent text-white hover:bg-white/10"
    };

    const sizes = {
        sm: "text-sm px-4 py-2",
        md: "text-base px-6 py-3",
        lg: "text-lg px-8 py-4"
    };

    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];

    const combinedClassName = cn(baseStyles, variantStyles, sizeStyles, className);

    if (href) {
        return (
            <Link href={href} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
