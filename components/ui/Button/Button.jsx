import React from "react";
import "./Button.scss";

/**
 * Button — the primary action primitive.
 *
 * Props:
 *  variant: "primary" | "secondary" | "outline" | "ghost" | "subtle" | "danger"
 *  size:    "sm" | "md" | "lg"
 *  loading: boolean            — shows spinner, disables interaction
 *  disabled: boolean
 *  fullWidth: boolean
 *  leadingIcon / trailingIcon: ReactNode
 *  iconOnly: boolean           — square, icon-centred (pass aria-label)
 *  as:      element type       — render as <a> etc. (default "button")
 */
const Button = React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    as: Tag = "button",
    className = "",
    children,
    type,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  const classes = [
    "rc-btn",
    `rc-btn--${variant}`,
    `rc-btn--${size}`,
    fullWidth ? "rc-btn--full" : "",
    iconOnly ? "rc-btn--icon-only" : "",
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const nativeProps =
    Tag === "button"
      ? { type: type || "button", disabled: isDisabled }
      : { "aria-disabled": isDisabled || undefined };

  return (
    <Tag
      ref={ref}
      className={classes}
      data-loading={loading || undefined}
      {...nativeProps}
      {...rest}
    >
      {loading && <span className="rc-btn__spinner" aria-hidden="true" />}
      <span className="rc-btn__content">
        {leadingIcon && (
          <span className="rc-btn__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children && <span className="rc-btn__label">{children}</span>}
        {trailingIcon && (
          <span className="rc-btn__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </span>
    </Tag>
  );
});

export default Button;
