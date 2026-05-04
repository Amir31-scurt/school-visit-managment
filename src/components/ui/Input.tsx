import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1 text-start">{label}</label>}
        <input
          ref={ref}
          dir={props.dir || (['date', 'time', 'datetime-local', 'month', 'week'].includes(props.type || '') ? undefined : 'auto')}
          className={twMerge(
            'flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] disabled:cursor-not-allowed disabled:opacity-50 text-start cursor-pointer',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          onClick={(e) => {
            if (['date', 'time', 'datetime-local', 'month', 'week'].includes(props.type || '')) {
              try { e.currentTarget.showPicker(); } catch (err) {}
            }
            props.onClick?.(e);
          }}
          {...props}
        />
        {error && <span className="text-sm text-red-500 mt-1 text-start block" dir="auto">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
