import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import "./StatCard.scss";

/**
 * StatCard — KPI tile: label, big tabular value, trend delta, optional
 * icon and chart slot (e.g. a <Sparkline/>).
 *  delta: number (percent). direction inferred from sign unless `deltaTone`
 *  deltaTone: "positive" | "negative" | "neutral" — overrides sign colour
 */
export default function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  deltaTone,
  icon,
  chart,
  footnote,
  className = "",
  ...rest
}) {
  const hasDelta = delta !== undefined && delta !== null;
  const isUp = hasDelta && Number(delta) >= 0;
  const tone = deltaTone || (!hasDelta ? "neutral" : isUp ? "positive" : "negative");

  return (
    <div className={`rc-stat ${className}`.trim()} {...rest}>
      <div className="rc-stat__top">
        <span className="rc-stat__label">{label}</span>
        {icon && <span className="rc-stat__icon">{icon}</span>}
      </div>

      <div className="rc-stat__value-row">
        <span className="rc-stat__value">
          {value}
          {unit && <span className="rc-stat__unit">{unit}</span>}
        </span>
      </div>

      <div className="rc-stat__foot">
        {hasDelta && (
          <span className={`rc-stat__delta rc-stat__delta--${tone}`}>
            {tone === "positive" ? (
              <FiArrowUpRight />
            ) : tone === "negative" ? (
              <FiArrowDownRight />
            ) : null}
            {Math.abs(Number(delta))}%
          </span>
        )}
        {deltaLabel && <span className="rc-stat__delta-label">{deltaLabel}</span>}
        {footnote && !deltaLabel && (
          <span className="rc-stat__delta-label">{footnote}</span>
        )}
      </div>

      {chart && <div className="rc-stat__chart">{chart}</div>}
    </div>
  );
}
