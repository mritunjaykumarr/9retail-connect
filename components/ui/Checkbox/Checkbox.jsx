"use client";

import React, { useId, useRef, useEffect } from "react";
import { FiCheck, FiMinus } from "react-icons/fi";
import "./Checkbox.scss";

const Checkbox = React.forwardRef(function Checkbox(
  { label, hint, indeterminate = false, disabled, id, className = "", ...rest },
  ref
) {
  const autoId = useId();
  const cbId = id || autoId;
  const innerRef = useRef(null);

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <label
      className={`rc-check ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      htmlFor={cbId}
    >
      <input
        ref={setRefs}
        id={cbId}
        type="checkbox"
        className="rc-check__input"
        disabled={disabled}
        {...rest}
      />
      <span className="rc-check__box" aria-hidden="true">
        <FiCheck className="rc-check__icon rc-check__icon--check" />
        <FiMinus className="rc-check__icon rc-check__icon--indeterminate" />
      </span>
      {(label || hint) && (
        <span className="rc-check__text">
          {label && <span className="rc-check__label">{label}</span>}
          {hint && <span className="rc-check__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
});

export default Checkbox;
