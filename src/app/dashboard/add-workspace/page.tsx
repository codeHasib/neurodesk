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
} from "react-icons/ri";

const AddWorkspacePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<{ userId: string; role: string }[]>(
    [],
  );

  // Add a member to the local state list
  const addMember = () => {
    if (emailInput && !members.find((m) => m.userId === emailInput)) {
      setMembers([...members, { userId: emailInput, role: "member" }]);
      setEmailInput("");
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.userId !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/add-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          members, // Your schema handles the ownerId on the backend via session
        }),
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
            <h1 className="text-3xl font-black tracking-tight">
              New Workspace
            </h1>
            <p className="text-base-content/50 mt-2">
              The foundation of your team's productivity
            </p>
          </div>

          <div className="space-y-8">
            {/* Workspace Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase tracking-wider text-xs text-base-content/50">
                  Workspace Name
                </span>
              </label>
              <div className="relative">
                <RiBuilding3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  placeholder="e.g. Acme Studio or Personal"
                  className="input input-lg input-bordered w-full pl-12 focus:input-primary bg-base-200/30 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Members Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold uppercase tracking-wider text-xs text-base-content/50">
                  Invite Members (Optional)
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="input input-bordered flex-1 bg-base-200/30"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addMember())
                  }
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="btn btn-primary px-6"
                >
                  Invite
                </button>
              </div>

              {/* Member List Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <AnimatePresence>
                  {members.map((member) => (
                    <motion.div
                      key={member.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="badge badge-lg py-5 px-4 gap-2 bg-base-200 border-base-300"
                    >
                      <RiShieldUserLine className="text-primary" />
                      <span className="text-xs font-medium">
                        {member.userId}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMember(member.userId)}
                        className="hover:text-error transition-colors"
                      >
                        <RiCloseLine size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="divider my-8 opacity-50"></div>

          {/* Submission */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[11px] text-base-content/40 max-w-[200px] text-center sm:text-left leading-tight">
              You will be automatically assigned as the <b>Admin</b> of this
              workspace.
            </p>
            <button
              type="submit"
              className={`btn btn-primary btn-wide sm:btn-md h-12 gap-2 shadow-lg shadow-primary/20 ${loading ? "loading" : ""}`}
              disabled={loading || !name}
            >
              {loading ? "Initializing..." : "Create Workspace"}
              {!loading && <RiArrowRightLine />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddWorkspacePage;
