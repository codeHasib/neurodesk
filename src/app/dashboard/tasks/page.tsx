"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiLayout4Line,
  RiFolderLine,
  RiSearchLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
  RiUserLine,
  RiInboxLine,
} from "react-icons/ri";
import axios from "axios";
import ConfirmDeleteModal from "@/components/modal/ConfimDeleteModal";

// Logic and interfaces remain strictly unchanged
interface TaskMember {
  userId: string;
  role: "admin" | "member";
}

interface Task {
  _id: string;
  title: string;
  description: string;
  workSpaceId: string;
  projectId: string;
  ownerId: string;
  status: "todo" | "in-progress" | "review" | "completed";
  members: TaskMember[];
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
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const AllTasksPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Record<string, string>>({});
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
          axios.get<any>("/api/get-workspace"),
          axios.get<Project[]>("/api/get-project"),
        ]);

        setTasks(taskRes.data || []);

        // Handling the updated workspace response structure { workspaces: [] }
        const wsArray = wsRes.data?.workspaces || [];
        const wsMap = wsArray.reduce(
          (acc: any, ws: any) => ({ ...acc, [ws._id]: ws.name }),
          {},
        );

        const projMap = (projRes.data || []).reduce(
          (acc, p) => ({ ...acc, [p._id]: p.name }),
          {},
        );

        setWorkspaces(wsMap);
        setProjects(projMap);
      } catch (err) {
        console.error("Data synchronization error:", err);
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
      await axios.delete(`/api/delete-task/${deleteTarget._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

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
          text: "text-amber-500",
          bg: "bg-amber-500/10 border-amber-500/20",
        };
      case "review":
        return {
          text: "text-purple-400",
          bg: "bg-purple-500/10 border-purple-500/20",
        };
      case "completed":
        return {
          text: "text-emerald-500",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Simple Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tasks
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              {filteredTasks.length} total tasks found
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-tasks")}
            className="btn btn-primary btn-md rounded-xl text-xs font-bold uppercase tracking-wider px-6"
          >
            <RiAddLine size={18} /> New Task
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 bg-[#0d0d0d] p-3 border border-slate-900 rounded-2xl">
          <div className="relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-primary/40 text-sm h-11 pl-11 rounded-xl text-white outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {["all", "todo", "in-progress", "review", "completed"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    statusFilter === tab
                      ? "bg-primary border-primary text-white"
                      : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Task Grid */}
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-3"
            >
              {filteredTasks.map((task) => {
                const style = getStatusStyle(task.status);
                return (
                  <motion.div
                    key={task._id}
                    variants={cardVariants}
                    className="group bg-[#0d0d0d] border border-slate-900 hover:border-slate-800 transition-all rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-3 flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold border rounded-md uppercase tracking-wider ${style.bg} ${style.text}`}
                        >
                          {task.status === "completed" ? (
                            <RiCheckboxCircleLine size={12} />
                          ) : (
                            <RiCheckboxBlankCircleLine size={12} />
                          )}
                          {task.status.replace("-", " ")}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 px-2 py-1 bg-slate-900/40 rounded-md">
                          <RiLayout4Line size={12} />
                          <span className="truncate max-w-[100px]">
                            {workspaces[task.workSpaceId] || "Workspace"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 px-2 py-1 bg-slate-900/40 rounded-md">
                          <RiFolderLine size={12} />
                          <span className="truncate max-w-[100px]">
                            {projects[task.projectId] || "Project"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {task.members && task.members.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <RiUserLine size={10} className="text-primary" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                            Assigned: {task.members.length} member
                            {task.members.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t border-slate-900 sm:border-none">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/edit-task/${task._id}`)
                        }
                        className="btn btn-sm bg-slate-950 border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 rounded-xl"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(task)}
                        className="btn btn-sm bg-slate-950 border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 rounded-xl"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-[#080808]">
              <RiInboxLine size={40} className="mx-auto text-slate-800 mb-4" />
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                No tasks found
              </p>
            </div>
          )}
        </AnimatePresence>

        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteExecute}
          title="Delete Task"
          itemName={deleteTarget?.title || ""}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default AllTasksPage;
