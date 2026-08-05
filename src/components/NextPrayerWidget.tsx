import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";

type Timings = Record<string, string>;
type Cache = { lat: number; lon: number; timings: Timings; timezone?: string; date: string };
const CACHE_KEY = "fayd:prayer-cache";
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export function NextPrayerWidget() {
  const [status, setStatus] = useState<"idle" | "loading" | "denied" | "ready" | "error">("idle");
  const [timings, setTimings] = useState<Timings | null>(null);
  const [city, setCity] = useState<string>("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayKey = () => new Date().toISOString().slice(0, 10);

  const fetchTimings = async (lat: number, lon: number, showLoading: boolean) => {
    if (showLoading) setStatus("loading");
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`,
      );
      const json = await res.json();
      const t: Timings = json.data.timings;
      const tz = json.data.meta?.timezone ?? "";
      setTimings(t);
      setCity(tz);
      setStatus("ready");
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ lat, lon, timings: t, timezone: tz, date: todayKey() } satisfies Cache),
        );
      } catch {}
    } catch {
      if (showLoading) setStatus("error");
    }
  };

  const requestLocation = (silent = false) => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    if (!silent) setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchTimings(pos.coords.latitude, pos.coords.longitude, !silent),
      () => { if (!silent) setStatus("denied"); },
      { timeout: 10000, maximumAge: 60 * 60 * 1000 },
    );
  };

  useEffect(() => {
    // 1) Try cache first for instant paint
    let hadCache = false;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const c: Cache = JSON.parse(raw);
        if (c?.timings) {
          setTimings(c.timings);
          setCity(c.timezone ?? "");
          setStatus("ready");
          hadCache = true;
          // If cache is from today, refresh silently in background using cached coords.
          if (c.date === todayKey()) {
            fetchTimings(c.lat, c.lon, false);
            return;
          }
        }
      }
    } catch {}

    // 2) If permission already granted, skip loading state
    const start = async () => {
      try {
        // @ts-ignore
        if (navigator.permissions?.query) {
          // @ts-ignore
          const p = await navigator.permissions.query({ name: "geolocation" });
          if (p.state === "granted") {
            requestLocation(hadCache);
            return;
          }
        }
      } catch {}
      requestLocation(hadCache);
    };
    start();
  }, []);

  const next = (() => {
    if (!timings) return null;
    const today = now;
    for (const p of PRAYERS) {
      const [h, m] = timings[p].split(":").map(Number);
      const d = new Date(today);
      d.setHours(h, m, 0, 0);
      if (d > today) return { name: p, date: d };
    }
    const [h, m] = timings.Fajr.split(":").map(Number);
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    d.setHours(h, m, 0, 0);
    return { name: "Fajr", date: d };
  })();

  const diff = next ? next.date.getTime() - now.getTime() : 0;
  const hh = Math.max(0, Math.floor(diff / 3_600_000));
  const mm = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));
  const ss = Math.max(0, Math.floor((diff % 60_000) / 1000));

  return (
    <div className="flex h-full min-h-[300px] items-center border border-border bg-muted p-6 text-foreground md:min-h-[390px] md:p-8">
      {status === "ready" && timings && next ? (
        <div className="grid w-full gap-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm opacity-70">
              <Clock className="h-4 w-4" />
              <span>الصلاة القادمة</span>
            </div>
            <div className="mt-2 text-4xl md:text-5xl font-extrabold">{NAMES[next.name]}</div>
            <div className="mt-1 text-sm opacity-80">
              في تمام {next.date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
            </div>
            {city && (
              <div className="mt-3 flex items-center gap-1 text-xs opacity-60">
                <MapPin className="h-3 w-3" />
                <span>{city}</span>
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <div className="text-sm opacity-70">متبقي</div>
            <div className="mt-1 font-mono text-3xl md:text-4xl font-bold tabular-nums" dir="ltr">
              {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
              {PRAYERS.map((p) => (
                <div key={p} className="border border-border bg-background px-1 py-2">
                  <div className="opacity-70">{NAMES[p]}</div>
                  <div className="font-semibold mt-1" dir="ltr">{timings[p]?.slice(0, 5)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : status === "loading" || status === "idle" ? (
        <div className="text-center py-6 opacity-80">جاري تحديد موقعك...</div>
      ) : (
        <div className="text-center space-y-3">
          <p className="opacity-80">لعرض مواقيت الصلاة والصلاة القادمة نحتاج إذن الوصول لموقعك.</p>
          <button
            onClick={() => requestLocation()}
            className="rounded-full bg-background text-foreground px-5 py-2 font-semibold hover:opacity-90"
          >
            السماح بالوصول للموقع
          </button>
        </div>
      )}
    </div>
  );
}