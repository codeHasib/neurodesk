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

interface WorkspaceResponse {
  workspaces: Workspace[];
  userId: string;
}

const AllWorkspacesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Workspace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const res = await axios.get<WorkspaceResponse>("/api/get-workspace");
        setWorkspaces(res.data.workspaces || []);
        setCurrentUserId(res.data.userId);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const canManageWorkspace = (ws: Workspace) => {
    if (!currentUserId) return false;
    const isOwner = ws.ownerId === currentUserId;
    const isAdmin = ws.members?.some(
      (m) => m.userId === currentUserId && m.role === "admin",
    );
    return isOwner || isAdmin;
  };

  const handleWorkspacePurge = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/delete-workspace/${deleteTarget._id}`);
      setWorkspaces((prev) => prev.filter((w) => w._id !== deleteTarget._id));
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
              Workspaces
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">
              You have access to {workspaces.length} workspace environments
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/add-workspace")}
            className="btn btn-primary btn-md rounded-xl text-xs font-bold uppercase tracking-wider px-6"
          >
            <RiAddLine size={18} /> New Workspace
          </button>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {workspaces.map((ws) => {
              const hasAdminPower = canManageWorkspace(ws);

              return (
                <motion.div
                  key={ws._id}
                  layoutId={ws._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-[#0d0d0d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all shadow-sm"
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 overflow-hidden">
                        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate">
                          {ws.name}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                          Workspace Member
                        </p>
                      </div>

                      {hasAdminPower && (
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/edit-workspace/${ws._id}`)
                            }
                            className="p-2 rounded-lg bg-slate-950 text-slate-500 hover:text-white border border-slate-900 transition-colors"
                          >
                            <RiEditLine size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ws)}
                            className="p-2 rounded-lg bg-slate-950 text-slate-500 hover:text-red-500 border border-slate-900 transition-colors"
                          >
                            <RiDeleteBin6Line size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center gap-3">
                        <RiTeamLine size={18} className="text-slate-500" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                            Members
                          </p>
                          <p className="text-xs font-bold text-white">
                            {ws.members?.length || 1}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center gap-3">
                        <RiShieldUserLine
                          size={18}
                          className={
                            hasAdminPower ? "text-primary" : "text-slate-600"
                          }
                        />
                        <div>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                            Role
                          </p>
                          <p
                            className={`text-[10px] font-bold uppercase ${hasAdminPower ? "text-emerald-500" : "text-slate-500"}`}
                          >
                            {hasAdminPower ? "Admin" : "Member"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900/50 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${hasAdminPower ? "bg-primary" : "bg-slate-800"}`}
                      />
                      Access Active
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <RiCalendarEventLine />
                      {new Date(ws.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="py-20 border border-dashed border-slate-900 rounded-3xl flex flex-col items-center justify-center text-center bg-[#080808]">
            <RiGlobalLine size={40} className="text-slate-800 mb-3" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              No workspaces found
            </h2>
            <p className="text-[10px] text-slate-700 mt-1 uppercase tracking-tighter">
              Create your first workspace to start collaborating
            </p>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleWorkspacePurge}
        title="Delete Workspace"
        itemName={deleteTarget?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AllWorkspacesPage;
