import { useEffect, useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, subtitle, children, className }: ModalProps) => {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/50 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={twMerge(
          'animate-modal-in bg-[rgb(var(--color-surface))] rounded-t-2xl sm:rounded-[var(--radius-lg)] shadow-2xl border border-[rgb(var(--color-border))] w-full max-w-lg max-h-[92dvh] flex flex-col overflow-hidden',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]/50">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text))] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -m-1 text-zinc-500 hover:text-zinc-900 hover:bg-[rgb(var(--color-surface-muted))] rounded-full transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
