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

const features = [
  { to: "/quran-read", title: "قراءة القرآن", desc: "اقرأ القرآن الكريم برسم المصحف", Icon: BookOpen },
  { to: "/quran-listen", title: "استماع القرآن", desc: "استمع لكبار المشايخ آية بآية أو سورة كاملة", Icon: Headphones },
  { to: "/tafsir", title: "تفسير القرآن", desc: "تفسير القرآن الكريم بعدة تفاسير موثوقة", Icon: BookMarked },
  { to: "/radio", title: "إذاعة القرآن مباشر", desc: "بث مباشر من إذاعة القرآن الكريم من القاهرة", Icon: Radio },
  { to: "/adhkar", title: "الأذكار", desc: "أذكار الصباح والمساء وبعد الصلاة والنوم", Icon: Sparkles },
  { to: "/duas", title: "الأدعية", desc: "مجموعة واسعة من الأدعية المأثورة", Icon: Quote },
  { to: "/hadith", title: "الأحاديث", desc: "أحاديث نبوية من صحيح البخاري ومسلم", Icon: ScrollText },
  { to: "/lectures", title: "دروس ومحاضرات", desc: "محاضرات صوتية لكبار العلماء بمراجع موثقة", Icon: Headphones },
  { to: "/tajweed", title: "تعلّم التجويد", desc: "أحكام التجويد مع تدريبات صوتية عملية", Icon: BookMarked },
  { to: "/fatwa", title: "الفتاوى وسؤال وجواب", desc: "فتاوى صوتية ومكتوبة لكبار أهل العلم", Icon: Quote },
  { to: "/books", title: "مكتبة الكتب", desc: "كتب إسلامية في التفسير والحديث والفقه", Icon: BookOpen },
  { to: "/stories", title: "قصص الأنبياء", desc: "قصص الأنبياء عليهم السلام", Icon: Users },
  { to: "/seerah", title: "السيرة النبوية", desc: "أحداث ومحطات من سيرة النبي ﷺ", Icon: Milestone },
  { to: "/asma", title: "أسماء الله الحسنى", desc: "الأسماء التسعة والتسعون مع معانيها", Icon: Star },
  { to: "/ruqyah", title: "الرقية الشرعية", desc: "من القرآن والسنة للحفظ والشفاء", Icon: Shield },
  { to: "/tasbih", title: "السبحة الإلكترونية", desc: "عدّاد ذكر إلكتروني بسيط", Icon: CircleDot },
  { to: "/prayer-times", title: "مواقيت الصلاة", desc: "مواقيت الصلاة حسب موقعك", Icon: Clock },
  { to: "/calendar", title: "التقويم الهجري", desc: "التاريخ الهجري والميلادي", Icon: CalendarDays },
  { to: "/zakat", title: "حاسبة الزكاة", desc: "احسب زكاة مالك وذهبك وتجارتك", Icon: HandCoins },
  { to: "/faraidh", title: "الفرائض والمواريث", desc: "الميراث الشرعي وجدول الفروض", Icon: Scale },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-6 md:pt-10">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)] lg:items-stretch">
        <div className="flex min-h-[300px] flex-col justify-between bg-foreground p-6 text-background md:min-h-[390px] md:p-10">
          <div className="flex items-center justify-between"><span className="text-xs font-bold">رفيقك اليومي</span><img src="/icons/icon-192.png" alt="فيض" className="h-12 w-12 rounded-lg border border-background/20" /></div>
          <div className="max-w-2xl"><h1 className="font-display text-5xl font-bold md:text-7xl">فيض</h1><p className="mt-4 max-w-xl text-base leading-8 text-background/70 md:text-lg">القرآن والذكر والعلم والصوتيات، في مكان واحد واضح وهادئ.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/quran-read" className="inline-flex h-11 items-center gap-2 bg-background px-5 text-sm font-bold text-foreground"><BookOpen className="h-4 w-4" />ابدأ القراءة</Link><Link to="/quran-listen" className="inline-flex h-11 items-center gap-2 border border-background/30 px-5 text-sm font-bold"><Headphones className="h-4 w-4" />استمع الآن</Link></div></div>
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
  return <Link to={to} className="group grid min-h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-background p-5 hover:bg-muted"><span className="grid h-11 w-11 place-items-center border border-border"><Icon className="h-5 w-5" /></span><span className="min-w-0"><b className="block">{title}</b><small className="text-muted-foreground">{subtitle}</small></span><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /></Link>;
}
