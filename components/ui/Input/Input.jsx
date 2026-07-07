"use client";

import React, { useId } from "react";
import Field from "../Field/Field";
import "../Field/Field.scss";

/**
 * Input — labelled text input with hint/error + optional leading/trailing
 * adornments (icons, units, buttons).
 */
const Input = React.forwardRef(function Input(
  {
    label,
    hint,
    error,
    required,
    size = "md",
    leading,
    trailing,
    disabled,
    id,
    className = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <Field
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={`rc-control rc-control--${size} ${
          disabled ? "is-disabled" : ""
        }`.trim()}
      >
        {leading && <span className="rc-control__affix">{leading}</span>}
        <input
          ref={ref}
          id={inputId}
          className="rc-control__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          required={required}
          {...rest}
        />
        {trailing && <span className="rc-control__affix">{trailing}</span>}
      </div>
    </Field>
  );
});

export default Input;
