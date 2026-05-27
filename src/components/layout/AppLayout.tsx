"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import {
  RiHomeOfficeLine,
  RiMenu3Line,
  RiLayoutGridLine,
  RiTaskLine,
  RiCalendarTodoLine,
  RiSettings3Line,
  RiSearch2Line,
  RiLogoutBoxRLine,
  RiSparklingLine,
  RiAddFill,
  RiAddBoxFill,
  RiTeamFill,
  RiSuitcase2Fill,
  RiUserLine,
  RiShutDownLine,
  RiCompass3Line,
  RiShieldCheckLine,
} from "react-icons/ri";
import ThemeToggle from "../ui/ThemeToggle";
import { AnimatePresence, motion } from "motion/react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useSession();

  // Extract first letter safely
  const userInitial = data?.user?.name ? data.user.name[0].toUpperCase() : "U";
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <RiLayoutGridLine size={22} />,
    },
    { name: "Tasks", href: "/dashboard/tasks", icon: <RiTaskLine size={22} /> },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <RiSuitcase2Fill size={22} />,
    },
    {
      name: "Workspace",
      href: "/dashboard/workspaces",
      icon: <RiHomeOfficeLine size={22} />,
    },
    {
      name: "AI Planner",
      href: "/planner",
      icon: <RiSparklingLine size={22} />,
    },
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: <RiCalendarTodoLine size={22} />,
    },
    {
      name: "Add Tasks",
      href: "/dashboard/add-tasks",
      icon: <RiAddFill size={22} />,
    },
    {
      name: "Add Projects",
      href: "/dashboard/add-projects",
      icon: <RiAddBoxFill size={22} />,
    },
    {
      name: "Add Workspace",
      href: "/dashboard/add-workspace",
      icon: <RiTeamFill size={22} />,
    },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col lg:flex-row antialiased">
      {/* ========================================================
          DESKTOP SIDEBAR (Visible only on large screens)
         ======================================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300 h-screen sticky top-0 shrink-0">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-base-300 gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <RiHomeOfficeLine size={22} />
          </div>
          <span className="text-xl font-bold italic tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NeuroDesk
          </span>
          <div className="badge badge-xs badge-outline border-primary/30 text-primary text-[9px] uppercase px-1 font-semibold tracking-wider ml-auto">
            Beta
          </div>
        </div>

        {/* Dynamic Quick Search Button */}
        <div className="p-4">
          <button className="btn btn-sm btn-block justify-start gap-3 bg-base-200 border-none hover:bg-base-300/70 font-normal normal-case text-base-content/50 relative">
            <RiSearch2Line size={16} />
            <span>Search workspace...</span>
            <kbd className="kbd kbd-xs absolute right-2 bg-base-100 text-[10px]">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/10"
                    : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <span
                  className={`${isActive ? "text-primary-content" : "text-base-content/60 group-hover:text-primary transition-colors"}`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Utility Section */}
        <div className="p-4 border-t border-base-300 space-y-2">
          <Link
            href="/settings"
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/settings"
                ? "bg-base-200 text-primary"
                : "text-base-content/60 hover:bg-base-200"
            }`}
          >
            <RiSettings3Line size={18} />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <RiLogoutBoxRLine size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MOBILE TOP NAVBAR (Visible only on small screens)
         ======================================================== */}
      <header className="lg:hidden flex items-center justify-between h-16 bg-base-100 px-4 border-b border-base-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <RiHomeOfficeLine size={18} />
          </div>
          <span className="text-lg font-bold italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NeuroDesk
          </span>
        </div>

        {/* Mobile Dropdown Avatar Menu */}
        {/* <div className="flex justify-center items-center gap-2">
          <div>
            <ThemeToggle></ThemeToggle>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar placeholder btn btn-ghost btn-circle btn-sm"
            >
              <button
                disabled={isPending}
                className="bg-neutral text-neutral-content rounded-full h-7 w-10 flex justify-center items-center"
              >
                <span className="text-xs">
                  {isPending ? (
                    <span className="loading loading-spinner text-secondary"></span>
                  ) : (
                    data?.user.name[0].toUpperCase()
                  )}
                </span>
              </button>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[50] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-xl w-52 border border-base-300"
            >
              <li className="menu-title text-xs font-bold text-base-content/40 uppercase">
                HI, {data?.user.name}
              </li>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
              <div className="divider my-1"></div>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="flex justify-center items-center gap-4">
          {/* Theme Toggle Wrapper */}
          <div className="hover:scale-105 transition-transform duration-200">
            <ThemeToggle />
          </div>

          {/* Interactive Dropdown Module */}
          <div className="relative">
            {/* Trigger Avatar Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isPending}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none group ${
                isOpen
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-95"
                  : "hover:scale-105"
              }`}
              style={{ width: "36px", height: "36px" }}
            >
              {/* Subtle Dynamic Ping Aura */}
              <span className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 pointer-events-none" />

              {/* Avatar Base */}
              <div className="w-full h-full rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-xs text-white shadow-lg overflow-hidden">
                {isPending ? (
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                ) : (
                  <span className="relative z-10 text-slate-200 group-hover:text-primary transition-colors">
                    {userInitial}
                  </span>
                )}
              </div>

              {/* Online Connection Pill */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full" />
            </button>

            {/* Animated Popout Console */}
            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Invisible Click Overlay to Close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 bg-[#09090b] border border-slate-900 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-xl"
                  >
                    {/* Header User Identity Module */}
                    <div className="px-3 py-3 mb-2 bg-slate-950/60 border border-slate-900/40 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-center text-primary font-mono font-bold text-xs">
                        {userInitial}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Authenticated Node
                        </p>
                        <h4 className="text-xs font-bold text-white truncate italic uppercase tracking-tight">
                          {data?.user?.name || "System_User"}
                        </h4>
                      </div>
                    </div>

                    {/* Main Dynamic Operations Menu Items */}
                    <ul className="space-y-0.5 text-xs font-medium text-slate-400">
                      <div className="px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-slate-600 flex items-center gap-1.5">
                        <RiCompass3Line /> Navigation
                      </div>

                      {menuItems?.map((item: any) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all group"
                          >
                            <RiUserLine
                              size={14}
                              className="text-slate-600 group-hover:text-primary transition-colors"
                            />
                            <span className="font-mono text-[11px] uppercase tracking-wider">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))}

                      <div className="h-[1px] bg-slate-900/60 my-2 mx-2" />

                      <div className="px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-slate-600 flex items-center gap-1.5">
                        <RiShieldCheckLine /> System_Core
                      </div>

                      {/* Settings Node */}
                      <li>
                        <Link
                          href="/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all group"
                        >
                          <RiSettings3Line
                            size={14}
                            className="text-slate-600 group-hover:text-white transition-colors"
                          />
                          <span className="font-mono text-[11px] uppercase tracking-wider">
                            Settings
                          </span>
                        </Link>
                      </li>

                      {/* Logout Directive Trigger */}
                      <li>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-950/20 text-slate-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition-all group text-left"
                        >
                          <RiShutDownLine
                            size={14}
                            className="text-slate-600 group-hover:text-red-400 transition-colors"
                          />
                          <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                            Terminate_Session
                          </span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN APP CONTENT CONTAINER
         ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {/* Content injects here */}
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
