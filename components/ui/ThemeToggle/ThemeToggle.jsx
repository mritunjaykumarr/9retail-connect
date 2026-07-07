"use client";

import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.scss";

/**
 * ThemeToggle — flips and persists the light/dark theme by setting
 * data-theme on <html>. Pairs with the no-FOUC script in layout.js.
 */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rc-theme", next);
    } catch (e) {
      /* storage unavailable — ignore */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`rc-theme-toggle ${className}`.trim()}
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className="rc-theme-toggle__track">
        <span className="rc-theme-toggle__thumb">
          {mounted && (isDark ? <FiMoon /> : <FiSun />)}
        </span>
      </span>
    </button>
  );
}
