import { twMerge } from 'tailwind-merge';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      'bg-[rgb(var(--color-surface))] rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] p-5 sm:p-6 shadow-[0_1px_2px_rgba(24,24,27,0.03)]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
