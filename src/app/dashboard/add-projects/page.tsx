"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiFolderAddLine,
  RiHashtag,
  RiText,
  RiPaletteLine,
  RiLayout4Line,
  RiArrowLeftLine,
} from "react-icons/ri";
import axios from "axios";

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Green", value: "#10b981" },
  { name: "Slate", value: "#64748b" },
];

const AddProjectPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    workSpaceId: "",
    color: "#3b82f6", // Default blue
    description: "",
  });
  const [workSpaces, setWorkSpaces] = useState<unknown[]>([]);

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
      const response = await fetch("/api/add-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto py-10 px-4"
    >
      {/* Header & Back Link */}
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="btn btn-ghost btn-sm gap-2 mb-4 text-base-content/50 hover:text-primary pl-0"
        >
          <RiArrowLeftLine /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <RiFolderAddLine size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Create Project
            </h1>
            <p className="text-base-content/50">
              Group your tasks under a specific initiative
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Main Info (Left 2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6 space-y-5">
              {/* Project Name */}
              <div className="form-control">
                <label className="label font-bold text-xs uppercase tracking-widest text-base-content/40">
                  Project Name
                </label>
                <div className="relative">
                  <RiHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    placeholder="e.g. Website Redesign"
                    className="input input-bordered w-full pl-11 focus:input-primary bg-base-200/40"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label font-bold text-xs uppercase tracking-widest text-base-content/40">
                  Description
                </label>
                <textarea
                  placeholder="What is the goal of this project?"
                  className="textarea textarea-bordered focus:textarea-primary bg-base-200/40 min-h-[150px] pt-4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings (Right Column) */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6 space-y-6">
              {/* Workspace Selector */}
              <div className="form-control">
                <label className="label font-bold text-xs uppercase tracking-widest text-base-content/40">
                  Workspace
                </label>
                <div className="relative">
                  <RiLayout4Line className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                  <select
                    className="select select-bordered w-full pl-11 bg-base-200/40"
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

              {/* Color Selection */}
              <div className="form-control">
                <label className="label font-bold text-xs uppercase tracking-widest text-base-content/40">
                  Project Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorPresets.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: c.value })
                      }
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                        formData.color === c.value
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.value }}
                    >
                      {formData.color === c.value && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider opacity-50"></div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Launch Project"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost btn-block btn-sm"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProjectPage;
