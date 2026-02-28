"use client";

interface DataPoint {
  date: string;
  rating: number;
}

interface RatingTrendChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export function RatingTrendChart({ data, width = 600, height = 160 }: RatingTrendChartProps) {
  if (!data || data.length < 2) return null;

  const padX = 12;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const ratings = data.map((d) => d.rating);
  const minR = Math.min(...ratings) - 20;
  const maxR = Math.max(...ratings) + 20;
  const rangeR = maxR - minR;

  const toX = (i: number) => padX + (i / (data.length - 1)) * innerW;
  const toY = (r: number) => padY + innerH - ((r - minR) / rangeR) * innerH;

  // Build polyline points
  const points = data.map((d, i) => `${toX(i)},${toY(d.rating)}`).join(" ");

  // Build filled area path
  const first = data[0];
  const last = data[data.length - 1];
  const areaPath = [
    `M ${toX(0)} ${toY(first.rating)}`,
    ...data.map((d, i) => `L ${toX(i)} ${toY(d.rating)}`),
    `L ${toX(data.length - 1)} ${height}`,
    `L ${toX(0)} ${height}`,
    "Z",
  ].join(" ");

  // Y-axis guide lines (3 values)
  const guides = [minR + rangeR * 0.25, minR + rangeR * 0.5, minR + rangeR * 0.75].map(
    (r) => Math.round(r)
  );

  // Format date labels: show month/day for first, last, and ~midpoint
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1];
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const gain = last.rating - first.rating;
  const gainStr = gain >= 0 ? `+${gain}` : `${gain}`;

  return (
    <div className="relative w-full">
      {/* Gain badge */}
      <div className="absolute top-0 right-0 flex items-center gap-1.5">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            gain >= 0
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/15 text-red-400 border border-red-500/20"
          }`}
        >
          {gainStr} pts
        </span>
        <span className="text-xs text-[#6b6b7a]">90 days</span>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
        aria-label="Rapid rating trend chart"
      >
        <defs>
          {/* Gradient fill under the line */}
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
          </linearGradient>
          {/* Glow filter for the line */}
          <filter id="lineGlow" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Guide lines */}
        {guides.map((r) => (
          <g key={r}>
            <line
              x1={padX}
              y1={toY(r)}
              x2={width - padX}
              y2={toY(r)}
              stroke="#3d3d47"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 4}
              y={toY(r) + 4}
              textAnchor="end"
              fontSize="9"
              fill="#6b6b7a"
            >
              {r}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#chartFill)" />

        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
        />

        {/* Data point dots — only first and last */}
        {[0, data.length - 1].map((i) => (
          <circle
            key={i}
            cx={toX(i)}
            cy={toY(data[i].rating)}
            r="3.5"
            fill="#10B981"
            stroke="#0a0a0b"
            strokeWidth="2"
          />
        ))}

        {/* End point label */}
        <text
          x={toX(data.length - 1) - 6}
          y={toY(last.rating) - 8}
          textAnchor="end"
          fontSize="10"
          fontWeight="700"
          fill="#34D399"
        >
          {last.rating}
        </text>

        {/* X-axis date labels */}
        {labelIndices.map((i) => (
          <text
            key={i}
            x={toX(i)}
            y={height - 2}
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
            fontSize="9"
            fill="#6b6b7a"
          >
            {formatDate(data[i].date)}
          </text>
        ))}
      </svg>
    </div>
  );
}
