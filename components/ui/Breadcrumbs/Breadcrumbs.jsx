import React from "react";
import { FiChevronRight } from "react-icons/fi";
import "./Breadcrumbs.scss";

/**
 * Breadcrumbs — path trail.
 *  items: [{ label, href, icon }] — last item is treated as current page.
 */
export default function Breadcrumbs({
  items = [],
  separator,
  className = "",
  ...rest
}) {
  return (
    <nav
      className={`rc-crumbs ${className}`.trim()}
      aria-label="Breadcrumb"
      {...rest}
    >
      <ol className="rc-crumbs__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li className="rc-crumbs__item" key={i}>
              {isLast ? (
                <span className="rc-crumbs__current" aria-current="page">
                  {item.icon && (
                    <span className="rc-crumbs__icon">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              ) : (
                <>
                  <a className="rc-crumbs__link" href={item.href || "#"}>
                    {item.icon && (
                      <span className="rc-crumbs__icon">{item.icon}</span>
                    )}
                    {item.label}
                  </a>
                  <span className="rc-crumbs__sep" aria-hidden="true">
                    {separator || <FiChevronRight />}
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
