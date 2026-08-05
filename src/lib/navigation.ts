import {
  BookMarked,
  BookOpen,
  CalendarDays,
  CircleDot,
  Clock,
  HandCoins,
  Headphones,
  Milestone,
  Quote,
  Radio,
  Scale,
  ScrollText,
  Shield,
  Star,
  Users,
} from "lucide-react";

export const navigationGroups = [
  {
    label: "القرآن والصوتيات",
    items: [
      { to: "/quran-read", label: "قراءة القرآن", description: "المصحف كاملًا", icon: BookOpen },
      { to: "/quran-listen", label: "استماع القرآن", description: "قراء وتلاوات", icon: Headphones },
      { to: "/tafsir", label: "التفسير", description: "تفاسير الآيات", icon: BookMarked },
      { to: "/radio", label: "إذاعة القرآن", description: "بث القاهرة المباشر", icon: Radio },
      { to: "/tajweed", label: "تعلم التجويد", description: "أحكام وتدريبات", icon: Milestone },
    ],
  },
  {
    label: "الذكر والسنة",
    items: [
      { to: "/adhkar", label: "الأذكار", description: "حصن المسلم", icon: Shield },
      { to: "/duas", label: "الأدعية", description: "أدعية مأثورة", icon: Quote },
      { to: "/hadith", label: "الأحاديث", description: "كتب السنة", icon: ScrollText },
      { to: "/ruqyah", label: "الرقية الشرعية", description: "نص وصوت", icon: Shield },
      { to: "/tasbih", label: "السبحة", description: "عداد الأذكار", icon: CircleDot },
    ],
  },
  {
    label: "العلم والمكتبة",
    items: [
      { to: "/lectures", label: "الدروس والمحاضرات", description: "استماع وتحميل", icon: Headphones },
      { to: "/books", label: "مكتبة الكتب", description: "قراءة وتحميل", icon: BookOpen },
      { to: "/fatwa", label: "الفتاوى", description: "سؤال وجواب", icon: Quote },
      { to: "/stories", label: "قصص الأنبياء", description: "قصص كاملة", icon: Users },
      { to: "/seerah", label: "السيرة النبوية", description: "محطات السيرة", icon: Milestone },
      { to: "/asma", label: "أسماء الله الحسنى", description: "الأسماء والمعاني", icon: Star },
    ],
  },
  {
    label: "العبادات والأدوات",
    items: [
      { to: "/prayer-times", label: "مواقيت الصلاة", description: "حسب موقعك", icon: Clock },
      { to: "/calendar", label: "التقويم الهجري", description: "هجري وميلادي", icon: CalendarDays },
      { to: "/zakat", label: "حاسبة الزكاة", description: "زكاة المال", icon: HandCoins },
      { to: "/faraidh", label: "الفرائض والمواريث", description: "حساب الأنصبة", icon: Scale },
    ],
  },
] as const;

export const navigationItems = navigationGroups.reduce<
  Array<(typeof navigationGroups)[number]["items"][number]>
>((items, group) => {
  items.push(...group.items);
  return items;
}, []);