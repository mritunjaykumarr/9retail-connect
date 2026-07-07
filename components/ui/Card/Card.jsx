import React from "react";
import "./Card.scss";

/**
 * Card — surface container. Flat by default (surface + hairline border,
 * per the enterprise elevation model); pass `elevated` for a raised
 * shadow, or `interactive` for hover lift.
 *  padding: "none" | "sm" | "md" | "lg"
 */
export default function Card({
  elevated = false,
  interactive = false,
  padding = "md",
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      className={`rc-card rc-card--pad-${padding} ${
        elevated ? "rc-card--elevated" : ""
      } ${interactive ? "rc-card--interactive" : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, actions, className = "", children }) {
  return (
    <div className={`rc-card__header ${className}`.trim()}>
      <div className="rc-card__heading">
        {title && <h3 className="rc-card__title">{title}</h3>}
        {subtitle && <p className="rc-card__subtitle">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="rc-card__actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={`rc-card__body ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return <div className={`rc-card__footer ${className}`.trim()}>{children}</div>;
}
