"use client";

import React, { useState, useEffect } from "react";
import "./Avatar.scss";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic hue from the name so a person always gets the same colour.
function hueFromString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export default function Avatar({
  src,
  name = "",
  fallback,
  size = "md",
  shape = "circle",
  status,
  className = "",
  ...rest
}) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;
  const showImg = src && !broken;
  const displayName = name || (typeof fallback === "string" ? fallback : "");
  const hue = hueFromString(displayName || "User");

  return (
    <span
      className={`rc-avatar rc-avatar--${shape} ${className}`.trim()}
      style={{ "--_size": `${px}px` }}
      title={name || (typeof fallback === "string" ? fallback : undefined)}
      {...rest}
    >
      {showImg ? (
        <img
          className="rc-avatar__img"
          src={src}
          alt={name || "Avatar"}
          onError={() => setBroken(true)}
        />
      ) : (
        <span
          className="rc-avatar__fallback"
          aria-label={name || undefined}
          style={{
            background: `hsl(${hue} 70% 92%)`,
            color: `hsl(${hue} 55% 32%)`,
          }}
        >
          {fallback !== undefined ? fallback : initials(name)}
        </span>
      )}
      {status && (
        <span
          className={`rc-avatar__status rc-avatar__status--${status}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export function AvatarGroup({ max = 4, size = "md", children, className = "" }) {
  const items = React.Children.toArray(children);
  const shown = items.slice(0, max);
  const overflow = items.length - shown.length;
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;

  return (
    <span className={`rc-avatar-group ${className}`.trim()}>
      {shown.map((child, i) => (
        <span className="rc-avatar-group__item" key={i}>
          {React.cloneElement(child, { size })}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="rc-avatar-group__item rc-avatar-group__more"
          style={{ "--_size": `${px}px` }}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}
