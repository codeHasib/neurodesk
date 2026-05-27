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

  const handleConfigCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.patch(`/api/update-workspace/${id}`, { name: formData.name });
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
          {/* Main Scope Parameters Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0b0b] border border-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-xl space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                  Cluster Identity Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-none text-4xl font-bold placeholder:text-slate-800 focus:ring-0 p-0 text-white"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Members Array Display Module */}
              <div className="space-y-4 pt-4 border-t border-slate-900/60">
                <div className="flex items-center gap-2">
                  <RiTeamLine size={16} className="text-slate-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Environment_Operators ({formData.members.length})
                  </h3>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
                  {formData.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-900/80 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                          {member.role === "admin" ? (
                            <RiAdminLine size={14} />
                          ) : (
                            <RiUser3Line size={14} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-mono text-slate-300 font-bold">
                            UID_{member.userId.slice(-6)}
                          </p>
                          <p className="text-[9px] font-mono text-slate-600 truncate max-w-[180px]">
                            {member.userId}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                          member.role === "admin"
                            ? "bg-primary/5 border-primary/20 text-primary"
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}
                      >
                        {member.role}
                      </span>
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

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950 border border-slate-900 p-4 rounded-xl">
                  <RiShieldCheckLine
                    size={20}
                    className="text-emerald-500 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white">Encryption Lock</p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      Isolated Node State
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Submission Action Row */}
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
                    <RiSaveLine size={18} />
                    Commit_Cluster_State
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
