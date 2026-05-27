"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiLayout4Line,
  RiHashtag,
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

  // Modal & Purge State
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projRes, wsRes] = await Promise.all([
          axios.get<Project[]>("/api/get-project"),
          axios.get<Workspace[]>("/api/get-workspace"),
        ]);

        setProjects(projRes.data || []);
        const wsMap = (wsRes.data || []).reduce(
          (acc, ws) => ({ ...acc, [ws._id]: ws.name }),
          {},
        );
        setWorkspaces(wsMap);
      } catch (err) {
        console.error("Infrastructure Sync Error:", err);
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
      console.error("Purge Execution Failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-black">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-4">
          Indexing Deployed Nodes...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Directive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Project_Architecture
            </h1>
            <p className="text-slate-500 text-xs font-mono mt-2 flex items-center gap-2">
              <RiHashtag className="text-primary" /> {projects.length} Active
              Deployments Detected
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-projects")}
            className="btn btn-primary h-14 rounded-2xl text-xs font-black tracking-widest px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <RiAddLine size={20} /> Deploy_New_Node
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                layoutId={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[#0d0d0d] border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-2xl overflow-hidden"
              >
                {/* Visual Color Signature */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ backgroundColor: project.color || "#3b82f6" }}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div
                      className="p-3 rounded-2xl border border-slate-800 bg-slate-900/50"
                      style={{
                        borderColor: project.color
                          ? `${project.color}33`
                          : undefined,
                      }}
                    >
                      <RiStackLine
                        size={24}
                        style={{ color: project.color || "#3b82f6" }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/edit-project/${project._id}`)
                        }
                        className="p-2.5 rounded-xl bg-slate-900 text-slate-500 hover:text-primary border border-slate-800 transition-all"
                      >
                        <RiEditLine size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(project)}
                        className="p-2.5 rounded-xl bg-slate-900 text-slate-500 hover:text-red-500 border border-slate-800 transition-all"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white italic tracking-tight truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase mt-1">
                      <RiLayout4Line className="text-primary" />
                      {workspaces[project.workSpaceId] || "Root_Workspace"}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 min-h-[4.5em]">
                    {project.description ||
                      "No technical documentation provided for this node."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: project.color || "#3b82f6" }}
                    />
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">
                      Active_Node
                    </span>
                  </div>
                  <RiInformationLine size={14} className="text-slate-800" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State Handled within Grid */}
          {projects.length === 0 && (
            <div className="col-span-full py-20 border-2 border-dashed border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-slate-900/30 rounded-full mb-4">
                <RiStackLine size={48} className="text-slate-800" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-slate-600">
                No Infrastructure Deployed
              </h2>
              <p className="text-xs font-mono text-slate-700 mt-2">
                Initialize your first project node to begin tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Purge Logic */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handlePurgeExecute}
        title="Purge Project Node"
        itemName={deleteTarget?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AllProjectsPage;
