/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import Views
import LandingView from "./views/LandingView";
import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import DashboardView from "./views/DashboardView";
import TestsView from "./views/TestsView";
import AttemptsView from "./views/AttemptsView";
import ResultsView from "./views/ResultsView";
import ProfileView from "./views/ProfileView";
import TakeTestView from "./views/TakeTestView";
import TestResultView from "./views/TestResultView";

// Import Layout
import { StudentLayout } from "./components/StudentLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/signup" element={<SignupView />} />

        {/* Private Student Routes (Wrapped in StudentLayout) */}
        <Route
          path="/student/dashboard"
          element={
            <StudentLayout>
              <DashboardView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/tests"
          element={
            <StudentLayout>
              <TestsView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/attempts"
          element={
            <StudentLayout>
              <AttemptsView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/results"
          element={
            <StudentLayout>
              <ResultsView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/profile"
          element={
            <StudentLayout>
              <ProfileView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/test/:id"
          element={
            <StudentLayout>
              <TakeTestView />
            </StudentLayout>
          }
        />
        <Route
          path="/student/test/:id/result"
          element={
            <StudentLayout>
              <TestResultView />
            </StudentLayout>
          }
        />

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
