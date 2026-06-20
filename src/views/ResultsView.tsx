/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, Sparkles, Trophy, Star, FileMinus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { getStoredAttempts } from "../lib/state";
import { Attempt } from "../types";
import { TestReviewModal } from "../components/TestReviewModal";

export default function ResultsView() {
  const attempts = getStoredAttempts();

  // Completed attempts only
  const completedAttempts = attempts.filter((a) => a.status === "Completed");
  const totalCompleted = completedAttempts.length;

  let avgPercent = 0;
  let bestPercent = 0;

  if (totalCompleted > 0) {
    const sumPercent = completedAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0);
    avgPercent = Math.round(sumPercent / totalCompleted);

    const percentList = completedAttempts.map((a) => (a.score / a.totalQuestions) * 100);
    bestPercent = Math.round(Math.max(...percentList));
  }

  // Selected attempt for Result Details Modal
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenResultDetails = (att: Attempt) => {
    setSelectedAttempt(att);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Page Header block */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          Performance Results & Logs
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review completed assessments, cross-examine answer keys with expert explanations, and chart academic progress.
        </p>
      </div>

      {/* Summary Row inside Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Completed Evaluations", val: totalCompleted.toString(), sub: "exams completed", color: "indigo", icon: <Trophy className="w-5 h-5 text-indigo-500" /> },
          { label: "Aggregate Percentage", val: `${avgPercent}%`, sub: "average exam percentage", color: "purple", icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
          { label: "Highest Performance", val: `${bestPercent}%`, sub: "peak score recorded", color: "pink", icon: <Star className="w-5 h-5 text-pink-500" /> },
        ].map((sum, i) => (
          <Card key={i} className="flex flex-row items-center justify-between p-5 py-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase font-sans">{sum.label}</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1">{sum.val}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">{sum.sub}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
              {sum.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Results Main list Table */}
      {completedAttempts.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center text-slate-500 shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto w-full my-6">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
            <FileMinus className="w-10 h-10" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-lg">No results registered</h4>
          <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
            You have not fully completed any testing modules yet. Take your first practice exam to unlock full diagnostics!
          </p>
        </div>
      ) : (
        <Table id="complete-results-table">
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Total Questions</TableHead>
              <TableHead>Percentage Rating</TableHead>
              <TableHead>Evaluation Date</TableHead>
              <TableHead className="text-right">Action Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedAttempts.map((att) => {
              const scorePercent = Math.round((att.score / att.totalQuestions) * 100);

              // Percentage color thresholds: green (>80%), yellow (60-80%), red (<60%)
              let scoreBadgeVar: "success" | "warning" | "danger" = "success";
              if (scorePercent < 60) scoreBadgeVar = "danger";
              else if (scorePercent < 80) scoreBadgeVar = "warning";

              return (
                <TableRow key={att.id}>
                  {/* Test Name */}
                  <TableCell className="font-semibold text-slate-900 md:max-w-xs truncate">
                    {att.testTitle}
                  </TableCell>

                  {/* Score */}
                  <TableCell className="font-mono text-slate-800 font-extrabold">
                    {att.score}
                  </TableCell>

                  {/* Total Questions */}
                  <TableCell className="font-mono text-slate-500">
                    {att.totalQuestions}
                  </TableCell>

                  {/* Percentage Rating */}
                  <TableCell>
                    <Badge variant={scoreBadgeVar} className="font-bold">
                      {scorePercent}%
                    </Badge>
                  </TableCell>

                  {/* Evaluation Date */}
                  <TableCell className="text-xs font-mono text-slate-500">
                    {new Date(att.startedAt).toLocaleDateString()}
                  </TableCell>

                  {/* Action Key */}
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleOpenResultDetails(att)}
                      variant="secondary"
                      className="inline-flex py-1 px-3 text-xs font-bold"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Result Details Modal (Modal 2: RESULT DETAIL MODAL, showExplanations=true) */}
      {selectedAttempt && (
        <TestReviewModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedAttempt(null);
          }}
          attempt={selectedAttempt}
          showExplanations={true} // Triggers explanation lists and marked borders! Absolutely flawless.
        />
      )}
    </div>
  );
}
