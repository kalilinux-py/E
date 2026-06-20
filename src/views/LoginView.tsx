/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, ShieldAlert, KeyRound, Phone } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { loginStudent } from "../lib/state";

export default function LoginView() {
  const navigate = useNavigate();
  const [studentCode, setStudentCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentCode.trim()) {
      setError("Please input your unique Student Code.");
      return;
    }
    if (!phone.trim()) {
      setError("Please input your registered phone number.");
      return;
    }

    const trimmedCode = studentCode.trim().toUpperCase();
    const loggedIn = loginStudent(trimmedCode, phone.trim());

    if (loggedIn) {
      navigate("/student/dashboard");
    } else {
      setError("Incorrect Student Code or phone pairing. Try the demo credential below!");
    }
  };

  const loadDemoMocks = () => {
    setStudentCode("STU7492");
    setPhone("9876543210");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Brand Logo in header */}
        <div className="flex items-center justify-center gap-3 text-white mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Award className="w-8 h-8 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-wide">Evalo</span>
        </div>

        <Card className="border-2 border-white/20 shadow-xl bg-white rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 font-sans">Student Login</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter credentials below to access your tests dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3.5 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <Input
                id="studentCode"
                label="Student Code"
                placeholder="e.g. STU7492"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                autoFocus
              />
              <KeyRound className="absolute right-3.5 bottom-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Phone className="absolute right-3.5 bottom-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3.5 text-base mt-2">
              Sign In Account
            </Button>
          </form>

          {/* Demo helper credential card */}
          <div className="mt-6 p-4 bg-purple-50/80 border-2 border-purple-100 rounded-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Demo Testing Student Credentials:</span>
              <button
                type="button"
                onClick={loadDemoMocks}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline hover:scale-102 cursor-pointer"
              >
                Autofill Demo
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Student Code: <b className="text-slate-800">STU7492</b> <br />
              Registered Phone: <b className="text-slate-800">9876543210</b>
            </p>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs sm:text-sm text-slate-500">
              Don't have an accredited account?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                Create Account
              </Link>
            </span>
          </div>
        </Card>

        {/* Back link */}
        <div className="text-center">
          <Link to="/" className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
