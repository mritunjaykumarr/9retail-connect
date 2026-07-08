"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import AuthLayout from "./AuthLayout";
import { stagger, item } from "./authMotion";

export default function LoginView({ callbackUrl = "/dashboard" }) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [error, setError] = useState("");

  const loading = status === "loading";
  const success = status === "success";

  async function onSubmit(e) {
    e.preventDefault();
    if (loading || success) return;
    setError("");
    setStatus("loading");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Invalid email or password. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 550);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
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
          <span className="auth__eyebrow">Welcome back</span>
          <h1 className="auth__title">Sign in to your workspace</h1>
          <p className="auth__subtitle">
            Manage beats, schemes, distributors and demand — all from one place.
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
            disabled={loading || success}
            autoFocus
          />

          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leading={<FiLock />}
            required
            disabled={loading || success}
            trailing={
              <button
                type="button"
                className="auth__pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            }
          />

          <div className="auth__row">
            <Link href="/forgot-password" className="auth__link">
              Forgot password?
            </Link>
          </div>

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
            disabled={success}
            trailingIcon={success ? <FiCheck /> : <FiArrowRight />}
          >
            {success ? "Signed in" : "Sign in"}
          </Button>
        </motion.form>

        <motion.p className="auth__legal" variants={item(reduce)}>
          Protected access. By signing in you agree to RetailConnect's Terms and
          acknowledge the Privacy Policy.
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
