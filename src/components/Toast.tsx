import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000
}: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] min-w-[280px] max-w-[90vw] px-4 py-3 rounded-2xl border shadow-lg flex items-center gap-3 ${bgColors[type]}`}
        >
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <p className="text-sm font-bold text-chocolate flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={16} className="text-chocolate/40" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
