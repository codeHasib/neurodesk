"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  RiHomeSmile2Line,
  RiUserAddLine,
  RiCloseLine,
  RiShieldUserLine,
  RiArrowRightLine,
  RiBuilding3Line,
  RiAdminLine,
  RiUserLine,
} from "react-icons/ri";

const AddWorkspacePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("member");
  // Updated state to handle the new member structure
  const [members, setMembers] = useState<{ email: string; role: string }[]>([]);

  const addMember = () => {
    if (emailInput && !members.find((m) => m.email === emailInput)) {
      setMembers([...members, { email: emailInput, role: roleInput }]);
      setEmailInput("");
      setRoleInput("member"); // Reset role to default
    }
  };

  const removeMember = (email: string) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This API will now create the workspace AND the invitations
      const response = await fetch("/api/add-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, invitedMembers: members }),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Workspace creation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-xl bg-base-100 border border-base-300 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="card-body p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-primary/10 text-primary rounded-2xl mb-4">
              <RiHomeSmile2Line size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">
              New_Workspace
            </h1>
            <p className="text-base-content/50 mt-2 font-mono text-xs uppercase tracking-widest">
              Team Collaboration Hub
            </p>
          </div>

          <div className="space-y-8">
            {/* Workspace Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase tracking-[0.2em] text-[10px] text-base-content/40">
                  Workspace Name
                </span>
              </label>
              <div className="relative">
                <RiBuilding3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  placeholder="e.g. GreeCir Creative"
                  className="input input-lg input-bordered w-full pl-12 focus:input-primary bg-base-200/30 font-bold italic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Members Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-black uppercase tracking-[0.2em] text-[10px] text-base-content/40">
                  Invite Team Members
                </span>
              </label>
              <div className="flex flex-col gap-3 p-4 bg-base-200/50 rounded-2xl border border-base-300/50">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="teammate@email.com"
                    className="input input-bordered flex-1 bg-base-100"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <select
                    className="select select-bordered bg-base-100 font-bold text-xs uppercase"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="btn btn-primary btn-sm h-10 w-full gap-2 font-black uppercase tracking-widest text-[10px]"
                >
                  <RiUserAddLine /> Add_To_Invite_List
                </button>
              </div>

              {/* Member List Chips */}
              <div className="flex flex-col gap-2 mt-6">
                <AnimatePresence>
                  {members.map((member) => (
                    <motion.div
                      key={member.email}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-between p-3 bg-base-100 border border-base-300 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${member.role === "admin" ? "bg-primary/10 text-primary" : "bg-base-300 text-base-content/50"}`}
                        >
                          {member.role === "admin" ? (
                            <RiAdminLine size={16} />
                          ) : (
                            <RiUserLine size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold truncate max-w-[150px]">
                            {member.email}
                          </p>
                          <p className="text-[9px] uppercase font-black tracking-tighter opacity-40">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member.email)}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      >
                        <RiCloseLine size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="divider my-8 opacity-50 font-mono text-[9px] uppercase tracking-[0.3em]">
            Execution
          </div>

          {/* Submission */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`btn btn-primary h-14 rounded-2xl gap-3 shadow-xl shadow-primary/20 font-black uppercase tracking-widest italic ${loading ? "loading" : ""}`}
              disabled={loading || !name}
            >
              {loading ? "Allocating_Resources..." : "Initialize_Workspace"}
              {!loading && <RiArrowRightLine />}
            </button>
            <p className="text-[10px] text-center font-mono text-base-content/30 uppercase tracking-tighter leading-tight">
              You will be assigned as{" "}
              <span className="text-primary font-bold">Root_Admin</span>.
              <br />
              Invited members will receive a notification to join.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddWorkspacePage;
