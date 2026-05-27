"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiFolderAddLine,
  RiHashtag,
  RiText,
  RiLayout4Line,
  RiArrowLeftLine,
  RiInformationLine,
  RiSparklingLine,
} from "react-icons/ri";
import axios from "axios";

const colorPresets = [
  {
    name: "Neon Blue",
    value: "#3b82f6",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  },
  {
    name: "Electric Purple",
    value: "#a855f7",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  },
  {
    name: "Radiant Pink",
    value: "#ec4899",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.5)]",
  },
  {
    name: "Sunset Orange",
    value: "#f97316",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.5)]",
  },
  {
    name: "Emerald",
    value: "#10b981",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  },
  {
    name: "Steel",
    value: "#64748b",
    glow: "shadow-[0_0_15px_rgba(100,116,139,0.5)]",
  },
];

const AddProjectPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [workSpaces, setWorkSpaces] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    workSpaceId: "",
    color: "#3b82f6",
    description: "",
  });

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get("/api/get-workspace");
        setWorkSpaces(response.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/add-project", formData);
      if (response.status === 200) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Project creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-12 px-4 selection:bg-primary selection:text-primary-content">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-sm font-medium text-base-content/40 hover:text-primary transition-all"
            >
              <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
              Return to Nexus
            </button>
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-4 bg-base-100 border border-base-300 rounded-2xl shadow-inner">
                  <RiFolderAddLine size={36} className="text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight italic">
                  Initialize Project
                </h1>
                <p className="text-base-content/50 font-medium">
                  Define a new node in your workspace architecture.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Main Context Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="group relative transition-all">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative card bg-base-100 border border-base-300 shadow-2xl rounded-3xl overflow-hidden">
                <div className="card-body p-8 sm:p-10 space-y-8">
                  {/* Name Input - Stylized */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-primary ml-1">
                      Identity
                    </label>
                    <div className="relative">
                      <RiHashtag className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/20" />
                      <input
                        type="text"
                        placeholder="Project Name..."
                        className="input input-lg w-full pl-14 bg-base-200/50 border-none focus:ring-2 ring-primary/20 font-bold text-xl placeholder:text-base-content/20 transition-all rounded-2xl h-16"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Description - Stylized */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">
                      Core Objectives
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Briefly detail the scope of this mission..."
                        className="textarea textarea-lg w-full bg-base-200/50 border-none focus:ring-2 ring-primary/20 min-h-[220px] rounded-2xl p-6 text-base leading-relaxed placeholder:text-base-content/20 resize-none"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                      <RiText
                        className="absolute right-5 bottom-5 text-base-content/10"
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl">
              <div className="card-body p-8 space-y-8">
                {/* Workspace Select */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40">
                    <RiLayout4Line /> <span>Target Workspace</span>
                  </div>
                  <select
                    className="select select-bordered w-full bg-base-200/50 border-none rounded-xl font-semibold"
                    value={formData.workSpaceId}
                    onChange={(e) =>
                      setFormData({ ...formData, workSpaceId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select parent node
                    </option>
                    {workSpaces.map((item: any) => (
                      <option key={item?._id} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Selection - Custom Radios */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40">
                    <RiSparklingLine /> <span>Visual Identifier</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {colorPresets.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, color: c.value })
                        }
                        className={`group relative h-12 rounded-xl transition-all active:scale-95 ${
                          formData.color === c.value
                            ? `ring-2 ring-primary ring-offset-4 ring-offset-base-100 ${c.glow}`
                            : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                        }`}
                        style={{ backgroundColor: c.value }}
                      >
                        {formData.color === c.value && (
                          <motion.div
                            layoutId="activeColor"
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full h-14 rounded-2xl font-black italic tracking-wider shadow-[0_10px_20px_rgba(var(--p),0.3)] hover:shadow-none transition-all border-none"
                  >
                    {loading ? (
                      <span className="loading loading-ring"></span>
                    ) : (
                      "LAUNCH PROJECT"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-ghost w-full h-14 rounded-2xl text-base-content/30 font-bold hover:text-error hover:bg-error/5"
                  >
                    ABORT MISSION
                  </button>
                </div>
              </div>
            </div>

            {/* Info Hint */}
            <div className="px-2 flex gap-3 text-base-content/30 italic text-xs leading-snug">
              <RiInformationLine size={20} className="shrink-0" />
              <p>
                Projects group tasks and AI analysis logs into a unified
                execution stream.
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProjectPage;
