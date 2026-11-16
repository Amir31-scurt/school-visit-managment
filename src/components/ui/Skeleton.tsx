import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={twMerge(
      'animate-pulse rounded-[var(--radius-sm)] bg-[rgb(var(--color-surface-muted))]',
      className
    )}
  />
);

