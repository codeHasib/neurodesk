"use client";

import React, { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import {
  RiSparklingLine,
  RiLayoutGridLine,
  RiTaskLine,
  RiTerminalBoxLine,
  RiArrowRightLine,
  RiCheckLine,
  RiGithubFill,
} from "react-icons/ri";
import { authClient, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LandingPage() {
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();
  const { data, isPending } = useSession();

  if (!isPending) {
    if (data) {
      redirect("/dashboard");
    }
  } else {
    // Show loading state or skeleton
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </>
    );
  }

  // Quick portfolio trick: Log them into a guest state or push straight to dashboard
  const handleGuestLogin = async () => {
    await authClient.signIn.email(
      {
        email: "demo@neurodesk.com", // Your seeded demo profile
        password: "SuperStaticDemoPassword123!",
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => setDemoLoading(true),
        onSuccess: () => setDemoLoading(false),
        onError: (ctx) => {
          setDemoLoading(false);
          // Fallback bypass if you just want to let them see the UI templates
          router.push("/dashboard");
          console.log("what");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content antialiased selection:bg-primary selection:text-primary-content">
      {/* ==========================================
          1. PUBLIC MARKETING NAVBAR
         ========================================== */}
      <header className="border-b border-base-300 bg-base-100/80 backdrop-blur-md sticky top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <RiSparklingLine size={20} />
            </div>
            <span className="text-xl font-bold italic tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NeuroDesk
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-base-content/70">
            <a
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="hover:text-primary transition-colors"
            >
              Tech Stack
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle></ThemeToggle>
            <Link
              href="/auth/signin"
              className="btn btn-ghost btn-sm font-semibold md:flex hidden"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="btn btn-primary btn-sm font-semibold rounded-lg shadow-md shadow-primary/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ==========================================
          2. HERO SECTION (With Decorative Glows)
         ========================================== */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Decorative Blur Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-base-200 border border-base-300 px-3 py-1 rounded-full text-xs font-medium text-base-content/80 mb-6 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Workspace Built for Fast Execution
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[1.15]">
            The Central Nervous System <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
              For Your Daily Productivity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-base-content/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            NeuroDesk fuses high-performance task management with localized AI
            context. Organize deep-work projects, generate instant timelines,
            and chat with your workspace layout.
          </p>

          {/* Call To Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/auth/signup"
              className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto px-8 font-bold gap-2 group shadow-xl shadow-primary/10"
            >
              Create Free Workspace
              <RiArrowRightLine
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <button
              onClick={handleGuestLogin}
              className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto px-8 font-bold border-base-300 hover:bg-base-200"
            >
              {demoLoading ? "Connecting" : "Explore Live Demo"}
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURE GRID SECTION
         ========================================== */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-base-300 scroll-smooth"
      >
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Engineered for absolute control
          </h2>
          <p className="text-base-content/60">
            Every layer is structured to support heavy project context smoothly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl hover:border-primary/40 transition-colors">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6">
              <RiSparklingLine size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">AI Task Summarization</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Synthesize lengthy meeting notes, comment histories, and dynamic
              requirements fields into a single, clean status card.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl hover:border-primary/40 transition-colors">
            <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl mb-6">
              <RiLayoutGridLine size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Drag-and-Drop Kanban</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Fluid column-management interfaces optimized for ultra-smooth
              layout scaling across custom status channels.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl hover:border-primary/40 transition-colors">
            <div className="p-3 bg-accent/10 text-accent w-fit rounded-xl mb-6">
              <RiTaskLine size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Realtime Sync Systems</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Zero manual refreshing needed. State operations update immediately
              to keep multiple viewports cleanly aligned.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. RECRUITER METRICS / ARCHITECTURE SECTION
         ========================================== */}
      <section
        id="architecture"
        className="bg-base-200 py-16 border-y border-base-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-3">
              <RiTerminalBoxLine /> Production Ready Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
              Built to demonstrate scalable product practices.
            </h2>
            <p className="text-base-content/60 mb-6 leading-relaxed">
              This project serves as a showcase of a robust modern stack capable
              of secure transactional data mapping and complex UI handling.
            </p>

            <ul className="space-y-3 font-medium text-sm text-base-content/80">
              <li className="flex items-center gap-3">
                <RiCheckLine className="text-success" size={18} /> Next.js
                Server Components with TypeScript
              </li>
              <li className="flex items-center gap-3">
                <RiCheckLine className="text-success" size={18} /> State
                optimization via lightweight Zustand hooks
              </li>
              <li className="flex items-center gap-3">
                <RiCheckLine className="text-success" size={18} /> Production
                security utilizing Better Auth
              </li>
            </ul>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm font-mono text-xs text-base-content/70 space-y-2 relative overflow-hidden">
            <div className="absolute top-3 right-3 flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-error/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-warning/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-success/30"></div>
            </div>
            <p className="text-primary font-semibold">
              {/* Tech Stack Definition */}
            </p>
            <p>
              <span className="text-secondary">const </span> neuroWorkspace =
              &#123;
            </p>
            <p className="pl-4">
              framework:{" "}
              <span className="text-success">
                &quot;Next.js 15 (App Router)&quot;
              </span>
              ,
            </p>
            <p className="pl-4">
              typeSafety:{" "}
              <span className="text-success">&quot;TypeScript&quot;</span>,
            </p>
            <p className="pl-4">
              database:{" "}
              <span className="text-success">
                &quot;MongoDB + Mongoose&quot;
              </span>
              ,
            </p>
            <p className="pl-4">
              authSystem:{" "}
              <span className="text-success">&quot;Better Auth&quot;</span>,
            </p>
            <p className="pl-4">
              aiEngine:{" "}
              <span className="text-success">&quot;Gemini API Pro&quot;</span>,
            </p>
            <p className="pl-4">
              styling:{" "}
              <span className="text-success">
                &quot;Tailwind CSS + DaisyUI&quot;
              </span>
            </p>
            <p>&#125;;</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. FOOTER
         ========================================== */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-base-content/40">
        <p>
          &copy; {new Date().getFullYear()} NeuroDesk. Built for core portfolio
          excellence.
        </p>
        <div className="flex gap-4 text-base-content/60">
          <a
            href="https://github.com/codeHasib"
            className="hover:text-primary transition-colors"
          >
            <RiGithubFill size={20} />
          </a>
        </div>
      </footer>
    </div>
  );
}
