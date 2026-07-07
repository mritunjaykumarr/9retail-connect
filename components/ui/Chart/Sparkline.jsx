import React from "react";

/**
 * Sparkline — compact trend line + soft area fill. No axes.
 *  data: number[]
 *  color: CSS colour (default cobalt viz-1)
 *  height: px
 */
export default function Sparkline({
  data = [],
  color = "var(--viz-1)",
  height = 40,
  strokeWidth = 2,
  fill = true,
  className = "",
  id,
}) {
  const W = 100;
  const H = 32;
  const pad = 3;
  const uid = id || React.useId();
  const gradId = `spark-${uid.replace(/[:]/g, "")}`;

  if (!data.length) return <div style={{ height }} className={className} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = (W - pad * 2) / Math.max(1, data.length - 1);

  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (H - pad * 2) * (1 - (v - min) / span);
    return [x, y];
  });

  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)} ${H} L${pts[0][0].toFixed(
    2
  )} ${H} Z`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
