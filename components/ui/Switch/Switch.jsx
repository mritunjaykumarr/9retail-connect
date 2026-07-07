"use client";

import React, { useId } from "react";
import "./Switch.scss";

/**
 * Switch — accessible toggle built on a native checkbox.
 * Controlled (checked + onChange) or uncontrolled (defaultChecked).
 */
const Switch = React.forwardRef(function Switch(
  { label, size = "md", disabled, id, className = "", ...rest },
  ref
) {
  const autoId = useId();
  const switchId = id || autoId;

  return (
    <label
      className={`rc-switch rc-switch--${size} ${
        disabled ? "is-disabled" : ""
      } ${className}`.trim()}
      htmlFor={switchId}
    >
      <input
        ref={ref}
        id={switchId}
        type="checkbox"
        role="switch"
        className="rc-switch__input"
        disabled={disabled}
        {...rest}
      />
      <span className="rc-switch__track" aria-hidden="true">
        <span className="rc-switch__thumb" />
      </span>
      {label && <span className="rc-switch__label">{label}</span>}
    </label>
  );
});

export default Switch;
