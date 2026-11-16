import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  dot?: boolean;
}

export const Badge = ({ className, variant = 'default', dot = false, children, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-zinc-100 text-zinc-700 border border-zinc-200/80',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-red-50 text-red-800 border border-red-200/80',
  };

  const dotColors = {
    default: 'bg-zinc-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    danger: 'bg-red-600',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={twMerge('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} aria-hidden="true" />}
      {children}
    </span>
  );
};
