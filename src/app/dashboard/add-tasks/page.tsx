"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiAddLine,
  RiText,
  RiHashtag,
  RiFolderLine,
  RiLayout4Line,
  RiArrowLeftLine,
} from "react-icons/ri";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

const AddTaskPage = () => {
  const router = useRouter();
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [workSpaces, setWorkSpaces] = useState<unknown[]>([]);
  const [projects, setProjects] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get("/api/get-workspace");
        setWorkSpaces(response.data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/get-project");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchWorkspaces();
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await authClient.getSession();
        console.log(data);
        setSession(data);
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    workSpaceId: "",
    status: "todo", // Default status
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/add-task",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Submitting Task:", formData);
      router.push("/tasks");
    } catch (error) {
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="btn btn-ghost btn-sm gap-2 mb-6 text-base-content/60 hover:text-primary"
      >
        <RiArrowLeftLine /> Back to Workspace
      </button>

      <div className="card bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <RiAddLine size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Create New Task
              </h1>
              <p className="text-sm text-base-content/50">
                Define your next execution step
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="form-control">
              <label className="label font-semibold text-sm">Task Title</label>
              <div className="relative">
                <RiText className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Integrate Gemini API"
                  className="input input-bordered w-full pl-11 focus:input-primary bg-base-200/50"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-control flex flex-col">
              <label className="label font-semibold text-sm">Description</label>
              <textarea
                required
                placeholder="Describe the objective and expected outcome..."
                className="textarea textarea-bordered focus:textarea-primary bg-base-200/50 min-h-[120px] pt-4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workspace ID (Usually hidden or pre-selected) */}
              <div className="form-control">
                <label className="label font-semibold text-sm">Workspace</label>
                <div className="relative">
                  <RiLayout4Line className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                  <select
                    className="select select-bordered w-full pl-11 bg-base-200/50"
                    value={formData.workSpaceId}
                    onChange={(e) =>
                      setFormData({ ...formData, workSpaceId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Workspace
                    </option>
                    {workSpaces.map((item) => (
                      <option key={item?._id} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project ID */}
              <div className="form-control">
                <label className="label font-semibold text-sm">Project</label>
                <div className="relative">
                  <RiFolderLine className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                  <select
                    className="select select-bordered w-full pl-11 bg-base-200/50"
                    value={formData.projectId}
                    onChange={(e) =>
                      setFormData({ ...formData, projectId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Assign Project
                    </option>
                    {projects.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status Selector */}
            <div className="form-control">
              <label className="label font-semibold text-sm">
                Initial Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["todo", "in-progress", "review", "completed"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`btn btn-sm rounded-full capitalize ${
                      formData.status === s
                        ? "btn-primary"
                        : "btn-ghost bg-base-200 text-base-content/60"
                    }`}
                  >
                    {s.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider opacity-50"></div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-8 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddTaskPage;
