/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, PlusCircle, Filter, FileMinus } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { getStoredAttempts } from "../lib/state";
import { Attempt } from "../types";
import { TestReviewModal } from "../components/TestReviewModal";

export default function AttemptsView() {
  const navigate = useNavigate();
  const attempts = getStoredAttempts();

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selected attempt for detailed popup (Modal 1: ATTEMPT DETAIL MODAL)
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter list
  const filteredAttempts = attempts.filter((att) => {
    if (statusFilter === "All") return true;
    return att.status === statusFilter;
  });

  const handleOpenAttemptDetails = (att: Attempt) => {
    setSelectedAttempt(att);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Header and Filter Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-indigo-600" />
            My Test Attempts
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse complete list of exams initiated, in-progress drafts, and historical answers.
          </p>
        </div>

        {/* Filter input */}
        <div className="w-full sm:w-[220px]">
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "All", label: "Filter: All Statuses" },
              { value: "Completed", label: "Filter: Completed" },
              { value: "In Progress", label: "Filter: In Progress" },
            ]}
          />
        </div>
      </div>

      {/* Main attempts table or blank slate */}
      {filteredAttempts.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center text-slate-500 shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto w-full my-6">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
            <FileMinus className="w-10 h-10" />
          </div>
          <h4 className="font-extrabold text-slate-800 text-lg">No matching attempts found</h4>
          <p className="text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
            You don't have any ongoing or historical attempts matching this filter. Start a mock test to begin learning.
          </p>
          <Button
            onClick={() => navigate("/student/tests")}
            className="mt-6 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Practice New Mock Test</span>
          </Button>
        </div>
      ) : (
        <Table id="attempts-list-table">
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Focus Course</TableHead>
              <TableHead>Started On</TableHead>
              <TableHead>Diagnostic Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttempts.map((att) => (
              <TableRow key={att.id}>
                {/* Test Name */}
                <TableCell className="font-semibold text-slate-900 md:max-w-xs truncate">
                  {att.testTitle}
                </TableCell>
                
                {/* Focus Course */}
                <TableCell>
                  <Badge variant="default" className="text-xs py-0.5 px-2 bg-slate-100 border-slate-200 text-slate-600 font-bold font-mono">
                    {att.course}
                  </Badge>
                </TableCell>

                {/* Started Date */}
                <TableCell className="text-xs font-mono text-slate-500">
                  {new Date(att.startedAt).toLocaleString()}
                </TableCell>

                {/* score */}
                <TableCell className="font-mono">
                  {att.status === "Completed" ? (
                    <span className="font-bold text-slate-800">
                      {att.score} / {att.totalQuestions}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal italic">Pending</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={att.status === "Completed" ? "success" : "warning"}>
                    {att.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  {att.status === "Completed" ? (
                    <Button
                      onClick={() => handleOpenAttemptDetails(att)}
                      variant="primary"
                      className="inline-flex py-1.5 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    >
                      View
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(`/student/test/${att.testId}`)}
                      variant="secondary"
                      className="inline-flex py-1.5 px-4 text-xs font-bold cursor-pointer"
                    >
                      Resume
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Attempt Details Modal portal overlay */}
      {selectedAttempt && (
        <TestReviewModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedAttempt(null);
          }}
          attempt={selectedAttempt}
          showExplanations={false} // Modal 1: ATTEMPT DETAIL MODAL doesn't require explanation, while results modal does. Perfect!
        />
      )}
    </div>
  );
}
