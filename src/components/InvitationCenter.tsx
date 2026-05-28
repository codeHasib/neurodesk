"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiNotification3Line,
  RiCloseLine,
  RiGroupLine,
  RiInboxArchiveLine,
} from "react-icons/ri";
import { useInvitations } from "@/hooks/useInvitations";
import axios from "axios";
import { toast } from "react-hot-toast";

// 1. Portal Helper to escape parent stacking contexts
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
};

const InvitationCenter = () => {
  const { invitations, setInvitations } = useInvitations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "accept" | "reject") => {
    setProcessingId(id);
    try {
      if (action === "accept") {
        await axios.post("/api/invitations/accept", { invitationId: id });
        toast.success("Access Granted. Workspace Initialized.");
      } else {
        await axios.delete(`/api/invitations/${id}`);
        toast.error("Invitation Terminated.");
      }
      // Optimistic UI Update
      setInvitations((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err) {
      toast.error("Operation Failed.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button - Stays in the Navbar flow */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary transition-all group"
      >
        <span className="flex justify-start items-center gap-2  font-bold text-slate-400 px-4">
          <RiNotification3Line
            size={20}
            className="text-slate-400 group-hover:text-primary transition-colors"
          />
          <p className="md:block hidden">Invitations</p>
        </span>
        {invitations.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-black items-center justify-center text-black">
              {invitations.length}
            </span>
          </span>
        )}
      </button>

      {/* Modal - Teleported to document.body */}
      <Portal>
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[999999]">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Content Card */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%", y: "-50%" }}
                className="absolute left-1/2 top-1/2 w-full max-w-md p-4"
              >
                <div className="bg-[#0c0c0c] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
                  {/* Header */}
                  <div className="p-8 border-b border-slate-900 flex justify-between items-center bg-slate-950/50">
                    <div>
                      <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                        Incoming_Invites
                      </h2>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                        Pending Connection Requests
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-slate-900 rounded-full text-slate-500 transition-colors"
                    >
                      <RiCloseLine size={24} />
                    </button>
                  </div>

                  {/* List Container */}
                  <div className="max-h-[400px] overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                    {invitations.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                        <RiInboxArchiveLine
                          size={48}
                          className="mb-4 text-primary"
                        />
                        <p className="text-xs font-mono uppercase tracking-[0.2em]">
                          Signal_Silent
                        </p>
                      </div>
                    ) : (
                      invitations.map((invite: any) => (
                        <motion.div
                          layout
                          key={invite._id}
                          className="p-5 bg-slate-950/50 border border-slate-900 rounded-2xl flex flex-col gap-4 group hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                              <RiGroupLine size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-white italic uppercase tracking-tight">
                                {invite.workspaceId?.name || "Shared Workspace"}
                              </p>
                              <p className="text-[9px] font-mono text-slate-500 uppercase">
                                Access_Level: {invite.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              disabled={!!processingId}
                              onClick={() => handleAction(invite._id, "accept")}
                              className="flex-1 btn btn-sm h-11 bg-primary text-black hover:bg-primary/90 border-none rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                            >
                              {processingId === invite._id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Accept_Join"
                              )}
                            </button>
                            <button
                              disabled={!!processingId}
                              onClick={() => handleAction(invite._id, "reject")}
                              className="p-3 bg-slate-900 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-slate-800"
                            >
                              <RiCloseLine size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-900 text-center">
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
                      Secure Node: {invitations.length} Active Signals
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};

export default InvitationCenter;
