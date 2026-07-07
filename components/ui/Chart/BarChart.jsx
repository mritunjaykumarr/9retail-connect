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
 * BarChart — vertical bars, single or grouped multi-series, hover tooltip.
 *  series: [{ name, data: number[], color? }]
 *  categories: string[]
 */
export default function BarChart({
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
  const max = niceCeil(all.length ? Math.max(...all) : 1);
  const n = categories.length;
  const groups = withColor.length || 1;

  const groupW = plotW / n;
  const barGap = 4;
  const innerW = groupW * 0.62;
  const barW = (innerW - barGap * (groups - 1)) / groups;

  const y = (v) => padT + plotH * (1 - v / (max || 1));

  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);

  return (
    <div className={`rc-chart ${className}`.trim()}>
      <div className="rc-chart__canvas">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: "block", maxHeight: height, width: "100%", height: "auto" }}
          onMouseLeave={() => setHover(null)}
          role="img"
        >
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

          {categories.map((c, ci) => {
            const gx = padL + ci * groupW + (groupW - innerW) / 2;
            const active = hover === ci;
            return (
              <g
                key={ci}
                onMouseEnter={() => setHover(ci)}
                className="rc-chart__bar-group"
              >
                <rect
                  x={padL + ci * groupW}
                  y={padT}
                  width={groupW}
                  height={plotH}
                  fill="transparent"
                />
                {withColor.map((s, si) => {
                  const v = s.data[ci];
                  const bh = plotH - (y(v) - padT);
                  return (
                    <rect
                      key={si}
                      x={gx + si * (barW + barGap)}
                      y={y(v)}
                      width={barW}
                      height={Math.max(0, bh)}
                      rx="3"
                      fill={s.color}
                      opacity={hover === null || active ? 1 : 0.45}
                      style={{ transition: "opacity .15s" }}
                    />
                  );
                })}
                <text
                  x={padL + ci * groupW + groupW / 2}
                  y={H - 10}
                  textAnchor="middle"
                  className="rc-chart__axis-text"
                >
                  {c}
                </text>
              </g>
            );
          })}
        </svg>

        {hover !== null && categories[hover] !== undefined && (
          <div
            className="rc-chart__tooltip"
            style={{
              left: `${((padL + hover * groupW + groupW / 2) / W) * 100}%`,
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
