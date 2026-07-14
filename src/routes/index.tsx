import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { BookOpen, Radio, Sparkles, ScrollText, Quote, Users, CircleDot, Clock, Headphones, BookMarked } from "lucide-react";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";

export const Route = createFileRoute("/")({
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
  { to: "/stories", title: "قصص الأنبياء", desc: "قصص الأنبياء عليهم السلام", Icon: Users },
  { to: "/tasbih", title: "السبحة الإلكترونية", desc: "عدّاد ذكر إلكتروني بسيط", Icon: CircleDot },
  { to: "/prayer-times", title: "مواقيت الصلاة", desc: "مواقيت الصلاة حسب موقعك", Icon: Clock },
] as const;

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 space-y-10">
      <section className="text-center space-y-3">
        <img src="/icons/icon-192.png" alt="فيض" className="h-20 w-20 mx-auto rounded-2xl" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">فيض</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          تطبيق إسلامي شامل يجمع بين يديك القرآن الكريم، الأذكار، الأدعية، الأحاديث، وقصص الأنبياء ومواقيت الصلاة.
        </p>
      </section>

      <NextPrayerWidget />

      <section>
        <h2 className="text-xl font-bold mb-4">الأقسام</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {features.map(({ to, title, desc, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 md:hover:bg-foreground md:hover:text-background transition"
            >
              <Icon className="h-7 w-7 mb-3" />
              <div className="font-bold">{title}</div>
              <div className="text-xs mt-1 text-muted-foreground md:group-hover:text-background/80">{desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
