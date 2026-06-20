/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Award, LayoutDashboard, Compass, ClipboardList, TrendingUp, UserCheck, LogOut, Menu, X } from "lucide-react";
import { getStoredProfile, logoutProfile } from "../lib/state";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "motion/react";

interface StudentLayoutProps {
  children?: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = getStoredProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticating guard
  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, [profile, navigate]);

  // Close mobile sidebar on route transitions
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 font-sans">Checking credentials...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutProfile();
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/student/dashboard", icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { label: "Practice Tests", path: "/student/tests", icon: <Compass className="w-[18px] h-[18px]" /> },
    { label: "My Attempts", path: "/student/attempts", icon: <ClipboardList className="w-[18px] h-[18px]" /> },
    { label: "Results & Keys", path: "/student/results", icon: <TrendingUp className="w-[18px] h-[18px]" /> },
    { label: "My Profile", path: "/student/profile", icon: <UserCheck className="w-[18px] h-[18px]" /> },
  ];

  // Sidebar content (shared between mobile and desktop)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none">
      {/* Brand area */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg text-white shadow-md shadow-indigo-900/30 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-white tracking-tight leading-none">
            Evalo
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
            Exam Prep Suite
          </span>
        </div>
      </div>



      {/* Navigation list */}
      <nav className="flex-1 flex flex-col gap-1 px-3 mt-6">
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <span className={`transition-transform duration-200 ${active ? "scale-105" : "text-slate-400"}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Session Logout Section */}
      <div className="p-4 border-t border-slate-800/60 shrink-0">
        <button
          onClick={handleLogout}
          id="logout-button"
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 rounded-lg transition-all cursor-pointer"
          title="Sign out of student dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Dashboard</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row relative">
      
      {/* PERSISTENT LEFT SIDEBAR FOR DESKTOP (lg and above) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shadow-xl fixed inset-y-0 left-0 z-40">
        {renderSidebarContent()}
      </aside>

      {/* TOP HEADER BAR FOR MOBILE DEVICES (max-lg screen sizes) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between px-4 py-3 h-14 w-full shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg text-white shadow-sm shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <Link to="/student/dashboard" className="font-bold text-sm text-slate-900 tracking-tight leading-none">
            Evalo
          </Link>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2 py-0.5">
            {profile.studentCode} ({profile.course})
          </span>

          {/* Trigger button for responsive sliding drawer */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            id="mobile-menu-trigger"
            className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            title="Open navigation menu drawer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* SLIDING DRAWER LAYOUT OVERLAY FOR MOBILE VIEWPORTS */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop backing underlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Sliding content sidebar block drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 left-0 w-64 bg-slate-900 shadow-2xl flex flex-col"
            >
              {/* Close Button slot */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                id="mobile-menu-close"
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer z-50"
                title="Dismiss sliding menu navigation drawer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Sidebar Content drawer body */}
              <div className="flex-1 h-full">
                {renderSidebarContent()}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MASTER VIEW PORT */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <main className="flex-1 w-full p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
