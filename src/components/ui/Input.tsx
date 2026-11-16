import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, requiredMark, id, type, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const isPickerType = ['date', 'time', 'datetime-local', 'month', 'week'].includes(type || '');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 text-start"
          >
            {label}
            {requiredMark && <span className="text-red-600 ms-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          dir={props.dir || (isPickerType ? undefined : 'auto')}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={twMerge(
            'flex w-full min-h-[42px] rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white px-3.5 py-2 text-sm text-[rgb(var(--color-text))] placeholder:text-zinc-400 transition-colors hover:border-zinc-400 focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 disabled:cursor-not-allowed disabled:bg-[rgb(var(--color-surface-muted))] disabled:opacity-70 text-start',
            isPickerType && 'cursor-pointer',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15',
            className
          )}
          onClick={(e) => {
            if (isPickerType) {
              try { e.currentTarget.showPicker(); } catch {}
            }
            props.onClick?.(e);
          }}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-[rgb(var(--color-text-muted))] mt-1.5 text-start">
            {hint}
          </p>
        )}
        {error && (
          <span id={errorId} role="alert" className="text-xs font-medium text-red-600 mt-1.5 text-start block" dir="auto">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
