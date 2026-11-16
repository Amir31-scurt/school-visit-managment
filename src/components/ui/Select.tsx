import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  requiredMark?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, requiredMark, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 text-start"
          >
            {label}
            {requiredMark && <span className="text-red-600 ms-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={twMerge(
              'flex w-full min-h-[42px] appearance-none rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white ps-3.5 pe-9 py-2 text-sm text-[rgb(var(--color-text))] transition-colors hover:border-zinc-400 focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 disabled:cursor-not-allowed disabled:bg-[rgb(var(--color-surface-muted))] disabled:opacity-70 text-start cursor-pointer',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/15',
              className
            )}
            {...props}
          >
            {options.map((opt, idx) => (
              <option key={`${opt.value}-${idx}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
        {error && (
          <span id={errorId} role="alert" className="text-xs font-medium text-red-600 mt-1.5 text-start block">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
