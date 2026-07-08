"use client";

// =============================================================
// ModulePlaceholder — the shared body for not-yet-built routes.
// Every module route re-exports this as its page default; it derives
// its title/description/icon from the nav config via the pathname, so
// each route file stays a one-line re-export and the screen still looks
// finished (header + "in build" empty state), never a blank page.
// =============================================================

import React from "react";
import { usePathname } from "next/navigation";
import { FiTool } from "react-icons/fi";
import { routeMeta } from "../../lib/navigation";
import EmptyState from "../ui/EmptyState/EmptyState";
import Badge from "../ui/Badge/Badge";
import "./ModulePlaceholder.scss";

export default function ModulePlaceholder() {
  const pathname = usePathname();
  const meta = routeMeta(pathname);
  const Icon = meta.icon;

  return (
    <section className="rc-placeholder" aria-labelledby="rc-placeholder-title">
      <header className="rc-placeholder__head">
        <div className="rc-placeholder__heading">
          {Icon && (
            <span className="rc-placeholder__icon" aria-hidden="true">
              <Icon />
            </span>
          )}
          <div>
            <div className="rc-placeholder__eyebrow">
              {meta.group && <span>{meta.group}</span>}
              <Badge tone="primary" variant="soft" size="sm">
                In build
              </Badge>
            </div>
            <h1 className="rc-placeholder__title" id="rc-placeholder-title">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="rc-placeholder__desc">{meta.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="rc-placeholder__body">
        <EmptyState
          icon={<FiTool />}
          title="This screen is coming soon"
          description="The app shell and navigation are live. We'll build this module's features and wire it to real data next."
        />
      </div>
    </section>
  );
}
