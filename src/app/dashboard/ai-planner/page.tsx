"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RiMagicLine,
  RiBriefcase4Line,
  RiAlarmWarningLine,
  RiSparklingLine,
  RiCheckDoubleLine,
} from "react-icons/ri";
import axios from "axios";

export default function DedicatedAIPlanner() {
  const [promptText, setPromptText] = useState("");
  const [focusArea, setFocusArea] = useState("Frontend Development");
  const [priority, setPriority] = useState("Medium");
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSteps([]);

    try {
      const { data } = await axios.post("/api/ai-planner", {
        promptText,
        focusArea,
        priority,
      });
      setSteps(data.steps);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage(
          "An unexpected network error occurred. Please check configuration.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="border-b border-slate-900 pb-6">
          <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <RiSparklingLine /> Advanced Operations
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Strategy Planner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate structural execution steps optimized for tech builds and
            business operations.
          </p>
        </div>

        {/* Workspace Splitting Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Config Controls */}
          <form
            onSubmit={handleGenerateStrategy}
            className="lg:col-span-5 space-y-4 bg-[#0d0d0d] border border-slate-900 rounded-3xl p-6 shadow-xl"
          >
            {/* Context Inputs */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Objective Context
              </label>
              <textarea
                required
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe your project milestone or workflow target (e.g., Optimize mobile product card grids for faster loading values)..."
                className="textarea w-full bg-black border-slate-900 focus:border-primary min-h-[120px] rounded-xl p-4 text-xs font-medium leading-relaxed text-white transition-all outline-none resize-none"
              />
            </div>

            {/* Focus Scope Option */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Task Category Domain
              </label>
              <div className="relative">
                <RiBriefcase4Line className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="select w-full pl-11 bg-black border-slate-900 focus:border-primary rounded-xl text-xs font-bold h-12 outline-none"
                >
                  <option value="Daily Routine & Habits">
                    Daily Routine & Habits
                  </option>
                  <option value="Work & Core Projects">
                    Work & Core Projects
                  </option>
                  <option value="Health & Lifestyle">Health & Lifestyle</option>
                  <option value="Business Operations">
                    Business Operations
                  </option>
                  <option value="Errands & Life Admin">
                    Errands & Life Admin
                  </option>
                </select>
              </div>
            </div>

            {/* Priority Weighting Option */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Strategy Priority
              </label>
              <div className="relative">
                <RiAlarmWarningLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="select w-full pl-11 bg-black border-slate-900 focus:border-primary rounded-xl text-xs font-bold h-12 outline-none"
                >
                  <option value="Low Tier">Low Tier</option>
                  <option value="Medium Standard">Medium Standard</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Mission Critical">Mission Critical</option>
                </select>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={loading || !promptText.trim()}
              className="btn btn-primary w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-20 mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <RiMagicLine /> Compile Strategy Plan
                </span>
              )}
            </button>
          </form>

          {/* Outputs Panel Space */}
          <div className="lg:col-span-7 space-y-4">
            {/* Guardrail Rejection Handler */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium leading-relaxed animate-in fade-in duration-300">
                {errorMessage}
              </div>
            )}

            {/* Standard Initialization State */}
            {!loading && steps.length === 0 && !errorMessage && (
              <div className="border border-dashed border-slate-900 rounded-3xl p-12 text-center text-slate-600">
                <RiMagicLine className="mx-auto mb-3" size={24} />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Awaiting Strategy Parameters
                </p>
                <p className="text-[11px] text-slate-700 mt-1 max-w-xs mx-auto">
                  Configure the target metrics on the left panel to execute
                  workflow rendering.
                </p>
              </div>
            )}

            {/* Loading Indicator Blueprint */}
            {loading && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-16 bg-[#0d0d0d] border border-slate-900 rounded-xl w-full"
                  />
                ))}
              </div>
            )}

            {/* Rendered Step Workflows */}
            {steps.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500 mb-1 ml-1">
                  <RiCheckDoubleLine size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Calculated Pipeline Steps
                  </span>
                </div>
                {steps.map((step, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    key={index}
                    className="flex gap-4 items-center bg-[#0d0d0d] border border-slate-900 rounded-2xl p-4 shadow-sm hover:border-slate-800 transition-colors"
                  >
                    <div className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 w-6 h-6 flex items-center justify-center rounded-lg shrink-0">
                      0{index + 1}
                    </div>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
