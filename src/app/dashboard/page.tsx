"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RiCheckboxCircleLine,
  RiPieChartLine,
  RiArrowRightUpLine,
  RiFileList3Line,
  RiStackLine,
  RiHashtag,
  RiFocus2Line,
  RiMagicLine,
  RiSendPlane2Line,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import axios from "axios";
import Link from "next/link";

// Subtle Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    totalWorkspaces: 0,
    completionRate: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  // AI Planner State
  const [aiInput, setAiInput] = useState("");
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sessionRes, wsRes, projRes, taskRes] = await Promise.all([
          authClient.getSession(),
          axios.get("/api/get-workspace"),
          axios.get("/api/get-project"),
          axios.get("/api/get-task"),
        ]);

        const tasks = taskRes.data || [];
        const completed = tasks.filter(
          (t: any) => t.status === "completed",
        ).length;

        setSession(sessionRes.data);
        setRecentTasks(tasks.slice(0, 5));

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          activeProjects: projRes.data?.length || 0,
          totalWorkspaces: wsRes.data?.length || 0,
          completionRate:
            tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
        });
      } catch (error) {
        console.error("Data Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateQuickPlan = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await axios.post("/api/ai-planner", {
        promptText: aiInput,
        focusArea: "General Task",
        priority: "High Priority",
      });
      setAiPlan(data.steps);
    } catch (err) {
      console.error("AI Planner Error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8 px-4 md:px-0"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Welcome Back
        </p>
        <h1 className="text-2xl font-bold text-white">
          {session?.user?.name?.split(" ")[0]}'s Overview
        </h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Progress Card */}
        <motion.div
          variants={itemVariants}
          className="p-5 bg-[#0d0d0d] border border-slate-900 rounded-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Completion
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.completionRate.toFixed(0)}%
              </h3>
            </div>
            <RiPieChartLine className="text-primary/20" size={32} />
          </div>
          <div className="w-full bg-slate-950 h-1.5 mt-4 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              className="bg-primary h-full"
            />
          </div>
        </motion.div>

        {/* Tasks Card */}
        <motion.div
          variants={itemVariants}
          className="p-5 bg-[#0d0d0d] border border-slate-900 rounded-2xl flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Tasks
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {stats.totalTasks - stats.completedTasks}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-primary">
            <RiStackLine size={20} />
          </div>
        </motion.div>

        {/* Projects Card */}
        <motion.div
          variants={itemVariants}
          className="p-5 bg-[#0d0d0d] border border-slate-900 rounded-2xl flex items-center justify-between sm:col-span-2 lg:col-span-1"
        >
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Active Projects
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {stats.activeProjects}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-primary">
            <RiHashtag size={20} />
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Task List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            className="bg-[#0d0d0d] border border-slate-900 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiFocus2Line className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                  Recent Tasks
                </h2>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 uppercase"
              >
                See All <RiArrowRightUpLine />
              </Link>
            </div>

            <div className="p-4 space-y-2">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 bg-slate-950/50 hover:bg-slate-950 border border-slate-900 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          task.status === "completed"
                            ? "bg-emerald-500"
                            : task.status === "in-progress"
                              ? "bg-amber-500"
                              : "bg-slate-700"
                        }`}
                      />
                      <p className="text-sm font-medium text-slate-300 truncate pr-2">
                        {task.title}
                      </p>
                    </div>
                    <RiCheckboxCircleLine
                      className={
                        task.status === "completed"
                          ? "text-emerald-500"
                          : "text-slate-800"
                      }
                      size={16}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-600 font-medium">
                    No tasks found
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI STRATEGY PLANNER (NEW SECTION) */}
          <motion.div
            variants={itemVariants}
            className="bg-[#0d0d0d] border border-slate-900 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiMagicLine className="text-primary" size={18} />
                <h2 className="text-sm font-bold uppercase tracking-wide text-white">
                  AI Strategy Planner
                </h2>
              </div>
              <Link
                href="/dashboard/ai-planner"
                className="text-[10px] font-bold text-slate-500 hover:text-primary uppercase flex items-center gap-1"
              >
                Full Planner <RiArrowRightUpLine />
              </Link>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Enter a task to generate a plan..."
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs text-slate-300 focus:outline-none focus:border-primary/40 transition-colors pr-12"
                  onKeyDown={(e) => e.key === "Enter" && generateQuickPlan()}
                />
                <button
                  onClick={generateQuickPlan}
                  disabled={aiLoading || !aiInput.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors disabled:opacity-20"
                >
                  {aiLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <RiSendPlane2Line size={20} />
                  )}
                </button>
              </div>

              {aiPlan.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                  {aiPlan.map((step, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex gap-3 items-start"
                    >
                      <span className="text-[10px] font-bold text-primary mt-0.5">
                        0{i + 1}
                      </span>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Section: Scratchpad */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0d0d0d] border border-slate-900 rounded-3xl flex flex-col shadow-sm h-full lg:min-h-[600px]"
        >
          <div className="p-6 border-b border-slate-900 flex items-center gap-2">
            <RiFileList3Line className="text-primary" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">
              Quick Notes
            </h2>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <textarea
              spellCheck={false}
              placeholder="Type notes here..."
              className="w-full flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-400 focus:outline-none focus:border-primary/40 resize-none transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
