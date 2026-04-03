import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const styles = {
    success: { icon: '✓', iconBg: 'bg-teal-50', iconText: 'text-[#0F766E]', border: 'border-[#E2E8F0]' },
    error:   { icon: '✕', iconBg: 'bg-red-50',  iconText: 'text-red-500',   border: 'border-red-200'   },
    warning: { icon: '!', iconBg: 'bg-orange-50', iconText: 'text-orange-500', border: 'border-orange-200' },
  };
  const s = styles[toast.type] || styles.success;

  return (
    <div className={`flex items-start gap-3 bg-white border ${s.border} rounded-xl shadow-xl px-4 py-3.5 w-[320px] animate-slide-in`}>
      <div className={`w-7 h-7 rounded-full ${s.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <span className={`text-[13px] font-bold ${s.iconText}`}>{s.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-[#1E293B]">{toast.title}</p>
        {toast.message && <p className="text-[12px] text-[#64748B] mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-[#94A3B8] hover:text-[#1E293B] flex-shrink-0 mt-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((title, { message, type = 'success', duration } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
