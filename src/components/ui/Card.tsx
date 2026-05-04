import { twMerge } from 'tailwind-merge';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('bg-white rounded-xl shadow-sm border border-gray-100 p-6', className)} {...props}>
    {children}
  </div>
);
