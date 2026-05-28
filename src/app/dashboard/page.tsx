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
        {/* Task List */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-[#0d0d0d] border border-slate-900 rounded-3xl overflow-hidden shadow-sm"
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

        {/* Scratchpad */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0d0d0d] border border-slate-900 rounded-3xl flex flex-col shadow-sm"
        >
          <div className="p-6 border-b border-slate-900 flex items-center gap-2">
            <RiFileList3Line className="text-primary" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wide text-white">
              Quick Notes
            </h2>
          </div>
          <div className="p-4 flex-1">
            <textarea
              spellCheck={false}
              placeholder="Type notes here..."
              className="w-full h-[200px] lg:h-full bg-slate-950 border border-slate-900 rounded-2xl p-4 text-xs text-slate-400 focus:outline-none focus:border-primary/40 resize-none transition-colors"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
