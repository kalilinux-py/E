/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, BookOpen, Clock, Award, ShieldAlert, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Input";
import { mockTestsList } from "../data/mockTests";
import { getStoredAttempts } from "../lib/state";
import { MockTest } from "../types";

export default function TestsView() {
  const navigate = useNavigate();
  const attempts = getStoredAttempts();
  
  // Filter state
  const [filter, setFilter] = useState<string>("All");

  // Selected test for modal 5 (Mock Test Details Modal)
  const [selectedDetailsTest, setSelectedDetailsTest] = useState<MockTest | null>(null);
  // Selected test for modal 3 (Take Test Modal)
  const [selectedTakeTest, setSelectedTakeTest] = useState<MockTest | null>(null);

  // Filter list
  const filteredTests = mockTestsList.filter((test) => {
    if (filter === "All") return true;
    return test.course === filter;
  });

  // Check if test was completed in attempts registry
  const isTestCompleted = (testId: string) => {
    return attempts.some((att) => att.testId === testId && att.status === "Completed");
  };

  const handleOpenDetails = (test: MockTest) => {
    setSelectedDetailsTest(test);
  };

  const handleOpenTakeTestConfirmation = (test: MockTest) => {
    setSelectedDetailsTest(null); // Close details modal if open
    setSelectedTakeTest(test);
  };

  const handleStartTest = () => {
    if (!selectedTakeTest) return;
    const testId = selectedTakeTest.id;
    setSelectedTakeTest(null);
    navigate(`/student/test/${testId}`);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* PAGE HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Available Practice Exams
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accelerate your knowledge and challenge yourself under strict stopwatch conditions.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full sm:w-[220px]">
          <Select
            id="filterCourse"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "All", label: "Filter: All Courses" },
              { value: "CCC", label: "Filter: CCC - Basic" },
              { value: "DCA", label: "Filter: DCA - Intermediate" },
              { value: "ADCA", label: "Filter: ADCA - Advanced" },
            ]}
          />
        </div>
      </div>

      {/* GRID OF EXAM MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {filteredTests.map((test, index) => {
          const completed = isTestCompleted(test.id);
          
          // Classier professional themes for high-end SaaS representation
          const gradientHeader = index % 2 === 0
            ? "from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/10"
            : "from-slate-900 via-slate-900 to-indigo-950 border-violet-500/10";

          return (
            <div
              key={test.id}
              onClick={() => handleOpenDetails(test)}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-200/80 transition-all duration-300 cursor-pointer group"
            >
              {/* Header Box */}
              <div className={`bg-gradient-to-br ${gradientHeader} text-white border-b border-slate-800/60 p-5 flex flex-col gap-3 relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300">
                    {test.course} Course
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium font-mono text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{test.duration} mins</span>
                  </div>
                </div>

                <h4 className="text-base font-bold font-sans tracking-tight pt-1 leading-snug text-white z-10 group-hover:text-indigo-200 transition-colors">
                  {test.title}
                </h4>
              </div>

              {/* Body Content */}
              <div className="flex-1 p-5 flex flex-col justify-between gap-5">
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {test.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
                  <span className="text-[11px] font-semibold text-slate-405 font-mono flex items-center gap-1.5 uppercase">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    {test.totalQuestions} MCQ Questions
                  </span>

                  {completed ? (
                    <Badge variant="success" className="text-[10px] px-2.5 py-0.5">Completed</Badge>
                  ) : (
                    <Badge variant="purple" className="text-[10px] px-2.5 py-0.5">NEW</Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggers details modal
                    handleOpenTakeTestConfirmation(test);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <span>Launch Attempt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: EXAM DETAILS SPECIFICATE */}
      <Modal
        isOpen={selectedDetailsTest !== null}
        onClose={() => setSelectedDetailsTest(null)}
        title="Mock Test Specifications"
        size="md"
      >
        {selectedDetailsTest && (
          <div className="flex flex-col gap-5 py-1">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-indigo-600 text-[10px] font-bold tracking-widest uppercase block">
                  {selectedDetailsTest.course} ACCREDITATION
                </span>
                <h4 className="font-extrabold text-lg text-slate-800 font-sans tracking-tight leading-snug">
                  {selectedDetailsTest.title}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center my-0.5 font-mono">
              <div className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-sans font-semibold uppercase block">Questions</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedDetailsTest.totalQuestions}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-sans font-semibold uppercase block">Duration</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedDetailsTest.duration} Min</span>
              </div>
              <div className="bg-slate-50 border border-slate-100/80 p-3 rounded-xl shadow-xs">
                <span className="text-[10px] text-slate-400 font-sans font-semibold uppercase block">Max Marks</span>
                <span className="text-sm font-extrabold text-indigo-600">60</span>
              </div>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-4 flex gap-3 text-emerald-800">
              <Compass className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <h5 className="font-bold text-emerald-950">Curriculum standard coverage:</h5>
                <p className="text-emerald-700/90 leading-relaxed mt-0.5">
                  {selectedDetailsTest.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedDetailsTest(null)}
                className="w-full py-2.5 rounded-lg border border-slate-250 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
              >
                Close Summary
              </button>
              <button
                onClick={() => handleOpenTakeTestConfirmation(selectedDetailsTest)}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Start Test Challenge
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: TERMS RULES */}
      <Modal
        isOpen={selectedTakeTest !== null}
        onClose={() => setSelectedTakeTest(null)}
        title="Start Examination Challenge"
        size="md"
      >
        {selectedTakeTest && (
          <div className="flex flex-col gap-5 py-1">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-slate-900">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-rose-500 text-[10px] font-bold tracking-widest uppercase block">
                  TIMED EXAM CONDITIONS
                </span>
                <h4 className="font-extrabold text-lg font-sans tracking-tight text-slate-800 leading-snug">
                  {selectedTakeTest.title}
                </h4>
              </div>
            </div>

            <div className="bg-amber-50/40 border-2 border-amber-200/60 rounded-xl p-4.5 flex gap-3 text-amber-800">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <h5 className="font-bold text-amber-950">Before you launch the test:</h5>
                <ul className="list-disc list-inside mt-2 flex flex-col gap-1.5 text-amber-900/90 font-sans">
                  <li>You must complete <b>60 multiple-choice questions</b>.</li>
                  <li>The stopwatch is fixed at exactly <b>30:00 minutes</b>.</li>
                  <li>Once triggered, you cannot pause, rewind, or restart the session.</li>
                  <li>Premature tab navigation, refreshes, or closing will count as immediate submission.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedTakeTest(null)}
                className="w-full py-2.5 rounded-lg border border-slate-250 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleStartTest}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Launch Clock & Test
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
