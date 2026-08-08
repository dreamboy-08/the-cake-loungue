"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  closeOnBackdropClick?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const AdminConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'danger',
  isLoading = false,
  closeOnBackdropClick = true,
  children,
  className,
}: AdminConfirmationModalProps) => {
  const [mounted, setMounted] = useState(false);

  // Mount logic for SSR safety
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle body scrolling lock
  useEffect(() => {
    if (!mounted || !isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
    };
  }, [mounted, isOpen]);

  // Handle Escape key closure
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!mounted || !isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-50 text-red-500',
          confirmBg: 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-500',
          confirmBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-50 text-blue-500',
          confirmBg: 'bg-rose-deep hover:bg-brown shadow-rose-deep/20 text-white',
        };
    }
  };

  const styles = getTypeStyles();

  return createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            if (closeOnBackdropClick && !isLoading) {
              onClose();
            }
          }}
          className="fixed inset-0 bg-chocolate/60 backdrop-blur-sm"
        />

        {/* Modal container centered strictly in viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={className || "relative bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-6 overflow-hidden z-10"}
        >
          {children ? children : (
            <>
              {/* Close button */}
              <button
                onClick={onClose}
                disabled={isLoading}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-chocolate hover:bg-gray-50 rounded-full transition-all disabled:opacity-50"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className={`w-20 h-20 ${styles.iconBg} rounded-full flex items-center justify-center mx-auto shadow-inner`}>
                <AlertCircle size={40} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-playfair text-chocolate">{title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{message}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 bg-white border border-gray-200 transition-all text-sm h-11 min-h-[44px] flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold shadow-xl transition-all text-sm h-11 min-h-[44px] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 ${styles.confirmBg}`}
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {confirmText}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default AdminConfirmationModal;
