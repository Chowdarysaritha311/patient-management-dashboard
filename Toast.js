import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export default function Toast({ toast, onClose }) {
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        border rounded-lg shadow-lg p-4 flex items-center gap-3
        ${toastStyles[toast.type]}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          style={{ top: `${1 + index * 5}rem` }}
          className="absolute"
        >
          <Toast toast={toast} onClose={onClose} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
