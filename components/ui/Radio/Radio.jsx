"use client";

import React, { useId } from "react";
import "../Checkbox/Checkbox.scss";

/**
 * Radio — single radio button. Group several by a shared `name`.
 */
const Radio = React.forwardRef(function Radio(
  { label, hint, disabled, id, className = "", ...rest },
  ref
) {
  const autoId = useId();
  const rId = id || autoId;

  return (
    <label
      className={`rc-radio ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      htmlFor={rId}
    >
      <input
        ref={ref}
        id={rId}
        type="radio"
        className="rc-check__input"
        disabled={disabled}
        {...rest}
      />
      <span className="rc-check__box" aria-hidden="true" />
      {(label || hint) && (
        <span className="rc-check__text">
          {label && <span className="rc-check__label">{label}</span>}
          {hint && <span className="rc-check__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
});

export default Radio;
