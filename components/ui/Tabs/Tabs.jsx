"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./Tabs.scss";

/**
 * Tabs — accessible tablist with an animated indicator.
 *  items: [{ value, label, icon, badge, disabled }]
 *  variant: "underline" | "segmented"
 *  Controlled via value/onChange, or uncontrolled via defaultValue.
 */
export default function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  fitted = false,
  className = "",
  idBase = "rc-tabs",
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    defaultValue ?? items[0]?.value
  );
  const active = isControlled ? value : internal;
  const refs = useRef([]);

  const select = (v) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const onKeyDown = (e) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === active);
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next) {
      e.preventDefault();
      select(next.value);
      const realIdx = items.findIndex((i) => i.value === next.value);
      refs.current[realIdx]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`rc-tabs rc-tabs--${variant} rc-tabs--${size} ${
        fitted ? "rc-tabs--fitted" : ""
      } ${className}`.trim()}
      onKeyDown={onKeyDown}
    >
      {items.map((item, i) => {
        const selected = item.value === active;
        return (
          <button
            key={item.value}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            type="button"
            id={`${idBase}-tab-${item.value}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            className={`rc-tabs__tab ${selected ? "is-active" : ""}`}
            onClick={() => !item.disabled && select(item.value)}
          >
            {item.icon && <span className="rc-tabs__icon">{item.icon}</span>}
            <span className="rc-tabs__label">{item.label}</span>
            {item.badge !== undefined && (
              <span className="rc-tabs__badge">{item.badge}</span>
            )}
            {selected && (
              <motion.span
                layoutId={`${idBase}-indicator`}
                className="rc-tabs__indicator"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
