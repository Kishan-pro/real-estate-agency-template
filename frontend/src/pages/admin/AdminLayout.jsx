import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Bell, BellRing, Building2, Download, Globe, LayoutDashboard, LogOut, Users } from "lucide-react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

// Short two-tone chime via the browser's audio engine (no sound file needed).
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1175].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.45);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    // audio blocked until the user interacts with the page; the toast still shows
  }
}

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [installEvent, setInstallEvent] = useState(null);
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-8 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kishan Real Estate</h1>
          <p className="text-sm text-muted-foreground">Owner login</p>
        </div>
        <input
          type="email" required autoComplete="username" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-input rounded-lg px-3 py-3 text-sm"
        />
        <input
          type="password" required autoComplete="current-password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-input rounded-lg px-3 py-3 text-sm"
        />
        <button
          disabled={busy}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 font-semibold rounded-lg py-3"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {installEvent && (
          <button
            type="button" onClick={() => installEvent.prompt()}
            className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-3 text-sm text-foreground"
          >
            <Download size={16} /> Install as an app on this phone
          </button>
        )}
        {isIos && (
          <p className="text-xs text-muted-foreground text-center">
            To install on iPhone: tap the Share button, then “Add to Home Screen”.
          </p>
        )}
        <a href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">← Back to website</a>
      </form>
    </div>
  );
}

function Shell({ session }) {
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);
  const [notifyOn, setNotifyOn] = useState(() => "Notification" in window && Notification.permission === "granted");

  // New-lead alert (toast + sound + tab counter + optional desktop notification) anywhere in the admin.
  useEffect(() => {
    const channel = supabase
      .channel("admin-new-lead-alert")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, (p) => {
        toast.success(`New lead: ${p.new.name} (${p.new.looking_for})`, { duration: 8000 });
        beep();
        setUnread((n) => n + 1);
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New lead", { body: `${p.new.name} · ${p.new.looking_for}`, icon: "/icon.svg" });
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // Opening the leads list counts as "seen".
  useEffect(() => {
    if (pathname.startsWith("/admin/leads")) setUnread(0);
  }, [pathname]);

  useEffect(() => {
    document.title = unread ? `(${unread}) New lead · Kishan Admin` : "Kishan Admin";
  }, [unread]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) return toast.error("This browser does not support notifications.");
    const result = await Notification.requestPermission();
    setNotifyOn(result === "granted");
    if (result === "granted") {
      beep();
      toast.success("Alerts are on. You'll be notified when a lead arrives.");
    } else toast.error("Notifications are blocked in the browser settings.");
  };

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-card md:p-4 md:sticky md:top-0 md:h-screen">
        <p className="font-bold text-lg px-3 pb-4">Kishan Admin</p>
        <nav className="space-y-1 flex-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkCls}>
              <Icon size={18} /> {label}
              {to === "/admin/leads" && unread > 0 && <span className="ml-auto bg-destructive text-white text-xs font-bold rounded-full px-2 py-0.5">{unread}</span>}
            </NavLink>
          ))}
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
            <Globe size={18} /> View website
          </a>
        </nav>
        <div className="flex items-center justify-between px-3">
          <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
          <span className="flex">
            <button onClick={enableNotifications} title={notifyOn ? "Lead alerts are on" : "Turn on lead alerts"} className={`p-2 rounded-lg hover:bg-muted ${notifyOn ? "text-accent" : "text-muted-foreground"}`}>
            {notifyOn ? <BellRing size={18} /> : <Bell size={18} />}
          </button>
            <ThemeToggle />
          </span>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      {/* Top bar (mobile) */}
      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <span className="font-bold">Kishan Admin</span>
          <div className="flex items-center gap-1">
            <button onClick={enableNotifications} title={notifyOn ? "Lead alerts are on" : "Turn on lead alerts"} className={`p-2 rounded-lg hover:bg-muted ${notifyOn ? "text-accent" : "text-muted-foreground"}`}>
            {notifyOn ? <BellRing size={18} /> : <Bell size={18} />}
          </button>
            <ThemeToggle />
            <a href="/" title="View website" className="p-2 rounded-lg text-muted-foreground"><Globe size={18} /></a>
            <button onClick={() => supabase.auth.signOut()} title="Sign out" className="p-2 rounded-lg text-muted-foreground">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-5 pb-28 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-card border-t border-border grid grid-cols-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`
            }
          >
            <span className="relative"><Icon size={22} />{to === "/admin/leads" && unread > 0 && <span className="absolute -top-1.5 -right-2.5 bg-destructive text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 grid place-items-center">{unread}</span>}</span> {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function AdminLayout() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center text-muted-foreground">
        Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
      </div>
    );
  }
  if (session === undefined) return null;
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="manifest" href="/manifest.webmanifest" />
      {session ? <Shell session={session} /> : <Login />}
    </>
  );
}
