"use client";

import React from "react";
import ChartLegend from "./ChartLegend";
import "./Chart.scss";

const VIZ = [
  "var(--viz-1)",
  "var(--viz-2)",
  "var(--viz-3)",
  "var(--viz-4)",
  "var(--viz-5)",
  "var(--viz-6)",
];

/**
 * Donut — proportional ring with a centre label.
 *  data: [{ label, value, color? }]
 */
export default function Donut({
  data = [],
  size = 180,
  thickness = 22,
  centerLabel,
  centerValue,
  showLegend = true,
  valueFormat = (n) => n,
  className = "",
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 50 - thickness / 100 * 50;
  const radius = 42;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const seg = {
      color: d.color || VIZ[i % VIZ.length],
      dash: frac * circ,
      gap: circ - frac * circ,
      offset: -offset * circ,
      label: d.label,
      value: d.value,
      pct: Math.round(frac * 100),
    };
    offset += frac;
    return seg;
  });

  return (
    <div className={`rc-chart rc-donut ${className}`.trim()}>
      <div className="rc-donut__ring" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--chart-track)"
            strokeWidth={thickness / 10}
          />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness / 10}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={s.offset}
              strokeLinecap="butt"
              transform="rotate(-90 50 50)"
            />
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="rc-donut__center">
            {centerValue && (
              <span className="rc-donut__value">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="rc-donut__label">{centerLabel}</span>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <ChartLegend
          vertical
          items={segments.map((s) => ({
            label: s.label,
            color: s.color,
            value: `${valueFormat(s.value)} · ${s.pct}%`,
          }))}
        />
      )}
    </div>
  );
}
