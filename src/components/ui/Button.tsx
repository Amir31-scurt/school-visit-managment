import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      primary: 'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-light))]',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      danger: 'bg-[rgb(var(--color-danger))] text-white hover:opacity-90',
      ghost: 'hover:bg-gray-100 text-gray-700'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        className={twMerge(baseClass, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
