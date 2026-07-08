"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { crumbsForPath } from "../../lib/navigation";
// Reuse the design-system breadcrumb styles.
import "../ui/Breadcrumbs/Breadcrumbs.scss";

/**
 * AppBreadcrumbs — derives the trail from the current pathname + nav
 * config, and navigates client-side (next/link) so page transitions play.
 */
export default function AppBreadcrumbs() {
  const pathname = usePathname();
  const items = crumbsForPath(pathname);
  if (items.length <= 1 && pathname === "/dashboard") {
    // Home only — still render the single crumb for a stable header height.
  }

  return (
    <nav className="rc-crumbs" aria-label="Breadcrumb">
      <ol className="rc-crumbs__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isHome = i === 0;
          return (
            <li className="rc-crumbs__item" key={item.href + i}>
              {isLast ? (
                <span className="rc-crumbs__current" aria-current="page">
                  {isHome && (
                    <span className="rc-crumbs__icon">
                      <FiHome />
                    </span>
                  )}
                  {item.label}
                </span>
              ) : (
                <>
                  <Link className="rc-crumbs__link" href={item.href}>
                    {isHome && (
                      <span className="rc-crumbs__icon">
                        <FiHome />
                      </span>
                    )}
                    {item.label}
                  </Link>
                  <span className="rc-crumbs__sep" aria-hidden="true">
                    <FiChevronRight />
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
