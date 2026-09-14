"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";
const ToastContext = createContext({
  showToast: () => {
  }
});
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback(({ type = "info", title, message }) => {
    const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const icons = {
    success: <CheckCircle size={17} color="#16a34a" />,
    warning: <AlertTriangle size={17} color="#d97706" />,
    error: <XCircle size={17} color="#dc2626" />,
    info: <Info size={17} color="#2563eb" />
  };
  const borders = {
    success: "#86efac",
    warning: "#fcd34d",
    error: "#fca5a5",
    info: "#93c5fd"
  };
  const bgGradients = {
    success: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
    warning: "linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)",
    error: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
    info: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)"
  };
  return <ToastContext.Provider value={{ showToast }}>
      {children}
      {
    /* Toast Notification Container */
  }
      <div style={{
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 380,
    pointerEvents: "none"
  }}>
        {toasts.map((toast) => <div
    key={toast.id}
    style={{
      pointerEvents: "auto",
      background: bgGradients[toast.type],
      border: `1px solid ${borders[toast.type]}`,
      borderRadius: 8,
      boxShadow: "0 8px 24px rgba(15,23,42,0.12), 0 2px 6px rgba(0,0,0,0.04)",
      padding: "10px 14px",
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      minWidth: 280,
      animation: "toastSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
    }}
  >
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              {icons[toast.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1.25, marginBottom: 2 }}>
                  {toast.title}
                </div>}
              <div style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.35 }}>
                {toast.message}
              </div>
            </div>
            <button
    onClick={() => removeToast(toast.id)}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 2,
      color: "#94a3b8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
    onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
  >
              <X size={13} />
            </button>
          </div>)}
      </div>
    </ToastContext.Provider>;
}
