"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  RiArrowLeftLine,
  RiSaveLine,
  RiFingerprintLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiAdminLine,
  RiUser3Line,
  RiExchangeLine,
} from "react-icons/ri";
import axios from "axios";

interface Member {
  userId: string;
  role: "admin" | "member";
}

const EditWorkspacePage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<{ name: string; members: Member[] }>(
    {
      name: "",
      members: [],
    },
  );

  useEffect(() => {
    const loadWorkspaceConfig = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-workspace/${id}`);
        setFormData({
          name: res.data.name,
          members: res.data.members || [],
        });
      } catch (err) {
        console.error("Failed to parse configuration framework:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadWorkspaceConfig();
  }, [id]);

  // Handle Role Toggling locally
  const toggleRole = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.userId === userId
          ? { ...m, role: m.role === "admin" ? "member" : "admin" }
          : m,
      ),
    }));
  };

  const handleConfigCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Now sending both Name and the updated Members array
      await axios.patch(`/api/update-workspace/${id}`, {
        name: formData.name,
        members: formData.members,
      });
      router.push("/dashboard/workspaces");
    } catch (err) {
      console.error("Configuration compile error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen text-slate-200 p-4 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Navigation Core */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
          >
            <RiArrowLeftLine /> Cluster_Index
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 bg-slate-950 border border-slate-900 px-3 py-1 rounded-md">
            <RiFingerprintLine className="text-primary" /> SCOPE_ID:{" "}
            {id?.toString().slice(-12)}
          </div>
        </div>

        <form
          onSubmit={handleConfigCommit}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0b0b] border border-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-xl space-y-10">
              {/* Workspace Identity */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  Cluster Identity Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-transparent text-2xl font-bold placeholder:text-slate-800 focus:ring-0 border border-slate-800 rounded-full text-white italic"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Members/Team Management */}
              <div className="space-y-4 pt-8 border-t border-slate-900/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiTeamLine size={16} className="text-slate-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Team_Operators ({formData.members.length})
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3">
                  {formData.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-2xl group transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                          {member.role === "admin" ? (
                            <RiAdminLine size={18} />
                          ) : (
                            <RiUser3Line size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            {member.userId}
                          </p>
                          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                            Verified_Node_Member
                          </p>
                        </div>
                      </div>

                      {/* Interactive Role Badge */}
                      <button
                        type="button"
                        onClick={() => toggleRole(member.userId)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                          member.role === "admin"
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                        }`}
                      >
                        {member.role}
                        <RiExchangeLine className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Operations Panel */}
          <div className="space-y-6">
            <div className="bg-[#0b0b0b] border border-slate-900 rounded-[2rem] p-8 shadow-xl space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 block">
                System_Status
              </label>
              <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950 border border-slate-900 p-4 rounded-xl">
                <RiShieldCheckLine
                  size={20}
                  className="text-emerald-500 shrink-0"
                />
                <div>
                  <p className="font-bold text-white uppercase italic text-[10px]">
                    Permission_Sync
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono">
                    RBAC Protocol Active
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky top-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary h-16 rounded-2xl text-xs font-black tracking-[0.3em] uppercase italic shadow-2xl transition-all active:scale-[0.98] group"
              >
                {isUpdating ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <RiSaveLine size={18} /> Commit_Recalibration
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn bg-slate-950 border-slate-900 text-slate-500 hover:text-white h-14 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditWorkspacePage;
