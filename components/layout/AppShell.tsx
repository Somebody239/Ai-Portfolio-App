"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarProfile,
} from "@/components/ui/Sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  LayoutDashboard,
  BookOpen,
  School,
  Settings,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useUserProfile();

  const links = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: <BookOpen className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Universities",
      href: "/universities",
      icon: <School className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Opportunities",
      href: "/opportunities",
      icon: <TrendingUp className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-black w-full flex-1 max-w-screen mx-auto overflow-hidden min-h-screen md:h-screen text-zinc-100 font-sans selection:bg-zinc-800">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="h-10 flex items-center gap-3 mb-8 px-1">
              <div className="h-6 w-6 rounded bg-zinc-100 flex-shrink-0" />
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg tracking-tight"
                >
                  UniPlanner
                </motion.span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={handleLinkClick}
                />
              ))}
            </div>
          </div>

          <SidebarProfile user={user} loading={loading} onSignOut={signOut} />
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto md:h-screen bg-black relative z-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};

