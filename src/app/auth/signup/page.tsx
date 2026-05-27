"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/auth/signin",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          // Better Auth usually handles the redirect via callbackURL,
          // but you can add manual router.push here if needed.
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
              Create your AI workspace
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered focus:input-primary w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
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
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered focus:input-primary w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/50">
                  Minimum 8 characters
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
                {loading ? "Creating Account..." : "Join NeuroDesk"}
              </button>
            </div>
          </form>

          <div className="divider text-xs text-base-content/40 uppercase">
            Or sign up with
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline flex-1 gap-2">Google</button>
            <button className="btn btn-outline flex-1 gap-2">GitHub</button>
          </div>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="link link-primary font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
