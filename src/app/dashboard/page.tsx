"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RiSparklingLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiPieChartLine,
  RiArrowRightUpLine,
  RiFileList3Line,
  RiStackLine,
  RiHashtag,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import axios from "axios";
import Link from "next/link";

// Animation Logic
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
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
        setRecentTasks(tasks.slice(0, 5)); // Only show top 5 in planner

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          activeProjects: projRes.data?.length || 0,
          totalWorkspaces: wsRes.data?.length || 0,
          completionRate:
            tasks.length > 0 ? (completed / tasks.length) * 100 : 0,
        });
      } catch (error) {
        console.error("Neural Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12"
    >
      {/* 1. Header Greeting */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic">
            SYSTEM_OVERVIEW:{" "}
            <span className="text-primary uppercase">
              {session?.user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-base-content/50 text-sm font-medium mt-1 uppercase tracking-widest">
            Neural Network status: <span className="text-success">Active</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="badge badge-outline border-base-300 gap-2 px-4 py-4 text-xs font-bold uppercase tracking-tighter">
            {stats.totalWorkspaces} Workspaces
          </div>
          <div className="badge badge-primary gap-2 px-4 py-4 text-xs font-bold uppercase tracking-tighter">
            {stats.activeProjects} Projects Live
          </div>
        </div>
      </motion.div>

      {/* 2. Real-Time Metrics Grid */}
      <motion.div
        variants={containerVariants}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Completion Rate */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <RiPieChartLine size={80} />
          </div>
          <div className="card-body p-6">
            <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
              Efficiency
            </span>
            <h3 className="text-4xl font-black tracking-tighter mt-1">
              {stats.completionRate.toFixed(1)}%
            </h3>
            <div className="w-full bg-base-300 h-1 mt-4 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                className="bg-primary h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Active Tasks Counter */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="card bg-base-100 border border-base-300 shadow-xl group"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
                Queue Size
              </span>
              <h3 className="text-4xl font-black tracking-tighter">
                {stats.totalTasks - stats.completedTasks}
              </h3>
              <p className="text-xs text-base-content/50 font-bold uppercase">
                Pending Execution
              </p>
            </div>
            <div className="p-4 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20">
              <RiStackLine size={28} />
            </div>
          </div>
        </motion.div>

        {/* System Uptime / Projects */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="card bg-black text-white border border-slate-800 shadow-xl group sm:col-span-2 lg:col-span-1"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Architecture
              </span>
              <h3 className="text-4xl font-black tracking-tighter">
                {stats.activeProjects}
              </h3>
              <p className="text-xs text-primary font-bold uppercase">
                Deployed Nodes
              </p>
            </div>
            <div className="p-4 bg-primary/20 text-primary rounded-2xl border border-primary/30">
              <RiHashtag size={28} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Main Data Core */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Dynamic Task Planner */}
        <motion.div
          variants={itemVariants}
          className="card lg:col-span-2 bg-base-100 border border-base-300 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="card-body p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RiSparklingLine size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase italic">
                  Active Operations
                </h2>
              </div>
              <Link
                href="/dashboard/tasks"
                className="btn btn-ghost btn-sm text-xs font-black tracking-widest uppercase hover:text-primary"
              >
                View All <RiArrowRightUpLine />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    whileHover={{ x: 8 }}
                    className="flex items-center justify-between p-5 bg-base-200/50 border border-base-300/50 rounded-2xl group transition-all hover:bg-base-200 hover:border-primary/30"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          task.status === "completed"
                            ? "bg-success"
                            : task.status === "in-progress"
                              ? "bg-warning animate-pulse"
                              : "bg-slate-400"
                        }`}
                      />
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 font-mono text-[10px]">
                      <span className="uppercase text-base-content/40 tracking-tighter hidden md:inline">
                        {task.status}
                      </span>
                      <RiCheckboxCircleLine
                        className={
                          task.status === "completed"
                            ? "text-success"
                            : "text-base-content/20"
                        }
                        size={18}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-base-300 rounded-3xl">
                  <p className="text-sm font-bold text-base-content/30 uppercase tracking-widest">
                    No Active Missions Found
                  </p>
                  <Link
                    href="/dashboard/add-task"
                    className="btn btn-primary btn-sm mt-4 rounded-xl"
                  >
                    Initialize Task
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Scratchpad (Markdown Focus) */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-200/50 border border-base-300 shadow-xl overflow-hidden group"
        >
          <div className="card-body p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <RiFileList3Line size={20} className="text-primary" />
              <h2 className="text-lg font-black tracking-tight uppercase italic">
                Live Scratchpad
              </h2>
            </div>
            <textarea
              spellCheck={false}
              placeholder="Root@User: ~ Enter temporary execution logs or error traces..."
              className="textarea bg-black/5 border-none w-full flex-1 min-h-[300px] resize-none font-mono text-xs leading-relaxed p-6 rounded-2xl focus:ring-1 ring-primary/20 transition-all placeholder:text-base-content/20"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
