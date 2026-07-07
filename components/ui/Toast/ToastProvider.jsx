"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import "./Toast.scss";

const ToastContext = createContext(null);

const ICONS = {
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  danger: FiXCircle,
  info: FiInfo,
};

let counter = 0;

export function ToastProvider({ children, duration = 4500 }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef({});

  // Portal only renders after mount so server and first client render match.
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (opts) => {
      const id = ++counter;
      const t = {
        id,
        tone: opts.tone || "info",
        title: opts.title,
        description: opts.description,
        action: opts.action,
        duration: opts.duration ?? duration,
      };
      setToasts((list) => [...list, t]);
      if (t.duration !== Infinity) {
        timers.current[id] = setTimeout(() => dismiss(id), t.duration);
      }
      return id;
    },
    [dismiss, duration]
  );

  // Convenience helpers: toast.success(...), etc.
  const api = React.useMemo(() => {
    const base = (o) => toast(o);
    base.success = (title, o = {}) => toast({ ...o, title, tone: "success" });
    base.warning = (title, o = {}) => toast({ ...o, title, tone: "warning" });
    base.danger = (title, o = {}) => toast({ ...o, title, tone: "danger" });
    base.error = base.danger;
    base.info = (title, o = {}) => toast({ ...o, title, tone: "info" });
    base.dismiss = dismiss;
    return base;
  }, [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="rc-toaster" role="region" aria-label="Notifications">
            <AnimatePresence initial={false}>
              {toasts.map((t) => {
                const Icon = ICONS[t.tone] || FiInfo;
                return (
                  <motion.div
                    key={t.id}
                    layout
                    className={`rc-toast rc-toast--${t.tone}`}
                    role="status"
                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 24, scale: 0.96 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="rc-toast__icon">
                      <Icon />
                    </span>
                    <div className="rc-toast__content">
                      {t.title && (
                        <p className="rc-toast__title">{t.title}</p>
                      )}
                      {t.description && (
                        <p className="rc-toast__desc">{t.description}</p>
                      )}
                      {t.action && (
                        <button
                          type="button"
                          className="rc-toast__action"
                          onClick={() => {
                            t.action.onClick?.();
                            dismiss(t.id);
                          }}
                        >
                          {t.action.label}
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rc-toast__close"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(t.id)}
                    >
                      <FiX />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToast must be used within a <ToastProvider>.");
  return ctx;
}
