/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckSquare, ChevronLeft, ChevronRight, Send, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { mockTestsList } from "../data/mockTests";
import { getStoredAttempts, saveStoredAttempts } from "../lib/state";
import { Attempt, Question } from "../types";

export default function TakeTestView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find corresponding mock test
  const currentTest = mockTestsList.find((t) => t.id === id);

  // Active attempt state
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submit modal state
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  // Bootstrapping attempt
  useEffect(() => {
    if (!currentTest) {
      navigate("/student/tests");
      return;
    }

    const allAttempts = getStoredAttempts();
    // Check if there's already an active In Progress attempt for this test
    let activeAttempt = allAttempts.find(
      (a) => a.testId === currentTest.id && a.status === "In Progress"
    );

    if (!activeAttempt) {
      // Create new fresh attempt
      const newAttemptId = `att-act-${Date.now()}`;
      activeAttempt = {
        id: newAttemptId,
        testId: currentTest.id,
        testTitle: currentTest.title,
        course: currentTest.course,
        startedAt: new Date().toISOString(),
        completedAt: null,
        score: 0,
        totalQuestions: 60,
        status: "In Progress",
        answers: {},
      };
      
      const updated = [activeAttempt, ...allAttempts];
      saveStoredAttempts(updated);
    }

    setAttempt(activeAttempt);

    // Calculate initial timer tick
    const startMs = new Date(activeAttempt.startedAt).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
    const limitSeconds = currentTest.duration * 60; // 30 minutes * 60 = 1800
    const remaining = limitSeconds - elapsedSeconds;

    if (remaining <= 0) {
      // Autosubmit if timer is already spent
      handleAutoSubmit(activeAttempt);
    } else {
      setTimeLeft(remaining);
    }

    // Set up reactive ticker interval
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const rem = limitSeconds - elapsed;
      if (rem <= 0) {
        clearInterval(timerRef.current!);
        setTimeLeft(0);
        // Trigger auto submit
        handleAutoSubmit(activeAttempt!);
      } else {
        setTimeLeft(rem);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id, currentTest, navigate]);

  if (!currentTest || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Establishing practice environment...</span>
        </div>
      </div>
    );
  }

  const questions: Question[] = currentTest.questions;
  const currentQuestion: Question = questions[currentQuestionIndex];

  // Answer recording logic
  const handleAnswerSelection = (optionKey: "A" | "B" | "C" | "D") => {
    if (!attempt) return;

    const newAnswers = {
      ...attempt.answers,
      [currentQuestion.id]: optionKey,
    };

    const updatedAttempt: Attempt = {
      ...attempt,
      answers: newAnswers,
    };

    setAttempt(updatedAttempt);

    // Save back to local storage
    const allAttempts = getStoredAttempts();
    const idx = allAttempts.findIndex((a) => a.id === attempt.id);
    if (idx !== -1) {
      allAttempts[idx] = updatedAttempt;
      saveStoredAttempts(allAttempts);
    }
  };

  // Grading calculation
  function gradeTest(finalAnswerMap: { [key: number]: string }): number {
    let finalScore = 0;
    questions.forEach((q) => {
      const studentSelected = finalAnswerMap[q.id];
      if (studentSelected && studentSelected === q.correctOption) {
        finalScore += 1;
      }
    });
    return finalScore;
  }

  function executeFinalSubmission() {
    if (!attempt) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const score = gradeTest(attempt.answers);
    const finalizedAttempt: Attempt = {
      ...attempt,
      status: "Completed",
      completedAt: new Date().toISOString(),
      score: score,
    };

    // Update attempts database
    const allAttempts = getStoredAttempts();
    const idx = allAttempts.findIndex((a) => a.id === attempt.id);
    if (idx !== -1) {
      allAttempts[idx] = finalizedAttempt;
    } else {
      allAttempts.unshift(finalizedAttempt);
    }
    saveStoredAttempts(allAttempts);

    setSubmitConfirmOpen(false);
    // Redirect to test/:id/result
    navigate(`/student/test/${currentTest.id}/result`, { state: { attemptId: attempt.id } });
  }

  function handleAutoSubmit(targetAttempt: Attempt) {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalScore = gradeTest(targetAttempt.answers);
    const finalizedLimitAttempt: Attempt = {
      ...targetAttempt,
      status: "Completed",
      completedAt: new Date().toISOString(),
      score: finalScore,
    };

    const allAttempts = getStoredAttempts();
    const idx = allAttempts.findIndex((a) => a.id === targetAttempt.id);
    if (idx !== -1) {
      allAttempts[idx] = finalizedLimitAttempt;
    }
    saveStoredAttempts(allAttempts);

    navigate(`/student/test/${currentTest.id}/result`, {
      state: { attemptId: targetAttempt.id, timedOut: true },
    });
  }

  // Navigation handlers
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const formatTimer = (sec: number) => {
    const minStr = Math.floor(sec / 60).toString().padStart(2, "0");
    const secStr = (sec % 60).toString().padStart(2, "0");
    return `${minStr}:${secStr}`;
  };

  const answeredCount = Object.keys(attempt.answers).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Test Header Row with running timer */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 md:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <span className="text-purple-200 text-xs font-bold font-mono tracking-wider uppercase block">
            Official Course assessment - {attempt.course} Focused Focus
          </span>
          <h3 className="text-lg md:text-2xl font-extrabold tracking-tight font-sans">
            {currentTest.title}
          </h3>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3.5 bg-white/10 px-5 py-3 rounded-xl border border-white/20 shadow-xl font-mono text-center min-w-[150px] justify-center">
          <Clock className="w-5 h-5 text-purple-200 animate-pulse" />
          <div>
            <span className="text-[10px] text-purple-200 uppercase font-sans font-bold tracking-tight block">
              Remaining Time
            </span>
            <span className="text-2xl font-extrabold tracking-widest text-white leading-none">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Main interactive QA body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Selected Question card structure */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6 sm:p-8 relative flex flex-col gap-6 shadow-md">
            {/* Header / index indicator */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <Badge variant="purple" className="text-xs font-bold py-1 px-3">
                Question {currentQuestionIndex + 1} of 60
              </Badge>
              <span className="text-xs text-slate-400 font-bold font-mono uppercase tracking-wider">
                Progress: {Math.round((answeredCount / 60) * 100)}%
              </span>
            </div>

            {/* Question Text */}
            <div className="my-1.5">
              <h4 className="text-lg sm:text-xl font-bold font-sans text-slate-800 leading-relaxed">
                {currentQuestion.question}
              </h4>
            </div>

            {/* 4 Option Buttons */}
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isSelected = attempt.answers[currentQuestion.id] === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelection(key as "A" | "B" | "C" | "D")}
                    className={`border rounded-xl p-4 text-left transition-all duration-150 flex items-center justify-between group outline-none cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs"
                        : "border-slate-200/65 hover:border-indigo-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-lg font-mono text-sm font-bold flex items-center justify-center border transition-all ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-500 group-hover:border-indigo-300 group-hover:text-indigo-600"
                      }`}>
                        {key}
                      </span>
                      <span className="font-semibold text-sm sm:text-base">{value}</span>
                    </div>

                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-200"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons footer row */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-3">
              <Button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="gap-1 px-4 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="gap-1 px-5 text-sm bg-indigo-600 hover:bg-indigo-700"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setSubmitConfirmOpen(true)}
                  variant="primary"
                  className="gap-1.5 px-6 text-sm bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Test</span>
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Question Navigator panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 relative flex flex-col gap-5 shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              <h5 className="font-bold text-sm text-slate-800 uppercase tracking-wider font-mono">
                Navigator Map (1-60)
              </h5>
            </div>

            {/* Grid of 60 dots */}
            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-5 gap-2 font-mono">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!attempt.answers[q.id];

                let cellColorStyle = "";
                if (isCurrent) {
                  cellColorStyle = "bg-indigo-600 text-white font-bold border-indigo-700 ring-2 ring-indigo-200 scale-105";
                } else if (isAnswered) {
                  cellColorStyle = "bg-purple-100 text-indigo-700 font-bold border-purple-200 shadow-sm";
                } else {
                  cellColorStyle = "bg-slate-50 text-slate-400 border-slate-250 hover:bg-slate-100 hover:text-slate-800 hover:scale-103";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 w-full rounded-lg text-xs font-semibold flex items-center justify-center transition-all border outline-none cursor-pointer ${cellColorStyle}`}
                    title={`Go to Question #${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legends summary indicator */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 block border border-indigo-700" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-purple-100 block border border-purple-200" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-50 block border border-slate-205" />
                <span>Unanswered</span>
              </div>
            </div>

            <Button
              onClick={() => setSubmitConfirmOpen(true)}
              variant="primary"
              className="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Evaluation</span>
            </Button>
          </Card>
        </div>
      </div>

      {/* Modal 4: SUBMIT CONFIRMATION MODAL */}
      <Modal
        isOpen={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        title="Submit Active Assessment Case"
        size="md"
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="flex items-center gap-4.5 border-b border-slate-100 pb-4 text-slate-900">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full border border-purple-100 animate-pulse">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-purple-600 text-xs font-bold font-mono tracking-wider uppercase block">
                Await Certifiable Results Action
              </span>
              <h4 className="font-extrabold text-xl font-sans tracking-tight text-slate-900 leading-none">
                Submit Test?
              </h4>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-slate-600 text-xs sm:text-sm">
            <p className="font-semibold text-slate-800">
              Are you sure? You've answered <b>{answeredCount}/60</b> questions.
            </p>
            <p className="text-slate-500 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-xl font-medium mt-1">
              Warning: Once you submit, you won't be able to change, supplement, or re-record any answers. Your results will be graded instantly following academic standards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <Button
              onClick={() => setSubmitConfirmOpen(false)}
              variant="outline"
              className="w-full py-2.5 font-bold cursor-pointer"
            >
              Back to Test
            </Button>
            <Button
              onClick={executeFinalSubmission}
              variant="primary"
              className="w-full py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md cursor-pointer"
            >
              Submit and Grade
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
