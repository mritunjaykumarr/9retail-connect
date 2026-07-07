import React from "react";
import "./Badge.scss";

/**
 * Badge — compact status / label pill.
 *  tone:    "neutral" | "primary" | "success" | "warning" | "danger" | "info"
 *  variant: "soft" | "solid" | "outline"
 *  size:    "sm" | "md"
 *  dot:     boolean — leading status dot
 */
export default function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  dot = false,
  leadingIcon,
  className = "",
  children,
  ...rest
}) {
  return (
    <span
      className={`rc-badge rc-badge--${tone} rc-badge--${variant} rc-badge--${size} ${className}`.trim()}
      {...rest}
    >
      {dot && <span className="rc-badge__dot" aria-hidden="true" />}
      {leadingIcon && (
        <span className="rc-badge__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  );
}
