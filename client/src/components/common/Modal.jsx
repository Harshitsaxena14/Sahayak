import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-2xl bg-sahayak-surface rounded-3xl shadow-sahayak-card border border-sahayak-border max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sahayak-border bg-sahayak-surfaceWarm">
          <h2 id="modal-title" className="text-lg font-bold text-sahayak-ink truncate max-w-[80%]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-sahayak-inkMuted hover:text-sahayak-ink rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sahayak-primary min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-70px)]">
          {children}
        </div>
      </div>
    </div>
  );
};
