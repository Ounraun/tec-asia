import { useEffect, useLayoutEffect } from "react";
import { useLocation, type Location } from "react-router-dom";

/**
 * Scrolls window to top on route changes.
 * - If a hash is present (e.g., #contact-section), we let the browser/logic handle it.
 */
export default function ScrollToTop() {
  const location = useLocation() as Partial<Location>;
  const pathname = location.pathname ?? window.location.pathname;
  const hash = location.hash ?? window.location.hash;
  const search = location.search ?? window.location.search;
  const key = (location as Location).key ?? "";

  // First, try to reset before paint to avoid any flicker
  useLayoutEffect(() => {
    if (hash) return; // allow in-page anchor scrolls
    const scrollTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        // ignore
      }
      // also reset common scroll containers just in case
      const scrollingEl = document.scrollingElement as HTMLElement | null;
      if (scrollingEl) scrollingEl.scrollTop = 0;
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl) docEl.scrollTop = 0;
      if (body) body.scrollTop = 0;
      const mainEl = document.querySelector("main");
      if (mainEl && (mainEl as HTMLElement).scrollTop !== undefined) {
        (mainEl as HTMLElement).scrollTop = 0;
      }
    };
    scrollTop();
  }, [pathname, search, key, hash]);

  // Then, run again after paint to beat late layout shifts (images, fonts, etc.)
  useEffect(() => {
    if (hash) return; // allow in-page anchor scrolls
    const raf = requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        // ignore
      }
      const scrollingEl = document.scrollingElement as HTMLElement | null;
      if (scrollingEl) scrollingEl.scrollTop = 0;
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl) docEl.scrollTop = 0;
      if (body) body.scrollTop = 0;
      const mainEl = document.querySelector("main");
      if (mainEl && (mainEl as HTMLElement).scrollTop !== undefined) {
        (mainEl as HTMLElement).scrollTop = 0;
      }
    });
    const timeout = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        // ignore
      }
      const scrollingEl = document.scrollingElement as HTMLElement | null;
      if (scrollingEl) scrollingEl.scrollTop = 0;
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl) docEl.scrollTop = 0;
      if (body) body.scrollTop = 0;
      const mainEl = document.querySelector("main");
      if (mainEl && (mainEl as HTMLElement).scrollTop !== undefined) {
        (mainEl as HTMLElement).scrollTop = 0;
      }
    }, 50);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [pathname, search, key, hash]);

  return null;
}
