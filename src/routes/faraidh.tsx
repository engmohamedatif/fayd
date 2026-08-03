import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/faraidh")({
  head: () => ({
    meta: [
      { title: "الفرائض والمواريث - فيض" },
      { name: "description", content: "حاسبة الميراث الشرعي وجدول الفروض المقدرة في الفرائض." },
    ],
  }),
  component: FaraidhPage,
});

const FUROOD = [
  { heir: "الزوج", cases: [
    { fard: "1/2", cond: "إذا لم يكن للزوجة فرع وارث" },
    { fard: "1/4", cond: "إذا كان للزوجة فرع وارث" },
  ]},
  { heir: "الزوجة (فأكثر)", cases: [
    { fard: "1/4", cond: "إذا لم يكن للزوج فرع وارث" },
    { fard: "1/8", cond: "إذا كان للزوج فرع وارث" },
  ]},
  { heir: "الأب", cases: [
    { fard: "1/6", cond: "مع وجود الفرع الوارث الذكر" },
    { fard: "1/6 + الباقي", cond: "مع الفرع الوارث الأنثى" },
    { fard: "تعصيب", cond: "عند عدم الفرع الوارث" },
  ]},
  { heir: "الأم", cases: [
    { fard: "1/6", cond: "مع وجود الفرع الوارث أو جمع من الإخوة" },
    { fard: "1/3", cond: "عند عدم الفرع الوارث وجمع الإخوة" },
  ]},
  { heir: "البنت", cases: [
    { fard: "1/2", cond: "الواحدة عند عدم المعصّب" },
    { fard: "2/3", cond: "البنتان فأكثر عند عدم المعصّب" },
    { fard: "تعصيب", cond: "مع وجود الابن للذكر مثل حظ الأنثيين" },
  ]},
  { heir: "بنت الابن", cases: [
    { fard: "1/2", cond: "الواحدة عند عدم الفرع الأعلى منها" },
    { fard: "2/3", cond: "البنتان فأكثر" },
    { fard: "1/6", cond: "تكملة الثلثين مع بنت واحدة" },
  ]},
  { heir: "الأخت الشقيقة", cases: [
    { fard: "1/2", cond: "الواحدة عند عدم الفرع الوارث والأصل الوارث الذكر" },
    { fard: "2/3", cond: "اثنتان فأكثر" },
    { fard: "تعصيب", cond: "مع البنات أو الأخ الشقيق" },
  ]},
  { heir: "الأخت لأب", cases: [
    { fard: "1/2", cond: "الواحدة عند عدم الشقيق" },
    { fard: "2/3", cond: "اثنتان فأكثر" },
    { fard: "1/6", cond: "تكملة الثلثين مع شقيقة واحدة" },
  ]},
  { heir: "الإخوة لأم", cases: [
    { fard: "1/6", cond: "الواحد ذكراً كان أو أنثى" },
    { fard: "1/3", cond: "اثنان فأكثر يقتسمونه بالسوية" },
  ]},
  { heir: "الجد الصحيح", cases: [
    { fard: "كالأب", cond: "عند عدم وجود الأب" },
  ]},
  { heir: "الجدة الصحيحة", cases: [
    { fard: "1/6", cond: "عند عدم وجود الأم" },
  ]},
];

function FaraidhPage() {
  const [estate, setEstate] = useState(1000000);
  const [husband, setHusband] = useState(false);
  const [wives, setWives] = useState(0);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [father, setFather] = useState(false);
  const [mother, setMother] = useState(false);

  const result = calc({ estate, husband, wives, sons, daughters, father, mother });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">الفرائض والمواريث</h1>
        <p className="text-muted-foreground text-sm mt-1">حاسبة مبسّطة للحالات الشائعة + جدول الفروض المقدّرة.</p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-bold text-lg">حاسبة الميراث (الحالات الشائعة)</h2>
        <label className="block">
          <span className="text-sm">قيمة التركة</span>
          <input type="number" value={estate} onChange={(e) => setEstate(Number(e.target.value) || 0)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-lg" />
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={husband} onChange={(e) => { setHusband(e.target.checked); if (e.target.checked) setWives(0); }} /> الزوج</label>
          <label className="flex items-center gap-2">
            <span>الزوجات:</span>
            <input type="number" min={0} max={4} value={wives} onChange={(e) => { setWives(Math.min(4, Number(e.target.value) || 0)); if (Number(e.target.value) > 0) setHusband(false); }} className="w-16 rounded border border-border bg-background px-2 py-1" />
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={father} onChange={(e) => setFather(e.target.checked)} /> الأب</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={mother} onChange={(e) => setMother(e.target.checked)} /> الأم</label>
          <label className="flex items-center gap-2">
            <span>الأبناء:</span>
            <input type="number" min={0} value={sons} onChange={(e) => setSons(Number(e.target.value) || 0)} className="w-16 rounded border border-border bg-background px-2 py-1" />
          </label>
          <label className="flex items-center gap-2">
            <span>البنات:</span>
            <input type="number" min={0} value={daughters} onChange={(e) => setDaughters(Number(e.target.value) || 0)} className="w-16 rounded border border-border bg-background px-2 py-1" />
          </label>
        </div>

        <div className="rounded-xl bg-foreground text-background p-4 space-y-2">
          <div className="font-bold">التوزيع:</div>
          {result.shares.length === 0 && <div className="opacity-80 text-sm">أدخل الورثة لعرض التوزيع.</div>}
          {result.shares.map((s, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{s.label} — {s.fraction}</span>
              <span className="font-mono">{s.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          ))}
          {result.note && <div className="text-xs opacity-80 pt-2 border-t border-background/20">{result.note}</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="font-bold text-lg">جدول الفروض المقدّرة في القرآن</h2>
        <p className="text-sm text-muted-foreground">الفروض ستة: النصف، الربع، الثمن، الثلثان، الثلث، السدس.</p>
        <div className="divide-y divide-border">
          {FUROOD.map((f) => (
            <div key={f.heir} className="py-3">
              <div className="font-bold">{f.heir}</div>
              <ul className="text-sm mt-1 space-y-1">
                {f.cases.map((c, i) => (
                  <li key={i} className="flex flex-wrap gap-2">
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{c.fard}</span>
                    <span className="text-muted-foreground">{c.cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground pt-2">أحكام المواريث في الشريعة الإسلامية.</div>
      </section>
    </div>
  );
}

type Input = { estate: number; husband: boolean; wives: number; sons: number; daughters: number; father: boolean; mother: boolean };
type Share = { label: string; fraction: string; amount: number };

function calc(i: Input): { shares: Share[]; note?: string } {
  const shares: Share[] = [];
  const E = i.estate;
  const hasChild = i.sons > 0 || i.daughters > 0;
  if (E <= 0) return { shares: [] };

  let remaining = 1; // as fraction of estate

  // Spouse
  if (i.husband) {
    const f = hasChild ? 1 / 4 : 1 / 2;
    shares.push({ label: "الزوج", fraction: hasChild ? "1/4" : "1/2", amount: E * f });
    remaining -= f;
  } else if (i.wives > 0) {
    const f = hasChild ? 1 / 8 : 1 / 4;
    shares.push({ label: `الزوجات (${i.wives})`, fraction: hasChild ? "1/8" : "1/4", amount: E * f });
    remaining -= f;
  }

  // Mother
  if (i.mother) {
    const f = hasChild ? 1 / 6 : 1 / 3;
    shares.push({ label: "الأم", fraction: hasChild ? "1/6" : "1/3", amount: E * f });
    remaining -= f;
  }

  // Father
  if (i.father) {
    if (i.sons > 0) {
      const f = 1 / 6;
      shares.push({ label: "الأب", fraction: "1/6", amount: E * f });
      remaining -= f;
    } else if (i.daughters > 0) {
      // 1/6 fard + rest by taseeb (after other fard-holders)
      const f = 1 / 6;
      shares.push({ label: "الأب", fraction: "1/6 + الباقي تعصيباً", amount: 0 });
      remaining -= f;
      // add taseeb amount later
      (shares[shares.length - 1] as Share).amount = E * f;
    } else {
      // father takes rest by taseeb
      shares.push({ label: "الأب", fraction: "تعصيب", amount: 0 });
    }
  }

  // Children
  if (i.sons > 0) {
    // sons + daughters share remainder: 2:1
    const units = i.sons * 2 + i.daughters;
    let childrenShare = remaining;
    // if father with daughter-only case handled above, father took 1/6 + rest — but with sons there's no father remainder
    if (i.father && i.daughters > 0 && i.sons === 0) {
      // unreachable here since sons > 0
    }
    if (i.father && i.daughters > 0 && i.sons > 0) {
      // father took 1/6 only above (sons branch), but we already set 1/6 for father when sons>0
    }
    const perUnit = (E * childrenShare) / units;
    if (i.sons > 0) shares.push({ label: `الأبناء (${i.sons})`, fraction: `${i.sons * 2}/${units} من الباقي`, amount: perUnit * i.sons * 2 });
    if (i.daughters > 0) shares.push({ label: `البنات (${i.daughters})`, fraction: `${i.daughters}/${units} من الباقي`, amount: perUnit * i.daughters });
  } else if (i.daughters > 0) {
    let df: number;
    let flabel: string;
    if (i.daughters === 1) { df = 1 / 2; flabel = "1/2"; }
    else { df = 2 / 3; flabel = "2/3"; }
    shares.push({ label: `البنات (${i.daughters})`, fraction: flabel, amount: E * df });
    remaining -= df;
    // if father with daughters, father gets 1/6 + remainder
    if (i.father && remaining > 0) {
      const idx = shares.findIndex((s) => s.label === "الأب");
      if (idx >= 0) {
        shares[idx].amount += E * remaining;
        shares[idx].fraction = "1/6 + " + (remaining).toFixed(3) + " تعصيباً";
      }
      remaining = 0;
    }
  }

  // If father is sole 'asaba (no children), give him remainder
  if (i.father && !hasChild) {
    const idx = shares.findIndex((s) => s.label === "الأب");
    if (idx >= 0 && shares[idx].amount === 0) {
      shares[idx].amount = E * remaining;
      shares[idx].fraction = "تعصيب (" + remaining.toFixed(3) + ")";
      remaining = 0;
    }
  }

  let note: string | undefined;
  if (remaining > 0.001) note = `متبقٍ ${(remaining * 100).toFixed(1)}% يُوزَّع على العصبات (لم تُدخَل في هذه الحاسبة المبسّطة).`;
  if (remaining < -0.001) note = "الحالة فيها عول: تُقسَّم التركة بنسبة الفروض (راجع أهل العلم).";

  return { shares, note };
}