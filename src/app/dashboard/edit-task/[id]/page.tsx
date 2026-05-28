"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  RiArrowLeftLine,
  RiSaveLine,
  RiInformationLine,
  RiCheckboxCircleLine,
  RiTimerFlashLine,
  RiHistoryLine,
  RiFocus3Line,
} from "react-icons/ri";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditTaskStatusPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-task/${id}`);
        setTaskTitle(res.data.title);
        setStatus(res.data.status || "todo");
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Task not found");
        router.push("/dashboard/tasks");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, router]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Sending ONLY the status in the payload
      await axios.patch(`/api/update-task/${id}`, { status });

      toast.success("Status Updated Successfully");
      router.push("/dashboard/tasks");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data || "Update Failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
          Loading_Task_Context...
        </p>
      </div>
    );

  const statusOptions = [
    { id: "todo", label: "To Do", icon: <RiHistoryLine /> },
    {
      id: "in-progress",
      label: "In Progress",
      icon: <RiFocus3Line className="animate-pulse" />,
    },
    { id: "review", label: "Review", icon: <RiTimerFlashLine /> },
    { id: "completed", label: "Completed", icon: <RiCheckboxCircleLine /> },
  ];

  return (
    <div className="min-h-screen text-slate-200 p-4 lg:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Simple Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all mb-8"
        >
          <RiArrowLeftLine /> Return_to_Matrix
        </button>

        <form onSubmit={handleStatusUpdate} className="space-y-6">
          <div className="bg-[#0d0d0d] border border-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
            {/* Task Info (Locked) */}
            <div className="mb-10 text-center">
              <span className="text-[10px] font-mono text-primary font-bold tracking-[0.4em] uppercase mb-2 block">
                Update Status For
              </span>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                {taskTitle}
              </h1>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStatus(option.id)}
                  className={`flex items-center justify-between px-8 py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                    status === option.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5"
                      : "bg-black border-slate-900 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{option.icon}</span>
                    {option.label}
                  </div>
                  {status === option.id && (
                    <motion.div
                      layoutId="active-dot"
                      className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Warning Box */}
            <div className="mt-8 p-4 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-start gap-4">
              <RiInformationLine className="text-primary mt-1" size={20} />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Changing status will trigger automated notifications for
                workspace members. Metadata, project assignment, and
                descriptions are locked for this session.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-primary h-18 rounded-2xl text-xs font-black tracking-[0.3em] uppercase italic shadow-2xl transition-all active:scale-[0.98] group"
            >
              {isUpdating ? (
                <span className="loading loading-bars"></span>
              ) : (
                <div className="flex items-center gap-2">
                  <RiSaveLine
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Sync_Status_Change
                </div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTaskStatusPage;
