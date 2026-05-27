"use client";

import React from "react";
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
} from "react-icons/ri";
import ThemeToggle from "../ui/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isPending } = useSession();
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <RiLayoutGridLine size={22} />,
    },
    { name: "Tasks", href: "/dashboard/tasks", icon: <RiTaskLine size={22} /> },
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
        <div className="flex justify-center items-center gap-2">
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
