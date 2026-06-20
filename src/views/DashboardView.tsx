/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Sparkles, Layers, CheckSquare, Milestone, Award, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { getStoredProfile, getStoredAttempts } from "../lib/state";
import { TestReviewModal } from "../components/TestReviewModal";
import { Attempt } from "../types";

export default function DashboardView() {
  const navigate = useNavigate();
  const profile = getStoredProfile();
  const attempts = getStoredAttempts();

  // Selected attempt for the review modal
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Calculate dynamic stats from attempts
  const completedAttempts = attempts.filter((a) => a.status === "Completed");
  const totalCompleted = completedAttempts.length;
  
  let avgPercentage = 0;
  let bestPercentage = 0;

  if (totalCompleted > 0) {
    const totalScore = completedAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0);
    avgPercentage = Math.round(totalScore / totalCompleted);
    
    const percentages = completedAttempts.map((a) => (a.score / a.totalQuestions) * 100);
    bestPercentage = Math.round(Math.max(...percentages));
  }

  // Handle open modal
  const handleOpenReview = (att: Attempt) => {
    setSelectedAttempt(att);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* 1. LUXURIOUS HERO BANNER / WELCOME SECTION */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-indigo-500/10 overflow-hidden">
        {/* Subtle decorative layout blobs/grids */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 w-fit backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Premium Exam Suite</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-violet-200 to-white">{profile?.name}</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Accelerate your training with our curriculum-aligned interactive mock tests. Explore performance breakdowns, practice weak modules, and gain confidence for your final certificates.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/tests")}
            id="hero-take-test-btn"
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/20 active:scale-98 transition-all w-full md:w-auto relative overflow-hidden"
          >
            <Compass className="w-4.5 h-4.5 transition-transform group-hover:rotate-12 duration-300" />
            <span>Launch Practice Test</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 duration-200" />
          </button>
        </div>
      </div>

      {/* 2. STAT CARDS WITH REFINED CONTRAST AND ICON PLACEMENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {[
          { 
            label: "Total Modules", 
            num: "12", 
            sub: "Accredited syllabus modules", 
            icon: <Layers className="w-5 h-5 text-indigo-500" />,
            bgColor: "bg-indigo-50"
          },
          { 
            label: "Completed Tests", 
            num: totalCompleted.toString(), 
            sub: `${attempts.length} attempts recorded`, 
            icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
            bgColor: "bg-emerald-50"
          },
          { 
            label: "Average Score", 
            num: `${avgPercentage}%`, 
            sub: "Aggregated performance", 
            icon: <Sparkles className="w-5 h-5 text-violet-500" />,
            bgColor: "bg-violet-50"
          },
          { 
            label: "Best Performance", 
            num: `${bestPercentage}%`, 
            sub: "Your peak result metric", 
            icon: <Milestone className="w-5 h-5 text-amber-500" />,
            bgColor: "bg-amber-50"
          },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden group hover:shadow-md hover:border-slate-200/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2.5 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
                {stat.num}
              </span>
              <span className="text-xs text-slate-500 font-sans tracking-tight">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CORE PERFORMANCE & LOG TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        
        {/* RECENT ATTEMPTS MODULE */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
              <h3 className="font-bold text-base text-slate-800">
                Recent Test Attempts
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded">
              Last 5 sessions
            </span>
          </div>

          <div className="overflow-hidden">
            <Table id="recent-attempts-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-400 text-xs">Test Title</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs text-center">Score</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs">Date</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs">Status</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs text-right">Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.slice(0, 5).map((att) => (
                  <TableRow key={att.id} className="group/row">
                    <TableCell className="font-bold text-slate-700 max-w-[150px] truncate py-3.5">
                      {att.testTitle}
                    </TableCell>
                    <TableCell className="font-mono text-center py-3.5">
                      {att.status === "Completed" ? (
                        <span className="font-bold text-slate-850 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {att.score}/{att.totalQuestions}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-500 py-3.5">
                      {new Date(att.startedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant={att.status === "Completed" ? "success" : "warning"} className="text-[10px] px-2.5 py-0.5">
                        {att.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-3.5">
                      <button
                        onClick={() => handleOpenReview(att)}
                        className="inline-flex items-center gap-1 font-semibold text-xs text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {attempts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8 text-xs font-medium">
                      No attempts registered.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* RECENT PERFORMANCE MODULE */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-sm" />
              <h3 className="font-bold text-base text-slate-800">
                Acreedited Performance Keys
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded">
              Last 5 completed
            </span>
          </div>

          <div className="overflow-hidden">
            <Table id="recent-results-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-400 text-xs">Test Name</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs text-center">Score</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs">Percentage</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs">Date</TableHead>
                  <TableHead className="font-semibold text-slate-400 text-xs text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAttempts.slice(0, 5).map((att) => {
                  const percent = Math.round((att.score / att.totalQuestions) * 100);
                  let badgeVar: "success" | "warning" | "danger" = "success";
                  if (percent < 60) badgeVar = "danger";
                  else if (percent < 80) badgeVar = "warning";

                  return (
                    <TableRow key={att.id} className="group/perf">
                      <TableCell className="font-bold text-slate-700 max-w-[140px] truncate py-3.5">
                        {att.testTitle}
                      </TableCell>
                      <TableCell className="font-mono text-center font-bold text-slate-800 text-xs py-3.5">
                        {att.score}/60
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant={badgeVar} className="text-[10px] px-2.5 py-0.5">
                          {percent}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-500 py-3.5">
                        {new Date(att.startedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric"
                        })}
                      </TableCell>
                      <TableCell className="text-right py-3.5">
                        <button
                          onClick={() => handleOpenReview(att)}
                          className="inline-flex items-center gap-1 font-semibold text-xs text-indigo-650 hover:text-indigo-750 hover:underline transition-all"
                        >
                          <span>Review</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/perf:opacity-100 transition-opacity" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {completedAttempts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8 text-xs font-medium">
                      No results available yet. Start testing to unlock reviews!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Review Modal portal wrapper */}
      {selectedAttempt && (
        <TestReviewModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedAttempt(null);
          }}
          attempt={selectedAttempt}
          showExplanations={true}
        />
      )}
    </div>
  );
}
