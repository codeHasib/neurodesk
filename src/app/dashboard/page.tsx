"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RiSparklingLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiPieChartLine,
  RiArrowRightUpLine,
  RiFileList3Line,
} from "react-icons/ri";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

// Animation Variants for Container Parent-Child relationships (Staggering)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays the appearance of each child element slightly
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const DashboardPage = () => {
  // Mock data for AI Planner
  const aiInsights = [
    {
      id: 1,
      task: "Review Next.js Server Actions execution flow",
      priority: "High",
      time: "10:00 AM",
    },
    {
      id: 2,
      task: "Refactor Zustand store slices for workspace persistence",
      priority: "Medium",
      time: "01:30 PM",
    },
    {
      id: 3,
      task: "Optimize MongoDB cluster index keys",
      priority: "Low",
      time: "04:00 PM",
    },
  ];

  const { data, isPending } = useSession();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ========================================================
          1. HEADER GREETING (Fade Down)
         ======================================================== */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, <span className="uppercase">{data?.user.name}</span>
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Here is your localized neural network status today.
          </p>
        </div>
        <div className="badge badge-lg bg-base-100 border border-base-300 shadow-sm gap-2 font-medium px-4 py-5 text-sm">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
          AI Workspace Synced
        </div>
      </motion.div>

      {/* ========================================================
          2. PERFORMANCE METRICS GRID (Scale / Fade Up)
         ======================================================== */}
      <motion.div
        variants={containerVariants}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Metric 1 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="card bg-base-100 border border-base-300 shadow-sm"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Completion Rate
              </span>
              <h3 className="text-3xl font-extrabold">84.2%</h3>
              <p className="text-xs text-success flex items-center gap-1 font-semibold mt-1">
                +4.3%{" "}
                <span className="text-base-content/40 font-normal">
                  this week
                </span>
              </p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <RiPieChartLine size={24} />
            </div>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="card bg-base-100 border border-base-300 shadow-sm"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Active Tasks
              </span>
              <h3 className="text-3xl font-extrabold">12</h3>
              <p className="text-xs text-base-content/40 font-normal mt-1">
                4 core projects initialized
              </p>
            </div>
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <RiCheckboxCircleLine size={24} />
            </div>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="card bg-base-100 border border-base-300 shadow-sm sm:col-span-2 lg:col-span-1"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
                Focus Allocation
              </span>
              <h3 className="text-3xl font-extrabold">
                4.5
                <span className="text-lg font-normal text-base-content/50">
                  hrs
                </span>
              </h3>
              <p className="text-xs text-error flex items-center gap-1 font-semibold mt-1">
                -30m{" "}
                <span className="text-base-content/40 font-normal">
                  vs yesterday
                </span>
              </p>
            </div>
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <RiTimeLine size={24} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========================================================
          3. MAIN INTERACTIVE SPLIT GRID (AI Planner + Log)
         ======================================================== */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* AI Daily Planner Section (Occupies 2 columns on desktop) */}
        <motion.div
          variants={itemVariants}
          className="card lg:col-span-2 bg-base-100 border border-base-300 shadow-md overflow-hidden relative"
        >
          {/* Subtle accent line mapping the AI feature context */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-secondary" />

          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <RiSparklingLine
                  size={20}
                  className="text-primary animate-pulse"
                />
                <h2 className="text-xl font-bold tracking-tight">
                  Neuro AI Day Plan
                </h2>
              </div>
              <button className="btn btn-ghost btn-sm text-primary gap-1 font-semibold text-xs rounded-lg">
                Regenerate <RiArrowRightUpLine size={14} />
              </button>
            </div>

            {/* Staggered list items mapped via framer-motion */}
            <motion.div variants={containerVariants} className="space-y-3">
              {aiInsights.map((insight) => (
                <motion.div
                  key={insight.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 bg-base-200 border border-base-300/60 rounded-xl cursor-pointer transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm rounded-md"
                    />
                    <p className="text-sm font-medium truncate pr-2">
                      {insight.task}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-base-content/40 font-mono hidden sm:inline">
                      {insight.time}
                    </span>
                    <span
                      className={`badge badge-xs font-bold p-2 text-[10px] rounded-md ${
                        insight.priority === "High"
                          ? "bg-error/10 text-error border-none"
                          : insight.priority === "Medium"
                            ? "bg-warning/10 text-warning border-none"
                            : "bg-base-300 border-none"
                      }`}
                    >
                      {insight.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Notes / Context Snippets Section */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 border border-base-300 shadow-sm"
        >
          <div className="card-body p-6">
            <div className="flex items-center gap-2 mb-4">
              <RiFileList3Line size={20} className="text-base-content/60" />
              <h2 className="text-xl font-bold tracking-tight">
                Markdown Notes
              </h2>
            </div>
            <textarea
              placeholder="Jot down execution notes or copy error trace logs here..."
              className="textarea textarea-bordered focus:textarea-primary bg-base-200 border-none w-full flex-1 min-h-[180px] resize-none font-mono text-xs leading-relaxed p-4 rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
