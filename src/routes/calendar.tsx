import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "التقويم الهجري - فيض" },
      { name: "description", content: "التقويم الهجري مع التاريخ الميلادي المقابل." },
    ],
  }),
  component: CalendarPage,
});

const HIJRI_MONTHS = [
  "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
  "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة",
];

type Day = {
  hijri: { day: string; month: { number: number; ar: string }; year: string; weekday: { ar: string }; holidays: string[] };
  gregorian: { date: string; day: string; month: { en: string }; year: string };
};

function CalendarPage() {
  const now = new Date();
  const [today, setToday] = useState<Day | null>(null);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1447);
  const [days, setDays] = useState<Day[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${now.getFullYear()}`)
      .then((r) => r.json())
      .then((j) => {
        setToday(j.data);
        setMonth(Number(j.data.hijri.month.number));
        setYear(Number(j.data.hijri.year));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.aladhan.com/v1/hToGCalendar/${month}/${year}`)
      .then((r) => r.json())
      .then((j) => setDays(j.data))
      .catch(() => setDays(null))
      .finally(() => setLoading(false));
  }, [month, year]);

  const nav = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m); setYear(y);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">التقويم الهجري</h1>
        {today && (
          <p className="text-muted-foreground">
            اليوم: {today.hijri.weekday.ar}، {today.hijri.day} {today.hijri.month.ar} {today.hijri.year} هـ
            {" — "}الموافق {today.gregorian.date}
          </p>
        )}
      </header>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3">
        <button onClick={() => nav(-1)} className="p-2 rounded-lg hover:bg-muted"><ChevronRight className="h-5 w-5" /></button>
        <div className="text-lg font-bold">{HIJRI_MONTHS[month - 1]} {year} هـ</div>
        <button onClick={() => nav(1)} className="p-2 rounded-lg hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
      </div>

      {loading && <div className="text-center text-muted-foreground">جاري التحميل...</div>}

      {days && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {days.map((d, i) => {
            const isToday = today && d.hijri.day === today.hijri.day && d.hijri.month.number === today.hijri.month.number && d.hijri.year === today.hijri.year;
            return (
              <div key={i} className={`rounded-xl border p-3 text-center text-sm ${isToday ? "bg-foreground text-background border-foreground" : "border-border bg-card"}`}>
                <div className="text-xs opacity-70">{d.hijri.weekday.ar}</div>
                <div className="text-2xl font-extrabold">{d.hijri.day}</div>
                <div className="text-xs opacity-70">{d.gregorian.date}</div>
                {d.hijri.holidays?.length > 0 && (
                  <div className="text-[10px] mt-1 opacity-80">{d.hijri.holidays[0]}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="text-xs text-center text-muted-foreground">التقويم الهجري والميلادي</div>
    </div>
  );
}