import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Download, History, MessageCircle, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const LEAD_STATUSES = [
  { value: "new", label: "New", cls: "bg-blue-100 text-blue-700" },
  { value: "contacted", label: "Contacted", cls: "bg-amber-100 text-amber-700" },
  { value: "visit", label: "Site Visit", cls: "bg-purple-100 text-purple-700" },
  { value: "closed", label: "Closed", cls: "bg-green-100 text-green-700" },
  { value: "lost", label: "Lost", cls: "bg-gray-200 text-gray-600" },
];
const statusMeta = (v) => LEAD_STATUSES.find((s) => s.value === v) ?? LEAD_STATUSES[0];

const waLink = (phone, name) => {
  const digits = phone.replace(/\D/g, "");
  const num = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${num}?text=${encodeURIComponent(`Hi ${name}, this is Kishan from Kishan Real Estate. Thanks for your enquiry!`)}`;
};

const fmtDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

// "Due" = follow-up date is today or earlier (same rule as the dashboard).
const isDue = (l) => {
  if (!l.follow_up_at || l.status === "closed" || l.status === "lost") return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return new Date(l.follow_up_at) <= endOfToday;
};
const isOverdue = (l) => isDue(l) && new Date(l.follow_up_at) < new Date();

const EVENT_TEXT = {
  created: () => "Enquiry received",
  status: (e) => `Status: ${statusMeta(e.from_value).label} → ${statusMeta(e.to_value).label}`,
  follow_up: (e) => (e.to_value ? `Follow-up set for ${fmtDate(e.to_value)}` : "Follow-up cleared"),
};

function LeadHistory({ lead }) {
  const [events, setEvents] = useState(null);
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    supabase.from("lead_events").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false })
      .then(({ data, error }) => setEvents(error ? [] : data));
    if (!lead.visitor_id) return;
    // Everything this visitor opened (same browser), most-viewed first.
    supabase.from("property_views").select("created_at, properties(title)").eq("visitor_id", lead.visitor_id).order("created_at", { ascending: false }).limit(200)
      .then(({ data, error }) => {
        if (error || !data) return;
        const by = new Map();
        for (const v of data) {
          const t = v.properties?.title ?? "Removed property";
          const cur = by.get(t) ?? { title: t, count: 0, last: v.created_at };
          cur.count += 1;
          by.set(t, cur);
        }
        setViewed([...by.values()].sort((x, y) => y.count - x.count));
      });
  }, [lead.id, lead.visitor_id]);

  if (!events) return <p className="text-xs text-muted-foreground">Loading…</p>;
  return (
    <div className="space-y-4 text-xs">
      {viewed.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1.5">Properties this visitor looked at</p>
          <ul className="space-y-1">
            {viewed.map((v) => (
              <li key={v.title} className="flex justify-between gap-3 text-muted-foreground">
                <span className="text-foreground">{v.title}</span>
                <span className="shrink-0">{v.count} {v.count === 1 ? "view" : "views"} · last {fmtDate(v.last)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="font-semibold text-foreground mb-1.5">Activity</p>
        {events.length === 0 ? <p className="text-muted-foreground">No history yet.</p> : (
          <ul className="space-y-1.5">
            {events.map((e) => (
              <li key={e.id} className="flex gap-2 text-muted-foreground">
                <span className="shrink-0 w-28">{fmtDate(e.created_at)}</span>
                <span className="text-foreground">{EVENT_TEXT[e.kind]?.(e)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openHistory, setOpenHistory] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*, properties(title)")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setLeads(data);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("leads-list")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, () => load())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const patch = async (id, changes) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
    const { error } = await supabase.from("leads").update(changes).eq("id", id);
    if (error) {
      toast.error(error.message);
      load();
    }
  };

  const remove = async (lead) => {
    if (!window.confirm(`Delete the lead from "${lead.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
  };

  const counts = useMemo(() => {
    const c = { all: leads.length };
    LEAD_STATUSES.forEach((s) => (c[s.value] = leads.filter((l) => l.status === s.value).length));
    c.due = leads.filter(isDue).length;
    return c;
  }, [leads]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (filter === "all" || (filter === "due" ? isDue(l) : l.status === filter)) &&
        (!q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.notes ?? "").toLowerCase().includes(q)),
    );
  }, [leads, filter, query]);

  const exportCsv = () => {
    const cols = ["created_at", "name", "phone", "looking_for", "status", "follow_up_at", "whatsapp_updates", "source", "utm_source", "utm_campaign", "notes"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...visible.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Leads <span className="text-primary text-lg">({counts.new} new)</span>
        </h1>
        <div className="flex gap-1">
          <button onClick={load} title="Refresh" className="p-2 rounded-lg hover:bg-muted">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={exportCsv} title="Download as spreadsheet (CSV)" className="p-2 rounded-lg hover:bg-muted">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, { value: "due", label: "Follow-up due" }, ...LEAD_STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"
            }`}
          >
            {s.label} <span className="opacity-70">{counts[s.value]}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone or notes"
          className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm"
        />
      </div>

      {visible.length === 0 && !loading && <p className="text-center text-muted-foreground py-12">No leads here yet.</p>}

      <ul className="space-y-3">
        {visible.map((l) => (
          <li key={l.id} className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-sm text-muted-foreground">
                  {l.phone} · Looking for <b className="text-foreground">{l.looking_for}</b>
                </p>
                {l.properties?.title && (
                  <p className="text-sm text-primary">About: {l.properties.title}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fmtDate(l.created_at)}
                  {l.whatsapp_updates && " · OK to WhatsApp"}
                  {l.utm_source && ` · via ${l.utm_source}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${l.phone}`} title="Call" className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <Phone size={18} />
                </a>
                <a
                  href={waLink(l.phone, l.name)} target="_blank" rel="noreferrer" title="WhatsApp"
                  className="p-2.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                >
                  <MessageCircle size={18} />
                </a>
                <select
                  value={l.status} onChange={(e) => patch(l.id, { status: e.target.value })}
                  className={`text-sm font-medium rounded-lg px-2 py-2.5 border-0 ${statusMeta(l.status).cls}`}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => remove(l)} title="Delete" className="p-2.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <textarea
              defaultValue={l.notes ?? ""} rows={1} placeholder="Add a note (budget, follow-up date…)"
              onBlur={(e) => e.target.value !== (l.notes ?? "") && patch(l.id, { notes: e.target.value || null })}
              className="mt-3 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className={`flex items-center gap-2 text-xs ${isOverdue(l) ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                <CalendarClock size={15} /> Follow up
                <input
                  type="datetime-local" value={toLocalInput(l.follow_up_at)}
                  onChange={(e) => patch(l.id, { follow_up_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground"
                />
              </label>
              <button onClick={() => setOpenHistory(openHistory === l.id ? null : l.id)} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <History size={14} /> History
              </button>
            </div>
            {openHistory === l.id && <div className="mt-3 pt-3 border-t border-border"><LeadHistory lead={l} /></div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
