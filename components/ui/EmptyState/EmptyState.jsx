import React from "react";
import { FiInbox } from "react-icons/fi";
import "./EmptyState.scss";

/**
 * EmptyState — for empty / no-results / no-permission / error screens.
 *  illustration: ReactNode — slot for a custom graphic (defaults to an icon)
 *  size: "sm" | "md"
 *  tone: "neutral" | "danger" — danger for error states
 */
export default function EmptyState({
  illustration,
  icon,
  title,
  description,
  actions,
  size = "md",
  tone = "neutral",
  className = "",
  ...rest
}) {
  return (
    <div
      className={`rc-empty rc-empty--${size} rc-empty--${tone} ${className}`.trim()}
      {...rest}
    >
      <div className="rc-empty__art" aria-hidden="true">
        {illustration || (
          <span className="rc-empty__icon">{icon || <FiInbox />}</span>
        )}
      </div>
      {title && <h3 className="rc-empty__title">{title}</h3>}
      {description && <p className="rc-empty__desc">{description}</p>}
      {actions && <div className="rc-empty__actions">{actions}</div>}
    </div>
  );
}
