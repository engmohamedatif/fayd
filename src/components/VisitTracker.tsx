import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function VisitTracker() {
  const router = useRouter();
  useEffect(() => {
    const track = (path: string) => {
      if (path.startsWith("/admin")) return;
      supabase.from("visits").insert({ path }).then(() => {}, () => {});
    };
    track(window.location.pathname);
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      track(toLocation.pathname);
    });
    return () => { unsub(); };
  }, [router]);
  return null;
}