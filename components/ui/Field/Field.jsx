import React from "react";
import "./Field.scss";

/**
 * Field — shared label / hint / error scaffold for form controls.
 * Presentational only; the control owns its id and passes it via htmlFor.
 */
export default function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className = "",
  children,
}) {
  return (
    <div className={`rc-field ${error ? "is-error" : ""} ${className}`.trim()}>
      {label && (
        <label className="rc-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="rc-field__req" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="rc-field__msg rc-field__msg--error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="rc-field__msg">{hint}</p>
      ) : null}
    </div>
  );
}
