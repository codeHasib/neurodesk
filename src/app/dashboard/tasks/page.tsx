"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiLayout4Line,
  RiFolderLine,
  RiSearchLine,
  RiTerminalBoxLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import axios from "axios";
import ConfirmDeleteModal from "@/components/modal/ConfimDeleteModal";

interface Task {
  _id: string;
  title: string;
  description: string;
  workSpaceId: string;
  projectId: string;
  status: "todo" | "in-progress" | "review" | "completed";
}

interface Workspace {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const AllTasksPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Core Datasets
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Record<string, string>>({});

  // Client Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        setLoading(true);
        const [taskRes, wsRes, projRes] = await Promise.all([
          axios.get<Task[]>("/api/get-task"),
          axios.get<Workspace[]>("/api/get-workspace"),
          axios.get<Project[]>("/api/get-project"),
        ]);

        setTasks(taskRes.data || []);

        // Flatten workspaces & projects arrays into hash maps for O(1) rendering lookups
        const wsMap = (wsRes.data || []).reduce(
          (acc, ws) => ({ ...acc, [ws._id]: ws.name }),
          {},
        );
        const projMap = (projRes.data || []).reduce(
          (acc, p) => ({ ...acc, [p._id]: p.name }),
          {},
        );

        setWorkspaces(wsMap);
        setProjects(projMap);
      } catch (err) {
        console.error("Matrix compilation error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  const handleDeleteExecute = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);

      // Fire DELETE request to your task endpoint
      console.log(deleteTarget._id);
      await axios.delete(`/api/delete-task/${deleteTarget._id}`);

      // Update local state smoothly without an entire page reload
      setTasks((prevTasks) =>
        prevTasks.filter((t) => t._id !== deleteTarget._id),
      );

      // Close modal
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to execute purge blueprint:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering Logic Execution
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return {
          text: "text-slate-400",
          bg: "bg-slate-500/10 border-slate-500/20",
        };
      case "in-progress":
        return {
          text: "text-amber-400 animate-pulse",
          bg: "bg-amber-500/10 border-amber-500/20",
        };
      case "review":
        return {
          text: "text-purple-400",
          bg: "bg-purple-500/10 border-purple-500/20",
        };
      case "completed":
        return {
          text: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-black">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
          Syncing operational matrix...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
              Execution_Queue
            </h1>
            <p className="text-slate-500 text-xs font-mono tracking-wider mt-1">
              Active operational manifest: {filteredTasks.length} units listed
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-tasks")}
            className="btn btn-primary h-12 rounded-xl text-xs font-black tracking-widest uppercase px-6 shadow-lg shadow-primary/10 transition-transform active:scale-95"
          >
            <RiAddLine size={16} /> Initialize_Task
          </button>
        </div>

        {/* Operational Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0d0d0d] p-3 border border-slate-900 rounded-xl">
          {/* Search */}
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Filter by context signatures..."
              className="w-full bg-black/40 border border-slate-800 focus:border-primary/50 text-xs font-mono placeholder:text-slate-700 h-11 pl-11 rounded-lg focus:ring-0 text-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Segment Filtering Controls */}
          <div className="md:col-span-2 flex flex-wrap gap-1.5 items-center justify-start md:justify-end">
            {["all", "todo", "in-progress", "review", "completed"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                    statusFilter === tab
                      ? "bg-primary border-primary text-white"
                      : "bg-black/20 border-slate-900 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Tasks Layout Matrix */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {filteredTasks.map((task) => {
                const style = getStatusStyle(task.status);
                return (
                  <motion.div
                    key={task._id}
                    layoutId={task._id}
                    variants={cardVariants}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group bg-[#0d0d0d] border border-slate-900 hover:border-slate-800 transition-all rounded-xl overflow-hidden p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    {/* Left: Metadata & Context Block */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Task Phase Indicator */}
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono border rounded-md uppercase font-black tracking-wider ${style.bg} ${style.text}`}
                        >
                          {task.status === "completed" ? (
                            <RiCheckboxCircleLine size={12} />
                          ) : (
                            <RiCheckboxBlankCircleLine size={12} />
                          )}
                          {task.status.replace("-", " ")}
                        </div>

                        {/* Node Architecture Trackers */}
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
                          <RiLayout4Line size={12} />
                          <span className="truncate max-w-[120px]">
                            {workspaces[task.workSpaceId] || "Root_Node"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
                          <RiFolderLine size={12} />
                          <span className="truncate max-w-[120px]">
                            {projects[task.projectId] || "Null_Project"}
                          </span>
                        </div>
                      </div>

                      {/* Content Execution Identity */}
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Surgical Control Directives */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-slate-900 md:border-none pt-4 md:pt-0 shrink-0">
                      <button
                        onClick={() => router.push(`/tasks/edit/${task._id}`)}
                        className="btn bg-slate-900/40 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 h-10 w-10 p-0 rounded-lg transition-all"
                        title="Modify Task Schema"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(task)} // Updated pointer
                        className="btn bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 h-10 w-10 p-0 rounded-lg transition-all"
                        title="Purge Task Entity"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty Queue Scenario */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-slate-900 rounded-2xl bg-[#080808]"
            >
              <div className="inline-flex p-4 bg-slate-950 rounded-2xl border border-slate-900 mb-4 text-slate-700">
                <RiTerminalBoxLine size={32} />
              </div>
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">
                Zero_Execution_Signatures
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-1 max-w-xs mx-auto">
                No tracking blocks matched your current viewport configurations.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteExecute}
          title="Confirm Task Deletion"
          itemName={deleteTarget?.title || ""}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default AllTasksPage;
