"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import AuthLayout from "./AuthLayout";
import { stagger, item } from "./authMotion";

const EASE = [0.16, 1, 0.3, 1];

function InvalidLink() {
  const reduce = useReducedMotion();
  return (
    <AuthLayout>
      <motion.div
        className="auth__notice"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <span className="auth__notice-icon auth__notice-icon--danger" aria-hidden="true">
          <FiAlertTriangle />
        </span>
        <h1 className="auth__notice-title">This link is invalid or expired</h1>
        <p className="auth__notice-text">
          Password reset links expire after <b>60 minutes</b> and can be used
          once. Request a new link and we'll email you a fresh one.
        </p>
        <div className="auth__notice-actions">
          <Link href="/forgot-password">
            <Button variant="primary" size="lg" fullWidth trailingIcon={<FiArrowRight />}>
              Request a new link
            </Button>
          </Link>
          <Link href="/login" className="auth__link" style={{ textAlign: "center" }}>
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

export default function ResetPasswordView({ token, tokenValid }) {
  const reduce = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  // idle | loading | success | invalid
  const [status, setStatus] = useState(tokenValid ? "idle" : "invalid");
  const [error, setError] = useState("");

  const loading = status === "loading";

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.error === "invalid_token") {
        setStatus("invalid");
        return;
      }
      setError(data.message || "Couldn't reset your password. Please try again.");
      setStatus("idle");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "invalid") return <InvalidLink />;

  if (status === "success") {
    return (
      <AuthLayout>
        <motion.div
          className="auth__notice"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className="auth__notice-icon auth__notice-icon--success" aria-hidden="true">
            <FiCheckCircle />
          </span>
          <h1 className="auth__notice-title">Password updated</h1>
          <p className="auth__notice-text">
            Your password has been changed. You can now sign in with your new
            password.
          </p>
          <div className="auth__notice-actions">
            <Link href="/login">
              <Button variant="primary" size="lg" fullWidth trailingIcon={<FiArrowRight />}>
                Continue to sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        className="auth__stack"
        variants={stagger(reduce)}
        initial="hidden"
        animate="show"
      >
        <motion.div className="auth__intro" variants={item(reduce)}>
          <span className="auth__eyebrow">Reset access</span>
          <h1 className="auth__title">Set a new password</h1>
          <p className="auth__subtitle">
            Choose a strong password you don't use anywhere else.
          </p>
        </motion.div>

        <motion.form
          className="auth__form"
          onSubmit={onSubmit}
          variants={item(reduce)}
          noValidate
        >
          <Input
            label="New password"
            type={showPw ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leading={<FiLock />}
            required
            disabled={loading}
            autoFocus
            hint="Use at least 8 characters."
            trailing={
              <button
                type="button"
                className="auth__pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <Input
            label="Confirm new password"
            type={showPw ? "text" : "password"}
            name="confirm"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            leading={<FiLock />}
            required
            disabled={loading}
          />

          {error && (
            <div className="auth__error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            trailingIcon={<FiArrowRight />}
          >
            Reset password
          </Button>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}
