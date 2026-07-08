"use client";

// =============================================================
// AuthLayout — the shared split-screen frame for every auth screen
// (login, forgot-password, reset-password): a disciplined form column
// on the left and a cobalt duotone brand/hero panel on the right. Each
// view supplies its own form content as children; the frame + hero are
// defined once here so the screens stay perfectly consistent.
// =============================================================

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Logo from "../shell/Logo";
import ThemeToggle from "../ui/ThemeToggle/ThemeToggle";
import { EASE } from "./authMotion";
import "./AuthLayout.scss";

// One duotone field-sales photograph (Unsplash — free for commercial use):
// a supermarket FMCG aisle, one-point perspective. Verified to resolve.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1500&q=70";

export default function AuthLayout({ children }) {
  const reduce = useReducedMotion();

  return (
    <div className="auth">
      {/* ---- Form panel (left) ---- */}
      <div className="auth__panel">
        <header className="auth__topbar">
          <Link href="/login" className="auth__brand" aria-label="RetailConnect SIP">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>

        <div className="auth__form-wrap">{children}</div>
      </div>

      {/* ---- Brand / hero panel (right) ---- */}
      <aside className="auth__hero" aria-hidden="true">
        <div className="auth__hero-media">
          <motion.img
            src={HERO_IMAGE}
            alt=""
            className="auth__hero-img"
            initial={reduce ? false : { scale: 1.08, opacity: 0 }}
            animate={reduce ? {} : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            loading="eager"
            fetchPriority="high"
          />
          <div className="auth__hero-scrim" />
          <div className="auth__hero-grid" />
        </div>

        <motion.div
          className="auth__hero-content"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        >
          <p className="auth__hero-kicker">RetailConnect SIP</p>
          <p className="auth__hero-statement">
            Field sales and distribution, digitised from the shelf to the plant.
          </p>
          <div className="auth__hero-stats">
            <div className="auth__hero-stat">
              <span className="auth__hero-stat-num">12,000+</span>
              <span className="auth__hero-stat-label">retail outlets digitised</span>
            </div>
            <div className="auth__hero-divider" />
            <div className="auth__hero-stat">
              <span className="auth__hero-stat-num">7</span>
              <span className="auth__hero-stat-label">connected roles, one platform</span>
            </div>
          </div>
        </motion.div>
      </aside>
    </div>
  );
}
