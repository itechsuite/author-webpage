"use client";

interface Point {
  label: string;
  value: number;
}

/** Hand-rolled inline-SVG area chart — no charting dependency, matching this
 * codebase's convention of small hand-rolled UI over pulling in libraries. */
export default function TrendChart({ data, height = 160 }: { data: Point[]; height?: number }) {
  const width = 600;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - (d.value / max) * (height - 20) - 10;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c7dff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4c7dff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trend-fill)" />
      <path d={linePath} fill="none" stroke="#4c7dff" strokeWidth={2} strokeLinejoin="round" />
      {points.length > 0 && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={4} fill="#7c9cff" />
      )}
    </svg>
  );
}
