/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Modal } from "./ui/Modal";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Check, X, Info, Trophy, Clock, HelpCircle, FileText } from "lucide-react";
import { Attempt, Question } from "../types";
import { mockTestsList } from "../data/mockTests";

interface TestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: Attempt | null;
  showExplanations?: boolean;
}

export function TestReviewModal({
  isOpen,
  onClose,
  attempt,
  showExplanations = true,
}: TestReviewModalProps) {
  if (!attempt) return null;

  // Retrieve test to get questions
  const correspondingTest = mockTestsList.find((t) => t.id === attempt.testId);
  const questions: Question[] = correspondingTest?.questions || [];

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  
  // Calculate statistics
  const answeredCount = Object.keys(attempt.answers).length;
  const incorrectCount = attempt.status === "Completed" ? attempt.totalQuestions - attempt.score : 0;

  // Helper to check individual question result
  const getQuestionStatus = (q: Question) => {
    const studentAns = attempt.answers[q.id];
    if (!studentAns) return "unanswered";
    return studentAns === q.correctOption ? "correct" : "incorrect";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${attempt.testTitle} - Diagnostic Review`}
      size="full"
    >
      <div className="flex flex-col gap-8 pb-10">
        {/* Overview Header Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 shadow-xl">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <span className="text-purple-200 text-xs sm:text-sm font-mono tracking-wider font-semibold block uppercase">
                {attempt.course} Focused Course Evaluation
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">{attempt.testTitle}</h4>
              <p className="text-xs text-indigo-200 mt-1">
                Started on: {new Date(attempt.startedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-center">
            {/* Score */}
            <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 shadow-lg min-w-[100px]">
              <span className="text-xs font-sans text-indigo-200 font-semibold uppercase block">Score</span>
              <span className="text-2xl font-extrabold text-white">
                {attempt.status === "Completed" ? `${attempt.score}/${attempt.totalQuestions}` : "N/A"}
              </span>
            </div>

            {/* Percentage Badge */}
            <div className="bg-white/10 px-5 py-3 rounded-xl border border-white/10 shadow-lg min-w-[100px]">
              <span className="text-xs font-sans text-indigo-200 font-semibold uppercase block">Percentage</span>
              <span className="text-2xl font-extrabold text-white">
                {attempt.status === "Completed" ? `${percentage}%` : "In Progress"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 font-sans uppercase">Completion Status</span>
              <span className="text-lg font-bold text-slate-800">{attempt.status}</span>
            </div>
            <Badge variant={attempt.status === "Completed" ? "success" : "warning"}>
              {attempt.status === "Completed" ? "Saved" : "Pending"}
            </Badge>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 font-sans uppercase">Correct Answers</span>
              <span className="text-lg font-bold text-emerald-600">
                {attempt.status === "Completed" ? `+ ${attempt.score}` : "N/A"}
              </span>
            </div>
            <Badge variant="success">Correct</Badge>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 font-sans uppercase">Incorrect/Skipped</span>
              <span className="text-lg font-bold text-rose-600">
                {attempt.status === "Completed" ? `- ${incorrectCount}` : "N/A"}
              </span>
            </div>
            <Badge variant="danger">Incorrect</Badge>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 font-sans uppercase">Estimated Time Taken</span>
              <span className="text-lg font-bold text-indigo-600">
                {attempt.completedAt ? "28 Minutes" : "In Progress"}
              </span>
            </div>
            <Badge variant="info">
              <Clock className="w-3 h-3" /> Timed
            </Badge>
          </div>
        </div>

        {/* Answer Breakdown Details section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h5 className="font-bold text-lg text-slate-900">Detailed Answer Evaluation & Keys</h5>
          </div>

          {attempt.status === "In Progress" ? (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-10 text-center text-slate-500 max-w-lg mx-auto w-full my-6 shadow-xs">
              <Info className="w-10 h-10 mx-auto text-amber-500 mb-3" />
              <h6 className="font-bold text-slate-800 text-lg">Test is Currently In Progress</h6>
              <p className="text-sm mt-1">
                Details, answers, and explanations will unlock instantly as soon as you submit the evaluation.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {questions.map((q, index) => {
                const status = getQuestionStatus(q);
                const studentAns = attempt.answers[q.id];

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl border shadow-xs p-6 flex flex-col gap-4.5 transition-all duration-200 hover:shadow-sm ${
                      status === "correct"
                        ? "border-emerald-105 bg-emerald-50/10"
                        : "border-rose-105 bg-rose-50/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-sm flex items-center justify-center">
                          {index + 1}
                        </span>
                        <p className="font-semibold text-base text-slate-900 pt-0.5 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {status === "correct" ? (
                        <Badge variant="success">
                          <Check className="w-3.5 h-3.5 mr-1" /> Correct Answer
                        </Badge>
                      ) : (
                        <Badge variant="danger">
                          <X className="w-3.5 h-3.5 mr-1" /> Incorrect Answer
                        </Badge>
                      )}
                    </div>

                    {/* Options list in Grid form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 sm:pl-11.5">
                      {Object.entries(q.options).map(([key, value]) => {
                        const isCorrect = key === q.correctOption;
                        const isSelected = key === studentAns;

                        let optCardClass = "border rounded-xl p-3 text-sm font-semibold flex items-center justify-between transition-all duration-150 ";
                        if (isCorrect) {
                          optCardClass += "border-emerald-350 bg-emerald-50 text-emerald-900";
                        } else if (isSelected) {
                          optCardClass += "border-rose-350 bg-rose-50 text-rose-900";
                        } else {
                          optCardClass += "border-slate-100/80 bg-slate-50/30 text-slate-600";
                        }

                        return (
                          <div key={key} className={optCardClass}>
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center font-bold border ${
                                isCorrect
                                  ? "bg-emerald-500 border-emerald-600 text-white"
                                  : isSelected
                                  ? "bg-rose-500 border-rose-600 text-white"
                                  : "bg-slate-100 border-slate-200 text-slate-700"
                              }`}>
                                {key}
                              </span>
                              <span>{value}</span>
                            </div>
                            {isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                            {isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation section */}
                    {showExplanations && (
                      <div className="mt-2 pl-11 flex gap-3.5 border-t border-slate-100 pt-4">
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl h-fit">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-indigo-950 uppercase block font-sans">
                            Detailed Explanation
                          </span>
                          <span className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans block mt-1">
                            {q.explanation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={onClose} variant="primary" className="py-2.5 px-6">
            Close Evaluation Review
          </Button>
        </div>
      </div>
    </Modal>
  );
}
