"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiMail,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiSend,
} from "react-icons/fi";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import AuthLayout from "./AuthLayout";
import { stagger, item } from "./authMotion";

export default function ForgotPasswordView() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent
  const [error, setError] = useState("");

  const loading = status === "loading";
  const sent = status === "sent";

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      // Endpoint is intentionally non-enumerating: treat any 2xx as "sent".
      if (!res.ok) throw new Error("request_failed");
      setStatus("sent");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <motion.div
          className="auth__notice"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="auth__notice-icon auth__notice-icon--info" aria-hidden="true">
            <FiMail />
          </span>
          <h1 className="auth__notice-title">Check your inbox</h1>
          <p className="auth__notice-text">
            If an account exists for <b>{email}</b>, we've sent a link to reset
            your password. It expires in <b>60 minutes</b>.
          </p>
          <div className="auth__notice-actions">
            <Link href="/login">
              <Button variant="primary" size="lg" fullWidth trailingIcon={<FiArrowRight />}>
                Back to sign in
              </Button>
            </Link>
            <button
              type="button"
              className="auth__link"
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
            >
              Use a different email
            </button>
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
          <h1 className="auth__title">Forgot your password?</h1>
          <p className="auth__subtitle">
            Enter your work email and we'll send you a link to set a new
            password.
          </p>
        </motion.div>

        <motion.form
          className="auth__form"
          onSubmit={onSubmit}
          variants={item(reduce)}
          noValidate
        >
          <Input
            label="Work email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leading={<FiMail />}
            required
            disabled={loading}
            autoFocus
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
            trailingIcon={<FiSend />}
          >
            Send reset link
          </Button>

          <Link href="/login" className="auth__link" style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                justifyContent: "center",
              }}
            >
              <FiArrowLeft aria-hidden="true" /> Back to sign in
            </span>
          </Link>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}
