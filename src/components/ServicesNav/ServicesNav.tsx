import React, { useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export type ServiceNavItem = {
  path: string;
  label: string;
};

type Props = {
  items: ServiceNavItem[];
  className?: string;
};

// Pager with Prev/Next links for Services & Solutions pages.
// - Uses global CSS in src/styles/services-nav.css
// - Left/Right arrow keys navigate prev/next (wraps around)
export const ServicesPager: React.FC<Props> = ({ items, className }) => {
  const location = useLocation();

  const index = Math.max(
    0,
    items.findIndex((i) => i.path === location.pathname)
  );

  const prevIndex = (index - 1 + items.length) % items.length;
  const nextIndex = (index + 1) % items.length;

  const prev = items[prevIndex];
  const next = items[nextIndex];

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // Navigate left
        const a = document.getElementById("services-pager-prev") as HTMLAnchorElement | null;
        a?.click();
      } else if (e.key === "ArrowRight") {
        const a = document.getElementById("services-pager-next") as HTMLAnchorElement | null;
        a?.click();
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <nav className={`services-pager ${className ?? ""}`.trim()} aria-label="Services navigation">
      <Link
        id="services-pager-prev"
        to={prev.path}
        className="services-btn services-btn--prev"
        aria-label={`Previous: ${prev.label}`}
      >
        {`< ${prev.label}`}
      </Link>
      <Link
        id="services-pager-next"
        to={next.path}
        className="services-btn services-btn--next"
        aria-label={`Next: ${next.label}`}
      >
        {`${next.label} >`}
      </Link>
    </nav>
  );
};

export default ServicesPager;
