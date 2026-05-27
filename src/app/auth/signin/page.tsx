"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          setLoading(false);
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-primary italic">
              NeuroDesk
            </h1>
            <p className="text-base-content/60 text-sm">
              Welcome back to your workspace
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input input-bordered focus:input-primary w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-control">
              <div className="flex justify-between items-center">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="label-text-alt link link-hover text-base-content/60"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered focus:input-primary w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="label-text text-base-content/70">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="divider text-xs text-base-content/40 uppercase">
            Or continue with
          </div>

          {/* Social Auth Buttons */}
          <div className="flex gap-2">
            <button className="btn btn-outline flex-1 gap-2">Google</button>
            <button className="btn btn-outline flex-1 gap-2">GitHub</button>
          </div>

          <p className="text-center mt-6 text-sm">
            New to NeuroDesk?{" "}
            <Link
              href="/auth/signup"
              className="link link-primary font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
