"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import "./Chip.scss";

/**
 * Chip — interactive tag. Selectable (onClick/selected) and/or
 * removable (onRemove renders a close affordance).
 */
export default function Chip({
  selected = false,
  onRemove,
  onClick,
  leadingIcon,
  disabled = false,
  className = "",
  children,
  ...rest
}) {
  const interactive = Boolean(onClick);
  const Tag = interactive ? "button" : "span";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      className={`rc-chip ${selected ? "is-selected" : ""} ${
        interactive ? "is-interactive" : ""
      } ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      disabled={interactive ? disabled : undefined}
      aria-pressed={interactive ? selected : undefined}
      {...rest}
    >
      {leadingIcon && (
        <span className="rc-chip__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="rc-chip__label">{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={disabled ? -1 : 0}
          className="rc-chip__remove"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove(e);
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              e.stopPropagation();
              onRemove(e);
            }
          }}
        >
          <FiX />
        </span>
      )}
    </Tag>
  );
}
