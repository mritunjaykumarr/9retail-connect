"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import "./Drawer.scss";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Drawer — side panel sliding in from left or right.
 *  side: "right" | "left"
 *  size: "sm" | "md" | "lg"
 */
export default function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  side = "right",
  size = "md",
  closeOnOverlay = true,
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
  const offscreen = side === "right" ? "100%" : "-100%";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`rc-drawer rc-drawer--${side}`} role="presentation">
          <motion.div
            className="rc-drawer__scrim"
            onClick={closeOnOverlay ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || undefined}
            tabIndex={-1}
            className={`rc-drawer__panel rc-drawer__panel--${size}`}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="rc-drawer__header">
              <div className="rc-drawer__titles">
                {title && <h2 className="rc-drawer__title">{title}</h2>}
                {description && (
                  <p className="rc-drawer__desc">{description}</p>
                )}
              </div>
              <button
                type="button"
                className="rc-drawer__close"
                onClick={onClose}
                aria-label="Close panel"
              >
                <FiX />
              </button>
            </header>
            <div className="rc-drawer__body">{children}</div>
            {footer && <footer className="rc-drawer__footer">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
