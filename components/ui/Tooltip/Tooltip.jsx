"use client";

import React, { useId, useState } from "react";
import "./Tooltip.scss";

/**
 * Tooltip — hover/focus label. CSS-positioned relative to the trigger.
 *  side: "top" | "bottom" | "left" | "right"
 *  delay: ms before show
 */
export default function Tooltip({
  content,
  side = "top",
  delay = 120,
  className = "",
  children,
}) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const timer = React.useRef(null);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className={`rc-tooltip ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {React.cloneElement(React.Children.only(children), {
        "aria-describedby": open ? tipId : undefined,
      })}
      <span
        id={tipId}
        role="tooltip"
        className={`rc-tooltip__bubble rc-tooltip__bubble--${side} ${
          open ? "is-open" : ""
        }`}
      >
        {content}
        <span className="rc-tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  );
}
