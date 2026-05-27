"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiText,
  RiFolderLine,
  RiLayout4Line,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiFlashlightLine,
} from "react-icons/ri";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

const AddTaskPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workSpaces, setWorkSpaces] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    workSpaceId: "",
    status: "todo",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wsRes, projRes] = await Promise.all([
          axios.get("/api/get-workspace"),
          axios.get("/api/get-project"),
        ]);
        setWorkSpaces(wsRes.data);
        setAllProjects(projRes.data);
      } catch (err) {
        console.error("Context fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWorkspaceChange = (wsId: string) => {
    setFormData({ ...formData, workSpaceId: wsId, projectId: "" });
    setFilteredProjects(allProjects.filter((p) => p.workSpaceId === wsId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/add-task", formData);
      router.push("/dashboard/tasks");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-primary selection:text-white p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-primary transition-all"
          >
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
            Terminal / Root
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-mono text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            System Live
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          {/* Glowing Aura Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-2xl opacity-20 group-focus-within:opacity-40 transition-opacity duration-700"></div>

          <div className="relative bg-[#0d0d0d] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Top Bar Decoration */}
            <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

            <div className="p-8 lg:p-12 space-y-10">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800/50 pb-8">
                <div>
                  <h1 className="text-4xl font-black italic tracking-tighter text-white">
                    Deploy Task
                  </h1>
                  <p className="text-slate-500 font-medium mt-1">
                    Specify a new execution unit for the core system.
                  </p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                  <RiFlashlightLine size={28} className="text-primary" />
                </div>
              </div>

              {/* Input Core */}
              <div className="space-y-8">
                {/* Title Section */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2">
                    <RiCheckboxCircleLine /> Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Task identity..."
                    className="w-full bg-transparent text-sm font-bold placeholder:text-slate-800 focus:ring-0 p-4 rounded-full text-white transition-all border border-slate-800 focus:border-primary"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Grid Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      Context Workspace
                    </label>
                    <div className="relative group/select">
                      <RiLayout4Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/select:text-primary transition-colors" />
                      <select
                        className="select w-full pl-12 bg-slate-900/50 border-slate-800 focus:border-primary rounded-xl text-sm font-semibold h-14"
                        value={formData.workSpaceId}
                        onChange={(e) => handleWorkspaceChange(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select Node
                        </option>
                        {workSpaces.map((ws) => (
                          <option key={ws._id} value={ws._id}>
                            {ws.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                      Target Project
                    </label>
                    <div className="relative group/select">
                      <RiFolderLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/select:text-primary transition-colors" />
                      <select
                        className="select w-full pl-12 bg-slate-900/50 border-slate-800 focus:border-primary rounded-xl text-sm font-semibold h-14"
                        value={formData.projectId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectId: e.target.value,
                          })
                        }
                        disabled={!formData.workSpaceId}
                        required
                      >
                        <option value="" disabled>
                          {formData.workSpaceId
                            ? "Choose Mission"
                            : "Unlock Workspace First"}
                        </option>
                        {filteredProjects.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description - The "Monospace" Look */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    Documentation
                  </label>
                  <textarea
                    required
                    placeholder="Provide technical scope and requirements..."
                    className="textarea w-full bg-slate-900/30 border-slate-800 focus:border-primary/50 min-h-[180px] rounded-2xl p-6 font-mono text-sm leading-relaxed placeholder:text-slate-800 transition-all resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Status Toggles */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    Execution Phase
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["todo", "in-progress", "review", "completed"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.status === s
                            ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--p),0.4)]"
                            : "bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        {s.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-800/50">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.projectId}
                  className="btn btn-primary flex-1 h-16 rounded-2xl text-lg font-black italic tracking-widest shadow-2xl active:scale-[0.98] transition-transform disabled:opacity-30"
                >
                  {isSubmitting ? (
                    <span className="loading loading-ring"></span>
                  ) : (
                    "EXECUTE_DEPLOYMENT"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-ghost h-16 px-10 rounded-2xl text-slate-500 font-bold hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                >
                  DISCARD
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTaskPage;
