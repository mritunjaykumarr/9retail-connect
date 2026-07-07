import React from "react";
import "./Skeleton.scss";

/**
 * Skeleton — shimmer placeholder.
 *  variant: "text" | "block" | "circle"
 *  width / height: CSS size (number = px)
 *  lines: for variant="text", render N stacked lines
 */
export default function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  radius,
  className = "",
  style,
  ...rest
}) {
  const size = (v) => (typeof v === "number" ? `${v}px` : v);

  if (variant === "text" && lines > 1) {
    return (
      <span className={`rc-skeleton-lines ${className}`.trim()} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="rc-skeleton rc-skeleton--text"
            style={{ width: i === lines - 1 ? "70%" : "100%" }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={`rc-skeleton rc-skeleton--${variant} ${className}`.trim()}
      style={{
        width: size(width),
        height: size(height),
        borderRadius: size(radius),
        ...style,
      }}
      {...rest}
    />
  );
}
