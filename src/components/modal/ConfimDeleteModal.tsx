"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiAlertFill,
  RiCloseLine,
  RiDeleteBin7Line,
  RiInformationLine,
} from "react-icons/ri";

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
          {/* Backdrop with Heavy Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Architecture */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0d0d0d] border border-red-500/20 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]"
          >
            {/* Top Danger Indicator */}
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500">
                  <RiAlertFill size={28} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3 mb-8">
                <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                  {title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  You are about to initiate a terminal purge of{" "}
                  <span className="text-red-400 font-bold">"{itemName}"</span>.
                  This action cannot be reversed within the current neural
                  branch.
                </p>
              </div>

              {/* Warning Context Box */}
              <div className="flex gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl mb-8">
                <RiInformationLine className="text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider leading-tight">
                  All associated metadata, sub-tasks, and project logs will be
                  permanently de-indexed from the database.
                </p>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="btn bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 h-14 rounded-xl font-black tracking-widest text-[10px] uppercase transition-all"
                >
                  Abort_Purge
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="btn btn-error h-14 rounded-xl font-black italic tracking-widest text-[10px] uppercase shadow-lg shadow-red-500/20 border-none group"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <RiDeleteBin7Line className="group-hover:shake" />
                      Confirm_Delete
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
