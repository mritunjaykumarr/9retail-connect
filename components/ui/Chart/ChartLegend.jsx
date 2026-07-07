import React from "react";
import "./Chart.scss";

/**
 * ChartLegend — consistent legend for all chart types.
 *  items: [{ label, color, value? }]
 */
export default function ChartLegend({ items = [], vertical = false, className = "" }) {
  return (
    <ul
      className={`rc-legend ${vertical ? "rc-legend--vertical" : ""} ${className}`.trim()}
    >
      {items.map((it, i) => (
        <li className="rc-legend__item" key={i}>
          <span
            className="rc-legend__swatch"
            style={{ background: it.color }}
            aria-hidden="true"
          />
          <span className="rc-legend__label">{it.label}</span>
          {it.value !== undefined && (
            <span className="rc-legend__value">{it.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
