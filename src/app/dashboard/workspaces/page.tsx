"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiGlobalLine,
  RiTeamLine,
  RiCalendarEventLine,
  RiShieldUserLine,
} from "react-icons/ri";
import axios from "axios";
import ConfirmDeleteModal from "@/components/modal/ConfimDeleteModal";

interface Member {
  userId: string;
  role: "admin" | "member";
}

interface Workspace {
  _id: string;
  name: string;
  ownerId: string;
  members: Member[];
  createdAt: string;
}

const AllWorkspacesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Deletion Target State
  const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        // Using your global get-workspace endpoint
        const res = await axios.get<Workspace[]>("/api/get-workspace");
        setWorkspaces(res.data || []);
      } catch (err) {
        console.error("Failed to fetch environment workspaces:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleWorkspacePurge = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/delete-workspace/${deleteTarget._id}`);
      setWorkspaces((prev) => prev.filter((w) => w._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Workspace destruction failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-4">
          Mapping Clusters...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen  p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Dynamic Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">
              Root_Workspaces
            </h1>
            <p className="text-slate-500 text-xs font-mono mt-2 flex items-center gap-2">
              <RiGlobalLine
                className="text-primary animate-spin"
                style={{ animationDuration: "4s" }}
              />
              Active Cluster Isolation Environments: {workspaces.length}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-workspace")}
            className="btn btn-primary h-14 rounded-2xl text-xs font-black tracking-widest px-8 shadow-xl shadow-primary/10 transition-all hover:scale-[1.01]"
          >
            <RiAddLine size={20} /> Initialize_Workspace
          </button>
        </div>

        {/* Workspace Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {workspaces.map((ws) => (
              <motion.div
                key={ws._id}
                layoutId={ws._id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                className="group relative bg-[#0c0c0c] border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl"
              >
                <div className="space-y-6">
                  {/* Title & Operations Console */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 max-w-[70%]">
                      <h3 className="text-2xl font-black text-white italic tracking-tighter truncate group-hover:text-primary transition-colors uppercase">
                        {ws.name}
                      </h3>
                      <p className="text-[9px] font-mono text-slate-600 truncate">
                        ID: {ws._id}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/edit-workspace/${ws._id}`)
                        }
                        className="p-2.5 rounded-xl bg-slate-950 text-slate-500 hover:text-primary border border-slate-900 transition-all"
                        title="Configure Module"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(ws)}
                        className="p-2.5 rounded-xl bg-slate-950 text-slate-500 hover:text-red-500 border border-slate-900 transition-all"
                        title="Destroy Module"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Operational Data Parameters */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 border border-slate-900/60 rounded-2xl flex items-center gap-3">
                      <RiTeamLine
                        size={20}
                        className="text-slate-500 group-hover:text-primary transition-colors"
                      />
                      <div>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                          Seats
                        </p>
                        <p className="text-sm font-bold text-white">
                          {ws.members?.length || 1} Active
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-900/60 rounded-2xl flex items-center gap-3">
                      <RiShieldUserLine size={20} className="text-slate-500" />
                      <div>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                          Security
                        </p>
                        <p className="text-[10px] font-black tracking-tight text-emerald-500 uppercase mt-0.5">
                          RBAC Validated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Micro-Information */}
                <div className="mt-8 pt-4 border-t border-slate-900/40 flex items-center justify-between text-[10px] font-mono text-slate-600">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                    Matrix_Node
                  </span>
                  <span className="flex items-center gap-1">
                    <RiCalendarEventLine />{" "}
                    {new Date(ws.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {workspaces.length === 0 && (
            <div className="col-span-full py-24 border border-dashed border-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <div className="p-5 bg-slate-950 border border-slate-900 rounded-full mb-4 text-slate-700">
                <RiGlobalLine size={36} />
              </div>
              <h2 className="text-md font-black uppercase tracking-[0.2em] text-slate-500">
                No Environment Mapped
              </h2>
              <p className="text-xs font-mono text-slate-600 mt-1">
                Deploy an initial workspace cluster to allocate project
                infrastructure.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Drop-Gate Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleWorkspacePurge}
        title="Destroy Cluster Environment"
        itemName={deleteTarget?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AllWorkspacesPage;
