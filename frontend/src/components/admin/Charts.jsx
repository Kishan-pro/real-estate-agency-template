import { useRef, useState } from "react";

// Small dependency-free charts. Colours come from the theme tokens so they work in dark mode.

// data: [{ label, value }]. Hover (or touch-drag) shows a guide line, a dot and a tooltip with the exact value.
export function LineChart({ data, height = 190, color = "var(--accent)", unit = "leads" }) {
  const w = 600;
  const pad = { l: 30, r: 10, t: 12, b: 24 };
  const ref = useRef(null);
  const [hover, setHover] = useState(null);

  const max = Math.max(1, ...data.map((d) => d.value));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const x = (i) => pad.l + (i * (w - pad.l - pad.r)) / Math.max(1, data.length - 1);
  const y = (v) => pad.t + (1 - v / niceMax) * (height - pad.t - pad.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${height - pad.b} L${x(0)},${height - pad.b} Z`;
  const ticks = [0, niceMax / 2, niceMax];
  const labelAt = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])];

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    const i = Math.round(((px - pad.l) / (w - pad.l - pad.r)) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const h = hover === null ? null : data[hover];
  const leftPct = hover === null ? 0 : (x(hover) / w) * 100;

  return (
    <div className="relative select-none">
      <svg
        ref={ref} viewBox={`0 0 ${w} ${height}`} className="w-full h-auto touch-pan-y cursor-crosshair"
        role="img" aria-label={`${unit} over time`}
        onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="hsl(var(--border))" strokeDasharray={t ? "3 3" : ""} />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">{Math.round(t)}</text>
          </g>
        ))}
        <path d={area} fill={`hsl(${color} / 0.16)`} />
        <path d={line} fill="none" stroke={`hsl(${color})`} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {data.length <= 40 && data.map((d, i) => d.value > 0 && <circle key={i} cx={x(i)} cy={y(d.value)} r="2.5" fill={`hsl(${color})`} />)}
        {labelAt.map((i) => (
          <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} fontSize="11" fill="hsl(var(--muted-foreground))">
            {data[i]?.short ?? data[i]?.label}
          </text>
        ))}
        {h && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={height - pad.b} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" />
            <circle cx={x(hover)} cy={y(h.value)} r="6" fill="hsl(var(--card))" stroke={`hsl(${color})`} strokeWidth="3" />
          </g>
        )}
      </svg>
      {h && (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg whitespace-nowrap"
          style={{ left: `${Math.min(88, Math.max(12, leftPct))}%` }}
        >
          <p className="text-muted-foreground">{h.label}</p>
          <p className="font-semibold text-sm">{h.value} {h.value === 1 ? unit.replace(/s$/, "") : unit}</p>
        </div>
      )}
    </div>
  );
}

// Horizontal bars: items = [{ label, value, note? }]. Hover highlights a row and shows its share of the total.
export function BarList({ items, empty = "No data in this period" }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const sum = items.reduce((a, i) => a + i.value, 0) || 1;
  if (!items.length) return <p className="text-sm text-muted-foreground py-4">{empty}</p>;
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li
          key={i.label}
          title={`${i.label}: ${i.value} (${Math.round((i.value / sum) * 100)}%)${i.note ? ` · ${i.note}` : ""}`}
          className="group rounded-lg px-2 py-1.5 -mx-2 hover:bg-muted/70 transition-colors cursor-default"
        >
          <div className="flex justify-between gap-2 text-sm mb-1">
            <span className="min-w-0 truncate">{i.label}</span>
            <span className="shrink-0 tabular-nums">
              <span className="hidden group-hover:inline text-xs text-muted-foreground mr-2">
                {Math.round((i.value / sum) * 100)}%{i.note ? ` · ${i.note}` : ""}
              </span>
              <span className="font-semibold">{i.value}</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary group-hover:bg-accent transition-all duration-300" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Pipeline funnel: steps = [{ label, value }] in order. Hover shows the drop from the previous step.
export function Funnel({ steps }) {
  const first = Math.max(1, steps[0]?.value ?? 1);
  return (
    <ul className="space-y-1">
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const hint = prev ? `${prev ? Math.round((s.value / prev) * 100) : 0}% of ${steps[i - 1].label.toLowerCase()}` : "all leads in this period";
        return (
          <li key={s.label} title={`${s.label}: ${s.value} (${hint})`} className="group flex items-center gap-3 rounded-lg px-2 py-1 -mx-2 hover:bg-muted/70 transition-colors cursor-default">
            <span className="w-20 sm:w-24 shrink-0 text-sm text-muted-foreground">{s.label}</span>
            <div className="flex-1 h-8 rounded-lg bg-muted overflow-hidden">
              <div
                className="h-full rounded-lg bg-primary group-hover:bg-accent group-hover:text-accent-foreground flex items-center px-3 text-xs font-semibold text-primary-foreground transition-all duration-300"
                style={{ width: `${Math.max(8, (s.value / first) * 100)}%`, opacity: 1 - i * 0.1 }}
              >
                {s.value}
              </div>
            </div>
            <span className="w-16 sm:w-24 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
              <span className="group-hover:hidden">{Math.round((s.value / first) * 100)}%</span>
              <span className="hidden group-hover:inline">{hint}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
