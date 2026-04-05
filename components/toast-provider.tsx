"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Info, AlertCircle, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    if (type !== "loading") {
      setTimeout(() => removeToast(id), 5000);
    }
    
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[340px] pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-start gap-3 rounded-2xl shadow-2xl p-4 border backdrop-blur-xl
                ${t.type === "success" ? "bg-green-50/90 border-green-200 text-green-900 dark:bg-green-900/40 dark:border-green-700/50 dark:text-green-100" : ""}
                ${t.type === "error" ? "bg-red-50/90 border-red-200 text-red-900 dark:bg-red-900/40 dark:border-red-700/50 dark:text-red-100" : ""}
                ${t.type === "info" ? "bg-teal-50/90 border-teal-200 text-teal-900 dark:bg-teal-900/40 dark:border-teal-700/50 dark:text-teal-100" : ""}
                ${t.type === "loading" ? "bg-gray-50/90 border-gray-200 text-gray-900 dark:bg-gray-900/40 dark:border-gray-700/50 dark:text-gray-100" : ""}
              `}>
                <div className="mt-0.5 flex-shrink-0">
                  {t.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                  {t.type === "error" && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                  {t.type === "info" && <Info className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
                  {t.type === "loading" && <Loader2 className="h-5 w-5 text-gray-600 dark:text-gray-400 animate-spin" />}
                </div>
                <div className="flex-1 text-sm font-semibold leading-relaxed">
                  {t.message}
                </div>
                <button 
                  onClick={() => removeToast(t.id)}
                  className="mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
