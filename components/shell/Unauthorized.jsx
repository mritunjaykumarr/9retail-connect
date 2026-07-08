"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import { useSession } from "./SessionProvider";
import { roleHome, roleLabel } from "../../lib/roles";
import Button from "../ui/Button/Button";
import "./Unauthorized.scss";

/**
 * Unauthorized — the polished no-permission (403) screen. Rendered by the
 * /unauthorized route (where the server-side page guard redirects forbidden
 * users) and by the client shell guard. The real enforcement is server-side;
 * this is the human-facing explanation.
 */
export default function Unauthorized() {
  const { role } = useSession();
  const reduce = useReducedMotion();
  const home = roleHome(role);

  return (
    <div className="rc-403">
      <motion.div
        className="rc-403__card"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="rc-403__glyph" aria-hidden="true">
          <FiLock />
        </span>
        <span className="rc-403__code">Error 403 · Access denied</span>
        <h1 className="rc-403__title">You don't have access to this page</h1>
        <p className="rc-403__text">
          Your <b>{roleLabel(role)}</b> role isn't permitted here. Access is
          enforced on the server, so this page and its data stay protected.
        </p>
        <div className="rc-403__actions">
          <Link href={home}>
            <Button variant="primary" size="lg" leadingIcon={<FiArrowLeft />}>
              Back to my dashboard
            </Button>
          </Link>
        </div>
        <p className="rc-403__help">
          Need access? Contact your system administrator.
        </p>
      </motion.div>
    </div>
  );
}
