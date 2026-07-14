import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/quran-read", label: "قراءة القرآن" },
  { to: "/quran-listen", label: "استماع القرآن" },
  { to: "/tafsir", label: "التفسير" },
  { to: "/radio", label: "إذاعة القرآن" },
  { to: "/adhkar", label: "الأذكار" },
  { to: "/duas", label: "الأدعية" },
  { to: "/hadith", label: "الأحاديث" },
  { to: "/stories", label: "قصص الأنبياء" },
  { to: "/tasbih", label: "السبحة" },
  { to: "/prayer-times", label: "مواقيت الصلاة" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/icon-192.png" alt="فيض" className="h-9 w-9 rounded-lg" />
          <span className="text-xl font-extrabold tracking-tight">فيض</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition"
              activeProps={{ className: "px-3 py-2 rounded-md bg-foreground text-background" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="lg:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-2 grid grid-cols-2 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm hover:bg-muted"
                activeProps={{ className: "px-3 py-2 rounded-md text-sm bg-foreground text-background" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}