"use client";

import React, { useId } from "react";
import Field from "../Field/Field";
import "../Field/Field.scss";
import "./Textarea.scss";

const Textarea = React.forwardRef(function Textarea(
  {
    label,
    hint,
    error,
    required,
    rows = 4,
    disabled,
    id,
    className = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const areaId = id || autoId;

  return (
    <Field
      label={label}
      htmlFor={areaId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={`rc-control rc-textarea ${
          disabled ? "is-disabled" : ""
        }`.trim()}
      >
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          className="rc-control__field rc-textarea__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          required={required}
          {...rest}
        />
      </div>
    </Field>
  );
});

export default Textarea;
