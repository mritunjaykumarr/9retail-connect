"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import "./Modal.scss";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Modal — centred dialog with scrim, focus-trap, Esc + overlay close.
 *  size: "sm" | "md" | "lg"
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  closeOnOverlay = true,
  hideClose = false,
  children,
}) {
  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      const el = panelRef.current?.querySelector(FOCUSABLE);
      (el || panelRef.current)?.focus();
    }, 20);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
        if (!nodes || !nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="rc-modal" role="presentation">
          <motion.div
            className="rc-modal__scrim"
            onClick={closeOnOverlay ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || undefined}
            tabIndex={-1}
            className={`rc-modal__panel rc-modal__panel--${size}`}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {(title || !hideClose) && (
              <header className="rc-modal__header">
                <div className="rc-modal__titles">
                  {title && <h2 className="rc-modal__title">{title}</h2>}
                  {description && (
                    <p className="rc-modal__desc">{description}</p>
                  )}
                </div>
                {!hideClose && (
                  <button
                    type="button"
                    className="rc-modal__close"
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <FiX />
                  </button>
                )}
              </header>
            )}
            <div className="rc-modal__body">{children}</div>
            {footer && <footer className="rc-modal__footer">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
