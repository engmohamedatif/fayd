import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Calendar, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة - فيض" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Stats = { today: number; month: number; year: number; total: number };

function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
      try {
        const build = (from?: string) => {
          const b = supabase.from("visits").select("*", { count: "exact", head: true });
          return from ? b.gte("visited_at", from) : b;
        };
        const [t, m, y, tot] = await Promise.all([build(startOfDay), build(startOfMonth), build(startOfYear), build()]);
        setStats({
          today: t.count ?? 0,
          month: m.count ?? 0,
          year: y.count ?? 0,
          total: tot.count ?? 0,
        });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "تعذر تحميل الإحصائيات");
      }
    })();
  }, []);

  const cards = [
    { label: "زيارات اليوم", value: stats?.today, Icon: Calendar },
    { label: "زيارات الشهر", value: stats?.month, Icon: CalendarDays },
    { label: "زيارات السنة", value: stats?.year, Icon: BarChart3 },
    { label: "الإجمالي", value: stats?.total, Icon: Users },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold">لوحة الإدارة</h1>
        <p className="text-sm text-muted-foreground">إحصائيات الزيارات</p>
      </div>
      {err && <div className="text-center text-sm text-destructive">{err}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-border p-5 bg-card">
            <Icon className="h-6 w-6 mb-3 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-3xl font-extrabold tabular-nums mt-1">{value ?? "..."}</div>
          </div>
        ))}
      </div>
    </div>
  );
}