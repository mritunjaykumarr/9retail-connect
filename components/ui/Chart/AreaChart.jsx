"use client";

import React, { useId, useState } from "react";
import ChartLegend from "./ChartLegend";
import "./Chart.scss";

const VIZ = [
  "var(--viz-1)",
  "var(--viz-2)",
  "var(--viz-3)",
  "var(--viz-4)",
  "var(--viz-5)",
];

/**
 * AreaChart — line + area, single or multi-series, hover tooltip.
 *  series: [{ name, data: number[], color? }]
 *  categories: string[] (x labels)
 *  valueFormat: (n) => string
 */
export default function AreaChart({
  series = [],
  categories = [],
  height = 260,
  valueFormat = (n) => n,
  showLegend = true,
  className = "",
}) {
  const uid = useId().replace(/[:]/g, "");
  const [hover, setHover] = useState(null);

  const W = 720;
  const H = 280;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const withColor = series.map((s, i) => ({
    ...s,
    color: s.color || VIZ[i % VIZ.length],
  }));

  const all = withColor.flatMap((s) => s.data);
  const rawMax = all.length ? Math.max(...all) : 1;
  const max = niceCeil(rawMax);
  const min = 0;
  const n = categories.length || (withColor[0]?.data.length ?? 0);

  const x = (i) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => padT + plotH * (1 - (v - min) / (max - min || 1));

  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((rx - padL) / plotW) * (n - 1));
    if (i >= 0 && i < n) setHover(i);
  };

  return (
    <div className={`rc-chart ${className}`.trim()}>
      <div className="rc-chart__canvas">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", maxHeight: height, width: "100%", height: "auto" }}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
        >
          <defs>
            {withColor.map((s, i) => (
              <linearGradient
                key={i}
                id={`area-${uid}-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* grid + y labels */}
          {gridVals.map((gv, i) => (
            <g key={i}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y(gv)}
                y2={y(gv)}
                stroke="var(--chart-grid)"
                strokeWidth="1"
                shapeRendering="crispEdges"
              />
              <text
                x={padL - 8}
                y={y(gv)}
                textAnchor="end"
                dominantBaseline="middle"
                className="rc-chart__axis-text"
              >
                {valueFormat(Math.round(gv))}
              </text>
            </g>
          ))}

          {/* areas + lines */}
          {withColor.map((s, si) => {
            const line = s.data
              .map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`)
              .join(" ");
            const area = `${line} L${x(s.data.length - 1)} ${padT + plotH} L${x(
              0
            )} ${padT + plotH} Z`;
            return (
              <g key={si}>
                <path d={area} fill={`url(#area-${uid}-${si})`} />
                <path
                  d={line}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}

          {/* hover marker */}
          {hover !== null && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={padT}
                y2={padT + plotH}
                stroke="var(--chart-axis)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {withColor.map((s, si) => (
                <circle
                  key={si}
                  cx={x(hover)}
                  cy={y(s.data[hover])}
                  r="4"
                  fill="var(--surface)"
                  stroke={s.color}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          )}

          {/* x labels */}
          {categories.map((c, i) => (
            <text
              key={i}
              x={x(i)}
              y={H - 10}
              textAnchor="middle"
              className="rc-chart__axis-text"
            >
              {c}
            </text>
          ))}
        </svg>

        {hover !== null && (
          <div
            className="rc-chart__tooltip"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              top: 8,
            }}
          >
            <div className="rc-chart__tt-title">{categories[hover]}</div>
            {withColor.map((s, si) => (
              <div className="rc-chart__tt-row" key={si}>
                <span
                  className="rc-chart__tt-dot"
                  style={{ background: s.color }}
                />
                <span className="rc-chart__tt-name">{s.name}</span>
                <span className="rc-chart__tt-val">
                  {valueFormat(s.data[hover])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLegend && series.length > 0 && (
        <ChartLegend
          items={withColor.map((s) => ({ label: s.name, color: s.color }))}
        />
      )}
    </div>
  );
}

function niceCeil(v) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const norm = v / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * mag;
}
