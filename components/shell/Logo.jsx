import React from "react";
import "./Logo.scss";

/**
 * Logo — RetailConnect SIP brand lockup.
 *  compact: show the mark only (collapsed sidebar).
 */
export default function Logo({ compact = false, className = "" }) {
  return (
    <span
      className={`rc-logo ${compact ? "rc-logo--compact" : ""} ${className}`.trim()}
      aria-label="RetailConnect SIP"
    >
      <span className="rc-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28" role="presentation">
          <rect width="32" height="32" rx="8" fill="url(#rc-logo-grad)" />
          <path
            d="M9 22V10h6.4c2.5 0 4.1 1.4 4.1 3.6 0 1.7-.9 2.9-2.5 3.4l2.9 5H16l-2.4-4.5H12V22H9Zm3-6.9h2.9c1 0 1.6-.5 1.6-1.4 0-.9-.6-1.4-1.6-1.4H12v2.8Z"
            fill="#fff"
          />
          <circle cx="22.5" cy="11" r="2.2" fill="#fff" />
          <defs>
            <linearGradient
              id="rc-logo-grad"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--primary-active)" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {!compact && (
        <span className="rc-logo__wordmark">
          <span className="rc-logo__name">RetailConnect</span>
          <span className="rc-logo__badge">SIP</span>
        </span>
      )}
    </span>
  );
}
