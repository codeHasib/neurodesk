"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  RiSettings3Line,
  RiArrowLeftLine,
  RiSaveLine,
  RiLayout4Line,
  RiPaletteLine,
  RiInformationLine,
  RiTerminalBoxLine,
} from "react-icons/ri";
import axios from "axios";

const EditProjectPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Contextual Data
  const [workSpaces, setWorkSpaces] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workSpaceId: "",
    color: "#3b82f6", // Default System Blue
  });

  // Color Presets for Modern Utility Look
  const colorPresets = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#64748b",
    "#06b6d4",
  ];

  useEffect(() => {
    const initializeProjectData = async () => {
      try {
        setLoading(true);
        const [wsRes, projRes] = await Promise.all([
          axios.get("/api/get-workspace"),
          axios.get(`/api/get-project/${id}`),
        ]);

        setWorkSpaces(wsRes.data);

        const project = projRes.data;
        setFormData({
          name: project.name,
          description: project.description || "",
          workSpaceId: project.workSpaceId,
          color: project.color || "#3b82f6",
        });
      } catch (err) {
        console.error("Infrastructure Initialization Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) initializeProjectData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.patch(`/api/update-project/${id}`, formData);
      router.push("/dashboard/projects");
    } catch (err) {
      console.error("Update Sequence Aborted:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-black">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
          >
            <RiArrowLeftLine /> Return_To_Architecture
          </button>
          <div className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
            Node_ID: <span className="text-primary">{id?.slice(-8)}</span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Core */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d0d0d] border border-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              {/* Top Accent Line (Dynamic Color) */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
                style={{ backgroundColor: formData.color }}
              />

              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <RiSettings3Line size={24} className="text-slate-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                    Node_Configuration
                  </h1>
                  <p className="text-xs text-slate-600 font-mono">
                    Editing project deployment parameters.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Project Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                    Project Identity
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

                {/* Workspace Association */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                    <RiLayout4Line /> Parent Workspace
                  </label>
                  <select
                    className="select w-full bg-slate-950 border-slate-800 focus:border-primary/40 rounded-xl text-sm font-semibold h-14"
                    value={formData.workSpaceId}
                    onChange={(e) =>
                      setFormData({ ...formData, workSpaceId: e.target.value })
                    }
                    required
                  >
                    {workSpaces.map((ws) => (
                      <option key={ws._id} value={ws._id}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technical Description */}
                <div className="space-y-3 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                    <RiTerminalBoxLine /> Project_Documentation
                  </label>
                  <textarea
                    className="textarea w-full bg-slate-950/50 border-slate-800 focus:border-primary/30 min-h-[200px] rounded-2xl p-6 font-mono text-sm leading-relaxed"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter technical scope..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Identity Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#0d0d0d] border border-slate-900 rounded-[2rem] p-8 shadow-xl">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 block mb-6 flex items-center gap-2">
                <RiPaletteLine /> Color_Signature
              </label>

              {/* Color Grid Selector */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`h-10 rounded-lg transition-all border-2 ${
                      formData.color === c
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                {/* Custom Hex Input */}
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-10 bg-transparent border-none cursor-pointer rounded-lg"
                />
              </div>

              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 tracking-widest uppercase">
                  <RiInformationLine className="text-primary" /> Visual Metadata
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                  This signature color will define the project's glow and
                  iconography across the dashboard.
                </p>
              </div>
            </div>

            {/* Sticky Execution Actions */}
            <div className="sticky top-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary h-16 rounded-2xl text-xs font-black tracking-[0.3em] uppercase italic shadow-2xl transition-all active:scale-[0.98] group"
              >
                {isUpdating ? (
                  <span className="loading loading-dots"></span>
                ) : (
                  <>
                    <RiSaveLine
                      size={18}
                      className="group-hover:translate-y-[-2px] transition-transform"
                    />
                    Commit_Project_Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn bg-slate-950 border-slate-900 text-slate-500 hover:text-white h-14 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all"
              >
                Abort_Edits
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProjectPage;
