import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

type PlerdyWindow = Window & {
  sendDataForInitPlerdy?: () => void;
  init_click_count_plerdy?: () => void;
  plerdy_do_now?: () => void;
};

/**
 * Повідомляє Plerdy про зміну маршруту у SPA,
 * щоб кожен віртуальний перехід рахувався як окремий перегляд сторінки.
 */
export function PlerdySpaTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as PlerdyWindow;

    const timer = window.setTimeout(() => {
      try {
        w.sendDataForInitPlerdy?.();
        w.init_click_count_plerdy?.();
        w.plerdy_do_now?.();
      } catch {
        /* трекер не має ламати сторінку */
      }
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
