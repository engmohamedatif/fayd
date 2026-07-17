import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/zakat")({
  head: () => ({
    meta: [
      { title: "حاسبة الزكاة - فيض" },
      { name: "description", content: "احسب زكاة المال والذهب والفضة والأنعام حسب الشريعة." },
    ],
  }),
  component: ZakatPage,
});

function ZakatPage() {
  const [goldPrice, setGoldPrice] = useState(3800); // per gram in local currency (editable)
  const [silverPrice, setSilverPrice] = useState(45);

  // Assets
  const [cash, setCash] = useState(0);
  const [gold, setGold] = useState(0); // grams
  const [silver, setSilver] = useState(0); // grams
  const [trade, setTrade] = useState(0);
  const [debts, setDebts] = useState(0);

  const nisabGold = goldPrice * 85; // 85g gold
  const nisabSilver = silverPrice * 595; // 595g silver

  const totalWealth = cash + gold * goldPrice + silver * silverPrice + trade - debts;
  const nisab = Math.min(nisabGold, nisabSilver); // lower nisab is generally preferred
  const eligible = totalWealth >= nisab;
  const zakatDue = eligible ? totalWealth * 0.025 : 0;

  useEffect(() => {
    try {
      const s = localStorage.getItem("zakat");
      if (s) {
        const p = JSON.parse(s);
        setGoldPrice(p.goldPrice ?? 3800);
        setSilverPrice(p.silverPrice ?? 45);
      }
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("zakat", JSON.stringify({ goldPrice, silverPrice })); } catch { /* noop */ }
  }, [goldPrice, silverPrice]);

  const Row = ({ label, val, on, hint }: { label: string; val: number; on: (v: number) => void; hint?: string }) => (
    <label className="block">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <input
        type="number"
        value={val || ""}
        onChange={(e) => on(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-lg"
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">حاسبة الزكاة</h1>
        <p className="text-muted-foreground text-sm mt-1">الزكاة 2.5% إذا بلغ المال النصاب وحال عليه الحول.</p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold">أسعار السوق الحالية</h2>
        <div className="grid grid-cols-2 gap-3">
          <Row label="سعر جرام الذهب (عيار 24)" val={goldPrice} on={setGoldPrice} />
          <Row label="سعر جرام الفضة" val={silverPrice} on={setSilverPrice} />
        </div>
        <div className="text-xs text-muted-foreground">
          نصاب الذهب: 85 جم = {nisabGold.toLocaleString()} — نصاب الفضة: 595 جم = {nisabSilver.toLocaleString()}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold">ممتلكاتك</h2>
        <Row label="النقد والودائع البنكية" val={cash} on={setCash} />
        <Row label="الذهب (بالجرام)" val={gold} on={setGold} hint="عيار 24" />
        <Row label="الفضة (بالجرام)" val={silver} on={setSilver} />
        <Row label="عروض التجارة (البضائع)" val={trade} on={setTrade} />
        <Row label="الديون المستحقة عليك" val={debts} on={setDebts} />
      </div>

      <div className="rounded-2xl border border-border bg-foreground text-background p-6 text-center space-y-2">
        <div className="text-sm opacity-80">إجمالي المال الزكوي</div>
        <div className="text-2xl font-bold">{totalWealth.toLocaleString()}</div>
        <div className="text-sm opacity-80 pt-2">النصاب المعتمد (الأقل)</div>
        <div className="text-lg">{nisab.toLocaleString()}</div>
        <div className="pt-4 border-t border-background/20">
          <div className="text-sm opacity-80">الزكاة الواجبة</div>
          <div className="text-4xl font-extrabold mt-1">{zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs opacity-80 mt-1">{eligible ? "تجب عليك الزكاة" : "لم يبلغ مالك النصاب"}</div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        هذه الحاسبة إرشادية. راجع أهل العلم للحالات الخاصة (زكاة الأنعام، الزروع، الركاز).
      </div>
    </div>
  );
}