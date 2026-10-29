import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, CalendarClock, CalendarDays, MessageCircle, Phone, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { RANGE_PRESETS, computeStats, followUps, resolveRange } from "@/lib/leadStats";
import { BarList, Funnel, LineChart } from "@/components/admin/Charts";

const fmtWhen = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const toInput = (d) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

const waLink = (phone, name) => {
  const d = phone.replace(/\D/g, "");
  return `https://wa.me/${d.length === 10 ? `91${d}` : d}?text=${encodeURIComponent(`Hi ${name}, this is Kishan from Kishan Real Estate. Following up on your enquiry.`)}`;
};

function Tile({ label, value, hint, to, tone }) {
  const body = (
    <>
      <p className={`text-3xl font-bold tabular-nums ${tone === "warn" && value > 0 ? "text-destructive" : ""}`}>{value ?? "–"}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </>
  );
  const cls = "bg-card border border-border rounded-xl p-4 block";
  return to ? <Link to={to} className={`${cls} hover:shadow-md hover:-translate-y-0.5 transition-all`}>{body}</Link> : <div className={cls}>{body}</div>;
}

function Card({ title, children, className = "", aside }) {
  return (
    <section className={`min-w-0 bg-card border border-border rounded-xl p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="font-semibold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function FollowUpRow({ lead, overdue }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="font-medium truncate">{lead.name}</p>
        <p className={`text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
          {fmtWhen(lead.follow_up_at)} · {lead.looking_for}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <a href={`tel:${lead.phone}`} title="Call" className="p-2 rounded-lg bg-blue-50 text-blue-600"><Phone size={16} /></a>
        <a href={waLink(lead.phone, lead.name)} target="_blank" rel="noreferrer" title="WhatsApp" className="p-2 rounded-lg bg-green-50 text-green-600"><MessageCircle size={16} /></a>
      </div>
    </li>
  );
}

function RangePicker({ preset, setPreset, custom, setCustom, label }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <CalendarDays size={18} className="text-muted-foreground" />
        {RANGE_PRESETS.map((r) => (
          <button
            key={r.id} onClick={() => setPreset(r.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              preset === r.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            {r.label}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{label}</span>
      </div>
      {preset === "custom" && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <input type="date" value={custom.from} max={custom.to || undefined} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="bg-card border border-border rounded-lg px-2 py-1.5" />
          <span className="text-muted-foreground">to</span>
          <input type="date" value={custom.to} min={custom.from || undefined} max={toInput(new Date())} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="bg-card border border-border rounded-lg px-2 py-1.5" />
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const [leads, setLeads] = useState(null);
  const [properties, setProperties] = useState(null);
  const [views, setViews] = useState([]);
  const [preset, setPreset] = useState("30");
  const [custom, setCustom] = useState({ from: toInput(Date.now() - 29 * 86_400_000), to: toInput(new Date()) });

  const range = useMemo(() => resolveRange(preset, custom), [preset, custom]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.from("leads").select("id,name,phone,looking_for,status,source,utm_source,created_at,follow_up_at,properties(title)").order("created_at", { ascending: false }).limit(5000),
      supabase.from("properties").select("id,status"),
    ]).then(([l, p]) => {
      if (!alive) return;
      if (l.error) toast.error(l.error.message);
      setLeads(l.data ?? []);
      setProperties(p.data ?? []);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    supabase
      .from("property_views")
      .select("visitor_id,created_at,properties(title)")
      .gte("created_at", range.from.toISOString())
      .lte("created_at", range.to.toISOString())
      .order("created_at", { ascending: false })
      .limit(20000)
      .then(({ data, error }) => {
        if (!alive) return;
        // Before 04_views.sql has been run the table does not exist; the dashboard still works without it.
        setViews(error ? [] : data);
      });
    return () => { alive = false; };
  }, [range]);

  const s = useMemo(() => (leads ? computeStats(leads, views, range) : null), [leads, views, range]);
  const f = useMemo(() => (leads ? followUps(leads) : null), [leads]);

  if (!s) return <p className="text-muted-foreground">Loading…</p>;

  const available = properties.filter((p) => p.status === "available").length;
  const dueCount = f.overdue.length + f.today.length;
  const change = s.change === 0 ? "same as before" : `${s.change > 0 ? "+" : ""}${s.change} vs previous period`;
  const unitLabel = s.bucketDays === 1 ? "per day" : "per week";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Welcome, Kishan</h1>
        <Link to="/admin/properties/new" className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold">
          <PlusCircle size={18} /> Add property
        </Link>
      </div>

      <RangePicker preset={preset} setPreset={setPreset} custom={custom} setCustom={setCustom} label={range.label} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile label="New leads in period" value={s.total} hint={change} to="/admin/leads" />
        <Tile label="Property views" value={s.viewCount} hint={`${s.visitorCount} different visitors`} />
        <Tile label="Conversion" value={`${s.conversion}%`} hint={`${s.status.closed} of ${s.total} closed`} />
        <Tile label="Waiting over 2 hours" value={s.slow} hint={`${s.toCall} still to call (all time)`} to="/admin/leads" tone="warn" />
      </div>

      {dueCount > 0 && (
        <Card title={`Follow-ups due (${dueCount})`} className="border-accent/60">
          <ul>
            {[...f.overdue.map((l) => ({ l, overdue: true })), ...f.today.map((l) => ({ l, overdue: false }))]
              .slice(0, 5)
              .map(({ l, overdue }) => <FollowUpRow key={l.id} lead={l} overdue={overdue} />)}
          </ul>
          <div className="flex items-center justify-between mt-3 text-xs">
            {f.overdue.length > 0
              ? <span className="flex items-center gap-1.5 text-destructive"><AlertTriangle size={14} /> {f.overdue.length} overdue</span>
              : <span />}
            {dueCount > 5 && <Link to="/admin/leads" className="text-primary font-semibold">See all {dueCount} →</Link>}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title={`New leads ${unitLabel}`} aside={<span className="text-xs text-muted-foreground">Hover for exact numbers</span>}>
          <LineChart data={s.leadBuckets} unit="leads" />
        </Card>
        <Card title={`Property views ${unitLabel}`}>
          <LineChart data={s.viewBuckets} unit="views" color="var(--primary)" />
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card title="Most viewed properties"><BarList items={s.viewed} empty="Views appear once visitors open property pages" /></Card>
        <Card title="Most enquired properties"><BarList items={s.enquired} empty="Enquiries from property pages will show here" /></Card>
        <Card title="Pipeline"><Funnel steps={s.funnel} /></Card>
        <Card title="What buyers ask for"><BarList items={s.demand} /></Card>
        <Card title="Where leads come from"><BarList items={s.sources} /></Card>
        {f.upcoming.length > 0 && (
          <Card title="Coming up">
            <ul>
              {f.upcoming.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-2 text-sm border-b border-border last:border-0">
                  <CalendarClock size={16} className="text-muted-foreground shrink-0" />
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground ml-auto">{fmtWhen(l.follow_up_at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{available} properties available · {properties.length} listed in total</p>
    </div>
  );
}
