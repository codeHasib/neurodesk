"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  RiSettings3Line,
  RiArrowLeftLine,
  RiSaveLine,
  RiLayout4Line,
  RiFolderLine,
  RiInformationLine,
  RiTerminalBoxLine,
} from "react-icons/ri";
import axios from "axios";

const EditTaskPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Data Contexts
  const [workSpaces, setWorkSpaces] = useState<unknown[]>([]);
  const [allProjects, setAllProjects] = useState<unknown[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<unknown[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    workSpaceId: "",
    status: "",
  });

  useEffect(() => {
    const fetchInitializationData = async () => {
      try {
        setLoading(true);
        const [wsRes, projRes, taskRes] = await Promise.all([
          axios.get("/api/get-workspace"),
          axios.get("/api/get-project"),
          axios.get(`/api/get-task/${id}`), // Ensure your API supports single task fetch
        ]);

        setWorkSpaces(wsRes.data);
        setAllProjects(projRes.data);

        const currentTask = taskRes.data;
        setFormData({
          title: currentTask.title,
          description: currentTask.description,
          projectId: currentTask.projectId,
          workSpaceId: currentTask.workSpaceId,
          status: currentTask.status,
        });

        // Seed initial filtered projects based on the task's current workspace
        setFilteredProjects(
          projRes.data.filter(
            (p: unknown) => p.workSpaceId === currentTask.workSpaceId,
          ),
        );
      } catch (err) {
        console.error("System Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInitializationData();
  }, [id]);

  const handleWorkspaceChange = (wsId: string) => {
    setFormData({ ...formData, workSpaceId: wsId, projectId: "" });
    setFilteredProjects(allProjects.filter((p) => p.workSpaceId === wsId));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.patch(`/api/update-task/${id}`, formData);
      router.push("/dashboard/tasks");
    } catch (err) {
      console.error("Update Sequence Failed:", err);
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Navigation & Status */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all"
          >
            <RiArrowLeftLine /> Back_To_Matrix
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
              Entity_Editor_V2
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="grid lg:grid-cols-3 gap-8">
          {/* Main Controls (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d0d0d] border border-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <RiSettings3Line size={24} className="text-slate-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                    Modify_Payload
                  </h1>
                  <p className="text-xs text-slate-600 font-mono">ID: {id}</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Title */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Label Identity
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-transparent border-none text-4xl font-bold placeholder:text-slate-800 focus:ring-0 p-0 text-white"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Selectors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                      <RiLayout4Line /> Node Workspace
                    </label>
                    <select
                      className="select w-full bg-slate-950 border-slate-800 focus:border-primary/40 rounded-xl text-sm font-semibold h-14"
                      value={formData.workSpaceId}
                      onChange={(e) => handleWorkspaceChange(e.target.value)}
                    >
                      {workSpaces.map((ws) => (
                        <option key={ws._id} value={ws._id}>
                          {ws.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                      <RiFolderLine /> Assigned Project
                    </label>
                    <select
                      className="select w-full bg-slate-950 border-slate-800 focus:border-primary/40 rounded-xl text-sm font-semibold h-14"
                      value={formData.projectId}
                      onChange={(e) =>
                        setFormData({ ...formData, projectId: e.target.value })
                      }
                      disabled={!formData.workSpaceId}
                    >
                      {filteredProjects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                    <RiTerminalBoxLine /> Execution_Notes
                  </label>
                  <textarea
                    required
                    className="textarea w-full bg-slate-950/50 border-slate-800 focus:border-primary/30 min-h-[250px] rounded-2xl p-6 font-mono text-sm leading-relaxed"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings (1 Column) */}
          <div className="space-y-6">
            <div className="bg-[#0d0d0d] border border-slate-900 rounded-[2rem] p-8 shadow-xl">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 block mb-6">
                Execution Phase
              </label>
              <div className="flex flex-col gap-3">
                {["todo", "in-progress", "review", "completed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`flex items-center justify-between px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.status === s
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-black border-slate-900 text-slate-600 hover:border-slate-700"
                    }`}
                  >
                    {s.replace("-", " ")}
                    {formData.status === s && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-10 p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 tracking-widest uppercase">
                  <RiInformationLine className="text-primary" /> System Info
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                  Changes will sync immediately across all connected neural
                  nodes.
                </p>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky top-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary h-16 rounded-2xl text-xs font-black tracking-[0.3em] uppercase italic shadow-2xl transition-all active:scale-[0.98] group"
              >
                {isUpdating ? (
                  <span className="loading loading-bars"></span>
                ) : (
                  <>
                    <RiSaveLine
                      size={18}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    Apply_Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn bg-slate-950 border-slate-900 text-slate-500 hover:text-white hover:bg-slate-900 h-14 rounded-2xl text-[10px] font-black tracking-widest uppercase"
              >
                Discard_Edits
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTaskPage;
