import { useEffect, useState } from "react";
import { Download, Check, Share } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPWAButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    if (isIOS) setShowIOS(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4" /> التطبيق مثبت
      </div>
    );
  }

  const canInstall = !!deferred;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferred(null);
    } else if (showIOS) {
      setIosHint((v) => !v);
    }
  };

  if (!canInstall && !showIOS) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        className="group relative inline-flex items-center gap-3 rounded-full bg-foreground text-background px-6 py-3.5 font-bold shadow-lg md:hover:scale-105 active:scale-95 transition overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-background/15">
          {showIOS && !canInstall ? <Share className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </span>
        <span className="relative flex flex-col items-start leading-tight">
          <span className="text-[10px] font-normal opacity-70">ثبت التطبيق على جهازك</span>
          <span className="text-sm">تحميل فيض</span>
        </span>
      </button>
      {iosHint && showIOS && !canInstall && (
        <div className="text-xs text-muted-foreground text-center max-w-xs bg-card border border-border rounded-xl p-3">
          لتثبيت فيض على iPhone: اضغط على زر المشاركة <Share className="inline h-3.5 w-3.5 mx-1" /> ثم اختر "إضافة إلى الشاشة الرئيسية".
        </div>
      )}
    </div>
  );
}