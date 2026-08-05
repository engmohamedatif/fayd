import { Facebook, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Heart className="h-5 w-5 fill-foreground" />
          <span>صدقة جارية</span>
          <Heart className="h-5 w-5 fill-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ"
        </p>
        <div className="pt-4 border-t border-border w-full max-w-xs flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">تم التطوير بواسطة محمد عاطف</p>
          <a
            href="https://www.facebook.com/Mohamed.Atef.Dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition"
          >
            <Facebook className="h-4 w-4" />
            زر صفحتي على فيسبوك
          </a>
        </div>
      </div>
    </footer>
  );
}