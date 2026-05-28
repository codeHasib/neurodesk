"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiFolderLine,
  RiLayout4Line,
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiUserReceived2Line,
} from "react-icons/ri";
import axios from "axios";

const AddTaskPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workSpaces, setWorkSpaces] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [currentMembers, setCurrentMembers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    workSpaceId: "",
    assignedTo: "",
    status: "todo",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wsRes, projRes] = await Promise.all([
          axios.get("/api/get-workspace"),
          axios.get("/api/get-project"),
        ]);
        setWorkSpaces(wsRes.data?.workspaces || []);
        setAllProjects(projRes.data || []);
      } catch (err) {
        console.error("Context fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWorkspaceChange = (wsId: string) => {
    const selectedWs = workSpaces.find((ws) => ws._id === wsId);
    setFormData({
      ...formData,
      workSpaceId: wsId,
      projectId: "",
      assignedTo: "",
    });
    setFilteredProjects(allProjects.filter((p) => p.workSpaceId === wsId));
    setCurrentMembers(selectedWs?.members || []);
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

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen p-4 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors mb-2"
            >
              <RiArrowLeftLine /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create New Task
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#0d0d0d] border border-slate-900 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Task Name
              </label>
              <input
                type="text"
                required
                placeholder="What needs to be done?"
                className="w-full bg-black border border-slate-900 focus:border-primary rounded-xl p-4 text-sm font-medium text-white transition-all outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Workspace
                </label>
                <div className="relative">
                  <RiLayout4Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <select
                    className="select w-full pl-11 bg-black border-slate-900 focus:border-primary rounded-xl text-xs font-bold h-12 outline-none"
                    value={formData.workSpaceId}
                    onChange={(e) => handleWorkspaceChange(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Workspace
                    </option>
                    {workSpaces.map((ws) => (
                      <option key={ws._id} value={ws._id}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Project
                </label>
                <div className="relative">
                  <RiFolderLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <select
                    className="select w-full pl-11 bg-black border-slate-900 focus:border-primary rounded-xl text-xs font-bold h-12 outline-none"
                    value={formData.projectId}
                    onChange={(e) =>
                      setFormData({ ...formData, projectId: e.target.value })
                    }
                    disabled={!formData.workSpaceId}
                    required
                  >
                    <option value="" disabled>
                      {formData.workSpaceId
                        ? "Select Project"
                        : "Pick Workspace First"}
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

            {/* Assignee */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Assign To
              </label>
              <div className="relative">
                <RiUserReceived2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <select
                  className="select w-full pl-11 bg-black border-slate-900 focus:border-primary rounded-xl text-xs font-bold h-12 outline-none"
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                  disabled={!formData.workSpaceId}
                >
                  <option value="">Unassigned</option>
                  {currentMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Description
              </label>
              <textarea
                required
                placeholder="Provide task details..."
                className="textarea w-full bg-black border-slate-900 focus:border-primary min-h-[120px] rounded-xl p-4 text-sm leading-relaxed text-white transition-all outline-none resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Status Tabs */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Initial Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["todo", "in-progress", "review", "completed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      formData.status === s
                        ? "bg-primary border-primary text-white shadow-lg"
                        : "bg-black text-slate-500 border-slate-900 hover:border-slate-700"
                    }`}
                  >
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !formData.projectId}
              className="btn btn-primary py-4 flex-1 h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-20"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Task"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost h-14 px-8 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest border border-slate-900 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTaskPage;
