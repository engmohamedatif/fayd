import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Grid3X3, Home, Menu, Radio, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigationGroups, navigationItems } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  const results = query.trim() ? navigationItems.filter((item) => `${item.label} ${item.description}`.includes(query.trim())) : navigationItems;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 md:h-20 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="فيض — الرئيسية">
              <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-lg border border-primary/30 bg-secondary md:h-11 md:w-11" />
              <div className="hidden sm:block"><div className="font-display text-xl font-bold leading-none text-primary">فيض</div><div className="mt-1 text-[10px] text-muted-foreground">رفيقك إلى الخير</div></div>
            </Link>
            <div className="mr-3 hidden h-8 w-px bg-border lg:block" />
            <nav className="hidden min-w-0 items-center gap-1 lg:flex">
              <Link to="/quran-read" className="nav-link">القرآن</Link><Link to="/radio" className="nav-link">الإذاعة</Link><Link to="/adhkar" className="nav-link">الأذكار</Link><Link to="/lectures" className="nav-link">الصوتيات</Link><Link to="/books" className="nav-link">المكتبة</Link>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="البحث في الأقسام"><Search /></Button>
            <Button variant="outline" className="hidden md:inline-flex" onClick={() => setOpen(true)}><Grid3X3 /> كل الأقسام</Button>
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="فتح الأقسام"><Menu /></Button>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <section className="absolute inset-x-0 top-0 max-h-[92dvh] overflow-y-auto border-b border-border bg-background shadow-2xl animate-in slide-in-from-top-4 duration-300" onClick={(event) => event.stopPropagation()} aria-label="كل أقسام فيض">
            <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-5"><div className="min-w-0"><h2 className="font-display text-2xl font-bold">فهرس فيض</h2><p className="mt-1 text-sm text-muted-foreground">كل ما تحتاجه، مصنّف وواضح.</p></div><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="إغلاق"><X /></Button></div>
              <div className="grid gap-8 py-7 md:grid-cols-2 xl:grid-cols-4">
                {navigationGroups.map((group) => <div key={group.label}><h3 className="mb-3 border-b border-foreground pb-2 text-xs font-bold">{group.label}</h3><div className="divide-y divide-border">{group.items.map((item) => <Link key={item.to} to={item.to} className="group flex items-center gap-3 py-3"><item.icon className="h-5 w-5 shrink-0" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.label}</span><span className="block truncate text-[11px] text-muted-foreground">{item.description}</span></span><span className="transition-transform group-hover:-translate-x-1">←</span></Link>)}</div></div>)}
              </div>
            </div>
          </section>
        </div>
      )}
      {searchOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/35 px-4 pt-[10dvh] backdrop-blur-sm" onClick={() => setSearchOpen(false)}><section className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-background shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border"><div className="relative min-w-0"><Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن قرآن، أذكار، كتاب..." className="h-16 w-full bg-transparent pr-12 pl-4 outline-none" /></div><Button variant="ghost" size="icon" className="ml-3" onClick={() => setSearchOpen(false)} aria-label="إغلاق"><X /></Button></div><div className="max-h-[55dvh] divide-y divide-border overflow-y-auto p-2">{results.map((item) => <Link key={item.to} to={item.to} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 hover:bg-muted"><item.icon className="h-5 w-5" /><span className="flex-1"><b className="block text-sm">{item.label}</b><small className="text-muted-foreground">{item.description}</small></span></Link>)}</div></section></div>}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-primary/20 bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"><MobileLink to="/" label="الرئيسية" icon={Home} active={pathname === "/"} /><MobileLink to="/quran-read" label="القرآن" icon={BookOpen} active={pathname.startsWith("/quran")} /><MobileLink to="/radio" label="الإذاعة" icon={Radio} active={pathname === "/radio"} /><button onClick={() => setOpen(true)} className="flex h-16 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground"><Grid3X3 className="h-5 w-5" />الأقسام</button></nav>
    </>
  );
}

function MobileLink({ to, label, icon: Icon, active }: { to: "/" | "/quran-read" | "/radio"; label: string; icon: typeof Home; active: boolean }) {
  return <Link to={to} className={`flex h-16 flex-col items-center justify-center gap-1 text-[10px] ${active ? "font-bold text-primary" : "text-muted-foreground"}`}><Icon className="h-5 w-5" />{label}</Link>;
}