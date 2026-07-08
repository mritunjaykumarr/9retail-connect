"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Menu.scss";

const MenuContext = createContext({ close: () => {} });

/**
 * Menu — accessible dropdown anchored to a trigger.
 *  trigger: a focusable element (button/our components) — cloned to receive
 *           the toggle handler + aria-haspopup/expanded.
 *  align:   "start" | "end" — which edge the panel aligns to.
 *  width:   optional fixed panel width (number px or CSS string).
 *
 * Closes on outside-click, Esc, and (by default) on item selection.
 */
export default function Menu({
  trigger,
  children,
  align = "end",
  width,
  className = "",
  panelClassName = "",
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerEl = React.cloneElement(trigger, {
    onClick: (e) => {
      trigger.props.onClick?.(e);
      setOpen((o) => !o);
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
  });

  const style = width
    ? { "--_menu-w": typeof width === "number" ? `${width}px` : width }
    : undefined;

  return (
    <div className={`rc-menu ${className}`.trim()} ref={rootRef}>
      {triggerEl}
      <AnimatePresence>
        {open && (
          <MenuContext.Provider value={{ close: () => setOpen(false) }}>
            <motion.div
              id={menuId}
              role="menu"
              aria-label={ariaLabel}
              style={style}
              className={`rc-menu__panel rc-menu__panel--${align} ${panelClassName}`.trim()}
              initial={{ opacity: 0, scale: 0.97, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </MenuContext.Provider>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * MenuItem — a selectable row. Closes the menu after onClick unless
 * `keepOpen` is set. Renders as <a> when `href` is provided.
 */
export function MenuItem({
  children,
  icon,
  onClick,
  href,
  as,
  tone = "default",
  disabled = false,
  selected = false,
  keepOpen = false,
  className = "",
  ...rest
}) {
  const { close } = useContext(MenuContext);
  const Tag = as || (href ? "a" : "button");

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (!keepOpen) close();
  };

  return (
    <Tag
      role="menuitem"
      href={href}
      type={Tag === "button" ? "button" : undefined}
      className={`rc-menu__item rc-menu__item--${tone} ${
        selected ? "is-selected" : ""
      } ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      {...rest}
    >
      {icon && (
        <span className="rc-menu__item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="rc-menu__item-label">{children}</span>
    </Tag>
  );
}

export function MenuLabel({ children, className = "" }) {
  return <div className={`rc-menu__label ${className}`.trim()}>{children}</div>;
}

export function MenuDivider({ className = "" }) {
  return <div className={`rc-menu__divider ${className}`.trim()} role="separator" />;
}
