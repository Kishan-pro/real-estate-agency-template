const DAY = 86_400_000;
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const bump = (map, key, by = 1) => map.set(key, (map.get(key) ?? 0) + by);
const top = (map, n = 6) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, value]) => ({ label, value }));
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export const RANGE_PRESETS = [
  { id: "7", label: "7 days" },
  { id: "30", label: "30 days" },
  { id: "month", label: "This month" },
  { id: "lastmonth", label: "Last month" },
  { id: "90", label: "90 days" },
  { id: "custom", label: "Custom" },
];

// -> { from, to, label } with from at 00:00 and to at 23:59:59 (local time).
export function resolveRange(preset, custom = {}, now = new Date()) {
  const today = startOfDay(now);
  let from;
  let to = endOfDay(now);
  if (preset === "month") from = new Date(today.getFullYear(), today.getMonth(), 1);
  else if (preset === "lastmonth") {
    from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    to = endOfDay(new Date(today.getFullYear(), today.getMonth(), 0));
  } else if (preset === "custom") {
    const a = custom.from ? startOfDay(new Date(`${custom.from}T00:00`)) : new Date(today.getTime() - 29 * DAY);
    const b = custom.to ? endOfDay(new Date(`${custom.to}T00:00`)) : to;
    [from, to] = a <= b ? [a, b] : [startOfDay(b), endOfDay(a)];
  } else from = new Date(today.getTime() - (Number(preset) - 1) * DAY);
  return { from, to, label: `${fmt(from)} – ${fmt(to)}` };
}

// Day-by-day buckets, or week-by-week when the range is long, so charts stay readable.
function makeBuckets(range) {
  const days = Math.round((startOfDay(range.to) - range.from) / DAY) + 1;
  const step = days > 62 ? 7 : 1;
  const buckets = [];
  for (let t = range.from.getTime(); t <= range.to.getTime(); t += step * DAY) {
    const start = new Date(t);
    const end = new Date(Math.min(t + step * DAY - 1, range.to.getTime()));
    buckets.push({
      start, end, value: 0,
      label: step === 1 ? fmt(start) : `${fmt(start)} – ${fmt(end)}`,
      short: fmt(start),
    });
  }
  return { buckets, step };
}

function fillBuckets(buckets, dates) {
  for (const iso of dates) {
    const t = new Date(iso).getTime();
    const b = buckets.find((x) => t >= x.start.getTime() && t <= x.end.getTime());
    if (b) b.value += 1;
  }
  return buckets;
}

const inRange = (iso, range) => {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
};

// leads: ALL leads (so "to call" and "waiting" stay accurate). views: property_views rows inside `range`.
export function computeStats(leads, views, range, now = new Date()) {
  const scoped = leads.filter((l) => inRange(l.created_at, range));
  const length = range.to - range.from;
  const prevRange = { from: new Date(range.from.getTime() - length - 1), to: new Date(range.from.getTime() - 1) };
  const prevCount = leads.filter((l) => inRange(l.created_at, prevRange)).length;

  const status = { new: 0, contacted: 0, visit: 0, closed: 0, lost: 0 };
  const demand = new Map();
  const sources = new Map();
  const enquired = new Map();
  for (const l of scoped) {
    status[l.status] = (status[l.status] ?? 0) + 1;
    bump(demand, l.looking_for);
    bump(sources, l.utm_source || (l.source === "form" ? "Website form" : l.source));
    if (l.properties?.title) bump(enquired, l.properties.title);
  }

  const { buckets: leadBuckets, step } = makeBuckets(range);
  fillBuckets(leadBuckets, scoped.map((l) => l.created_at));
  const { buckets: viewBuckets } = makeBuckets(range);
  fillBuckets(viewBuckets, views.map((v) => v.created_at));

  const viewsByProperty = new Map();
  const visitorsByProperty = new Map();
  for (const v of views) {
    const title = v.properties?.title ?? "Removed property";
    bump(viewsByProperty, title);
    if (!visitorsByProperty.has(title)) visitorsByProperty.set(title, new Set());
    visitorsByProperty.get(title).add(v.visitor_id);
  }

  const total = scoped.length;
  const reached = total - status.new;
  return {
    total, prevCount,
    change: total - prevCount,
    status,
    toCall: leads.filter((l) => l.status === "new").length,
    slow: leads.filter((l) => l.status === "new" && now - new Date(l.created_at) > 2 * 3_600_000).length,
    conversion: total ? Math.round((status.closed / total) * 100) : 0,
    leadBuckets, viewBuckets, bucketDays: step,
    viewCount: views.length,
    visitorCount: new Set(views.map((v) => v.visitor_id)).size,
    funnel: [
      { label: "New leads", value: total },
      { label: "Contacted", value: reached },
      { label: "Site visit", value: status.visit + status.closed },
      { label: "Closed", value: status.closed },
    ],
    demand: top(demand),
    sources: top(sources),
    enquired: top(enquired, 5),
    viewed: top(viewsByProperty, 5).map((r) => ({ ...r, note: `${visitorsByProperty.get(r.label).size} visitors` })),
  };
}

// Open leads that have a follow-up date, split into overdue / today / upcoming.
export function followUps(leads, now = new Date()) {
  const open = leads.filter((l) => l.follow_up_at && l.status !== "closed" && l.status !== "lost");
  const endToday = endOfDay(now);
  const byDate = (a, b) => new Date(a.follow_up_at) - new Date(b.follow_up_at);
  return {
    overdue: open.filter((l) => new Date(l.follow_up_at) < now && !sameDay(new Date(l.follow_up_at), now)).sort(byDate),
    today: open.filter((l) => sameDay(new Date(l.follow_up_at), now)).sort(byDate),
    upcoming: open.filter((l) => new Date(l.follow_up_at) > endToday).sort(byDate).slice(0, 5),
  };
}
