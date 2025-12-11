import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={cn(
                "pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3",
                "bg-white/90 backdrop-blur-md",
                t.type === 'success' && "border-green-200 bg-green-50/90",
                t.type === 'error' && "border-red-200 bg-red-50/90",
                t.type === 'info' && "border-blue-200 bg-blue-50/90"
              )}
            >
              <div className={cn(
                "mt-0.5 rounded-full p-1",
                t.type === 'success' && "text-green-600 bg-green-100",
                t.type === 'error' && "text-red-600 bg-red-100",
                t.type === 'info' && "text-blue-600 bg-blue-100"
              )}>
                {t.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                {t.type === 'error' && <AlertCircle className="h-4 w-4" />}
                {t.type === 'info' && <Info className="h-4 w-4" />}
              </div>
              
              <div className="flex-1">
                <h3 className={cn("font-semibold text-sm", 
                  t.type === 'success' && "text-green-900",
                  t.type === 'error' && "text-red-900",
                  t.type === 'info' && "text-blue-900"
                )}>
                  {t.title}
                </h3>
                {t.description && (
                  <p className={cn("text-xs mt-1", 
                    t.type === 'success' && "text-green-700",
                    t.type === 'error' && "text-red-700",
                    t.type === 'info' && "text-blue-700"
                  )}>
                    {t.description}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};