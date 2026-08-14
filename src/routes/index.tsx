import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Headphones, Radio, Sparkles } from "lucide-react";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { navigationGroups } from "@/lib/navigation";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "فيض — القرآن والذكر والعلم" },
    { name: "description", content: "اقرأ واستمع للقرآن، وتصفح الأذكار والحديث والكتب والمحاضرات في تطبيق إسلامي عربي متكامل." },
    { property: "og:title", content: "فيض — القرآن والذكر والعلم" },
    { property: "og:description", content: "مكتبتك الإسلامية للقرآن والذكر والعلم والصوتيات." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pt-10">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)] lg:items-stretch">
        <div className="flex min-h-[300px] flex-col justify-between bg-primary p-6 text-primary-foreground md:min-h-[390px] md:p-10">
          <div className="flex items-center justify-between"><span className="text-xs font-bold">رفيقك اليومي</span><img src="/icons/icon-192.png" alt="فيض" className="h-12 w-12 rounded-lg border border-primary-foreground/25 bg-background" /></div>
          <div className="max-w-2xl"><h1 className="font-display text-5xl font-bold md:text-7xl">فيض</h1><p className="mt-4 max-w-xl text-base leading-8 text-primary-foreground/80 md:text-lg">القرآن والذكر والعلم والصوتيات، في مكان واحد واضح وهادئ.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/quran-read" className="inline-flex h-11 items-center gap-2 bg-background px-5 text-sm font-bold text-primary"><BookOpen className="h-4 w-4" />ابدأ القراءة</Link><Link to="/quran-listen" className="inline-flex h-11 items-center gap-2 border border-primary-foreground/40 px-5 text-sm font-bold"><Headphones className="h-4 w-4" />استمع الآن</Link></div></div>
        </div>
        <NextPrayerWidget />
      </section>
      <section className="grid gap-px bg-border md:grid-cols-3"><FeatureLink to="/radio" title="إذاعة القرآن" subtitle="البث المباشر من القاهرة" icon={Radio} /><FeatureLink to="/adhkar" title="وردك اليومي" subtitle="الأذكار والأدعية المأثورة" icon={Sparkles} /><FeatureLink to="/lectures" title="المكتبة الصوتية" subtitle="دروس قابلة للاستماع والتحميل" icon={Headphones} /></section>
      <section className="py-10 md:py-14">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-foreground pb-4"><div className="min-w-0"><span className="text-xs text-muted-foreground">فهرس التطبيق</span><h2 className="font-display text-3xl font-bold md:text-4xl">كل الأقسام</h2></div><span className="text-xs text-muted-foreground">{navigationGroups.reduce((sum, group) => sum + group.items.length, 0)} قسمًا</span></div>
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">{navigationGroups.map((group, groupIndex) => <div key={group.label} className="animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ animationDelay: `${groupIndex * 80}ms` }}><div className="mb-3 flex items-center gap-2"><span className="font-mono text-xs text-muted-foreground">0{groupIndex + 1}</span><h3 className="font-bold">{group.label}</h3></div><div className="divide-y divide-border border-y border-border">{group.items.map((item) => <Link key={item.to} to={item.to} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3.5"><item.icon className="h-5 w-5 shrink-0" /><span className="min-w-0"><b className="block text-sm">{item.label}</b><small className="block truncate text-muted-foreground">{item.description}</small></span><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /></Link>)}</div></div>)}</div>
      </section>
      <section className="flex flex-col items-center justify-between gap-5 border-y border-border bg-muted p-6 text-center md:flex-row md:text-right"><div><h2 className="font-display text-2xl font-bold">خذ فيض معك</h2><p className="mt-1 text-sm text-muted-foreground">ثبّت التطبيق للوصول السريع من هاتفك.</p></div><InstallPWAButton /></section>
    </div>
  );
}

function FeatureLink({ to, title, subtitle, icon: Icon }: { to: "/radio" | "/adhkar" | "/lectures"; title: string; subtitle: string; icon: typeof Radio }) {
  return <Link to={to} className="group grid min-h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-card p-5 hover:bg-secondary"><span className="grid h-11 w-11 place-items-center border border-primary/30 bg-accent text-primary"><Icon className="h-5 w-5" /></span><span className="min-w-0"><b className="block">{title}</b><small className="text-muted-foreground">{subtitle}</small></span><ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" /></Link>;
}
