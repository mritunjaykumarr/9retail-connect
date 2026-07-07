"use client";

import React, { useId } from "react";
import { FiChevronDown } from "react-icons/fi";
import Field from "../Field/Field";
import "../Field/Field.scss";
import "./Select.scss";

/**
 * Select — accessible, styled native <select>.
 * options: [{ value, label, disabled }] OR pass <option> children.
 */
const Select = React.forwardRef(function Select(
  {
    label,
    hint,
    error,
    required,
    size = "md",
    options,
    placeholder,
    disabled,
    id,
    className = "",
    children,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <Field
      label={label}
      htmlFor={selectId}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={`rc-control rc-control--${size} rc-select ${
          disabled ? "is-disabled" : ""
        }`.trim()}
      >
        <select
          ref={ref}
          id={selectId}
          className="rc-control__field rc-select__field"
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          required={required}
          defaultValue={placeholder ? "" : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value} disabled={o.disabled}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <span className="rc-control__affix rc-select__chevron" aria-hidden="true">
          <FiChevronDown />
        </span>
      </div>
    </Field>
  );
});

export default Select;
