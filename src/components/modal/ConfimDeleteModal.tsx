"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiAlertLine, RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Soft, deep backdrop dynamic blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Simplified Premium Container */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 8 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Main Interactive Container */}
            <div className="p-6">
              {/* Header Configuration */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/10 shrink-0">
                    <RiAlertLine size={22} />
                  </div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">
                    {title || "Confirm Deletion"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all shrink-0"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>

              {/* Action Body Content */}
              <div className="mb-6 pl-1">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="text-slate-200 font-medium font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 mx-0.5">
                    {itemName}
                  </span>
                  ? This action is permanent and cannot be undone.
                </p>
              </div>

              {/* High-Performance Micro-Action Grid */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 h-10 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900 transition-all border border-transparent disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-all shadow-md shadow-red-900/20 disabled:opacity-50 group min-w-[120px]"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RiDeleteBin6Line
                        size={16}
                        className="text-white/80 group-hover:scale-105 transition-transform"
                      />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
