"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiLayout4Line,
  RiStackLine,
  RiInformationLine,
} from "react-icons/ri";
import axios from "axios";
import ConfirmDeleteModal from "@/components/modal/ConfimDeleteModal";

interface Project {
  _id: string;
  name: string;
  description: string;
  workSpaceId: string;
  color?: string;
  ownerId: string;
}

interface Workspace {
  _id: string;
  name: string;
}

const AllProjectsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaces, setWorkspaces] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projRes, wsRes] = await Promise.all([
          axios.get<Project[]>("/api/get-project"),
          axios.get<any>("/api/get-workspace"),
        ]);

        setProjects(projRes.data || []);

        const wsArray = wsRes.data?.workspaces || [];
        const wsMap = wsArray.reduce(
          (acc: any, ws: any) => ({ ...acc, [ws._id]: ws.name }),
          {},
        );
        setWorkspaces(wsMap);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, []);

  const handlePurgeExecute = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/delete-project/${deleteTarget._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Simple Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">
              {projects.length} active projects in your account
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-projects")}
            className="btn btn-primary btn-md rounded-xl text-xs font-bold uppercase tracking-wider px-6"
          >
            <RiAddLine size={18} /> New Project
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                layoutId={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-[#0d0d0d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all shadow-sm overflow-hidden"
              >
                {/* Glow effect */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundColor: project.color || "#3b82f6" }}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/50"
                      style={{
                        borderColor: project.color
                          ? `${project.color}33`
                          : undefined,
                      }}
                    >
                      <RiStackLine
                        size={20}
                        style={{ color: project.color || "#3b82f6" }}
                      />
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/edit-project/${project._id}`)
                        }
                        className="p-2 rounded-lg bg-slate-950 text-slate-500 hover:text-white border border-slate-900 transition-colors"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-2 rounded-lg bg-slate-950 text-slate-500 hover:text-red-500 border border-slate-900 transition-colors"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                      <RiLayout4Line size={12} className="text-primary" />
                      {workspaces[project.workSpaceId] || "Main Workspace"}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: project.color || "#3b82f6" }}
                    />
                    <span className="text-[9px] font-bold uppercase text-slate-600 tracking-widest">
                      Active
                    </span>
                  </div>
                  <RiInformationLine size={14} className="text-slate-800" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="py-20 border border-dashed border-slate-900 rounded-3xl flex flex-col items-center justify-center text-center bg-[#080808]">
            <RiStackLine size={40} className="text-slate-800 mb-3" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              No projects found
            </h2>
            <p className="text-[10px] text-slate-700 mt-1 uppercase tracking-tighter">
              Create a project to start organizing your tasks
            </p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handlePurgeExecute}
        title="Delete Project"
        itemName={deleteTarget?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AllProjectsPage;
