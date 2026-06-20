/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { Award, CheckCircle, XCircle, Clock, Check, X, Info, LayoutDashboard, Database, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { getStoredAttempts } from "../lib/state";
import { mockTestsList } from "../data/mockTests";
import { Attempt, Question } from "../types";

export default function TestResultView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Extract variables passed from router submission state
  const attemptIdFromState = (location.state as { attemptId?: string })?.attemptId;
  const wasTimedOut = (location.state as { timedOut?: boolean })?.timedOut;

  const [attempt, setAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    const allAttempts = getStoredAttempts();
    
    // Find the attempt matching state ID, or find latest completed attempt for this testId
    let found: Attempt | undefined;
    if (attemptIdFromState) {
      found = allAttempts.find((a) => a.id === attemptIdFromState);
    } else {
      found = allAttempts.find((a) => a.testId === id && a.status === "Completed");
    }

    if (!found) {
      // Fallback if none found: redirect to Dashboard
      navigate("/student/dashboard");
    } else {
      setAttempt(found);
    }
  }, [id, attemptIdFromState, navigate]);

  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Grading solutions...</span>
        </div>
      </div>
    );
  }

  const correspondingTest = mockTestsList.find((t) => t.id === attempt.testId);
  const questions: Question[] = correspondingTest?.questions || [];

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const incorrectCount = attempt.totalQuestions - attempt.score;

  // Status text thresholds
  let statusText = "Excellent";
  let statusBadgeVariant: "success" | "warning" | "danger" = "success";
  if (percentage < 60) {
    statusText = "Average";
    statusBadgeVariant = "danger";
  } else if (percentage < 80) {
    statusText = "Good";
    statusBadgeVariant = "warning";
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      
      {/* Upper header gradient banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-6 md:p-8 shadow-xl text-center flex flex-col items-center gap-4.5">
        {wasTimedOut && (
          <Badge variant="danger" className="bg-red-500 text-white border-red-600 px-4 py-1 text-xs">
            ⏰ Session Time Limit Expired! Auto-submitted.
          </Badge>
        )}
        <div className="p-4 bg-white/10 rounded-full border border-white/20 shadow-xl">
          <Award className="w-12 h-12 text-yellow-300" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Test Completed!
          </h2>
          <p className="text-sm text-indigo-100 max-w-lg mx-auto">
            Your results has been calculated against national course certification benchmarks below.
          </p>
        </div>
      </div>

      {/* Main Scorecard container */}
      <div className="max-w-xl mx-auto w-full text-center">
        <Card className="border-none bg-gradient-to-tr from-indigo-600 via-indigo-650 to-violet-650 text-white shadow-xl p-6 sm:p-8 flex flex-col items-center gap-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase font-sans tracking-widest text-indigo-200">
            Final Grading Aggregate
          </span>
          
          <div className="flex items-baseline justify-center font-mono gap-1 text-white">
            <span className="text-5xl sm:text-6xl font-extrabold">{attempt.score}</span>
            <span className="text-2xl text-indigo-200 font-bold">/</span>
            <span className="text-2xl text-indigo-200 font-bold">{attempt.totalQuestions}</span>
          </div>

          <div className="flex flex-col gap-1 items-center">
            <span className="text-3xl font-extrabold font-mono text-purple-100">{percentage}%</span>
            <Badge variant={statusBadgeVariant} className="bg-white/10 border-white/20 text-white font-extrabold text-sm px-4 py-1 mt-2 tracking-wide uppercase">
              {statusText} Performance
            </Badge>
          </div>
        </Card>
      </div>

      {/* Summary Stats Row: Correct, Incorrect, Time taken */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Correct Answers */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Correct</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 block">
              {attempt.score} Questions
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl border border-emerald-100/50">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Incorrect Answers */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Incorrect</span>
            <span className="text-2xl font-extrabold text-rose-500 font-mono mt-1 block">
              {incorrectCount} Questions
            </span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100/50">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Time Taken */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Time Elapsed</span>
            <span className="text-2xl font-extrabold text-indigo-600 font-mono mt-1 block">
              28 Minutes
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl border border-indigo-100/50">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Nav action button row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pb-3">
        <Button
          onClick={() => navigate("/student/dashboard")}
          variant="outline"
          className="w-full sm:w-auto px-7 py-3 flex items-center gap-2 text-base shadow-sm font-bold"
        >
          <LayoutDashboard className="w-5 h-5 text-indigo-600" />
          <span>Back to Dashboard</span>
        </Button>

        <Button
          onClick={() => navigate("/student/results")}
          variant="primary"
          className="w-full sm:w-auto px-8 py-3.5 flex items-center gap-2 text-base shadow-md font-bold"
        >
          <TrendingUp className="w-5 h-5 text-purple-200" />
          <span>View All My Results</span>
        </Button>
      </div>

      {/* Detailed Scrollable Answers Review Section */}
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mt-4">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
            Detailed Answers keys & Solutions Review
          </h3>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, index) => {
            const studentAns = attempt.answers[q.id];
            const isCorrect = studentAns === q.correctOption;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 sm:p-6 flex flex-col gap-4 transition-all duration-150 hover:shadow-md ${
                  isCorrect
                    ? "border-emerald-100 bg-emerald-50/10"
                    : "border-rose-100 bg-rose-50/10"
                }`}
              >
                {/* Header question row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="font-bold text-slate-950 pt-0.5 leading-relaxed text-base">
                      {q.question}
                    </p>
                  </div>

                  {isCorrect ? (
                    <Badge variant="success" className="font-bold">
                      <Check className="w-3.5 h-3.5 mr-1" /> Correct
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="font-bold">
                      <X className="w-3.5 h-3.5 mr-1" /> Incorrect
                    </Badge>
                  )}
                </div>

                {/* Option grid display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-11.5">
                  {Object.entries(q.options).map(([key, value]) => {
                    const isCorrectOpt = key === q.correctOption;
                    const isSelectedOpt = key === studentAns;

                    let cardStyle = "border rounded-xl p-3 text-sm font-semibold flex items-center justify-between transition-all duration-150 ";
                    if (isCorrectOpt) {
                      cardStyle += "border-emerald-350 bg-emerald-50 text-emerald-900";
                    } else if (isSelectedOpt) {
                      cardStyle += "border-rose-350 bg-rose-50 text-rose-900";
                    } else {
                      cardStyle += "border-slate-100/80 bg-slate-50/30 text-slate-600";
                    }

                    return (
                      <div key={key} className={cardStyle}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center font-bold border ${
                            isCorrectOpt
                              ? "bg-emerald-500 border-emerald-600 text-white"
                              : isSelectedOpt
                              ? "bg-rose-500 border-rose-600 text-white"
                              : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}>
                            {key}
                          </span>
                          <span>{value}</span>
                        </div>
                        {isCorrectOpt && <Check className="w-4 h-4 text-emerald-600" />}
                        {isSelectedOpt && !isCorrectOpt && <X className="w-4 h-4 text-rose-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="pl-11 border-t border-slate-100 pt-4 flex gap-3 text-slate-500 leading-relaxed font-sans">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg h-fit">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-indigo-950 block">
                      Detailed Solution Key
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 mt-1 block">
                      {q.explanation}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
