/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Award, ShieldAlert, CheckCircle, Copy, ClipboardCheck } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { registerStudent } from "../lib/state";

export default function SignupView() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up pre-selected course from landing link
  const initialCourse = (location.state as { course?: string })?.course || "CCC";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState<"CCC" | "DCA" | "ADCA">(initialCourse as "CCC" | "DCA" | "ADCA");
  const [error, setError] = useState("");

  // Modal State after successful signup
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please key in your full student name.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Name must be at least 3 letters long.");
      return;
    }
    if (!phone.trim()) {
      setError("Please input your mobile phone number.");
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Phone number must contain exactly 10 digital numbers.");
      return;
    }

    const newProfile = registerStudent(name.trim(), phone.trim(), course);
    setGeneratedCode(newProfile.studentCode);
    setSuccessModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleProceed = () => {
    setSuccessModalOpen(false);
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 text-white mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Award className="w-8 h-8 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-wide">Evalo</span>
        </div>

        <Card className="border-2 border-white/20 shadow-xl bg-white rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 font-sans">Create Account</h2>
            <p className="text-sm text-slate-500 mt-1">
              Join thousands of certified computer students today.
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {error && (
              <div className="p-3.5 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              id="name"
              label="Full Student Name"
              placeholder="e.g. Rahul Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <Input
              id="phone"
              label="10-Digit Mobile Phone"
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Select
              id="course"
              label="Select Desired Focus Course"
              value={course}
              onChange={(e) => setCourse(e.target.value as "CCC" | "DCA" | "ADCA")}
              options={[
                { value: "CCC", label: "CCC - Course on Computer Concepts" },
                { value: "DCA", label: "DCA - Diploma in Computer Applications" },
                { value: "ADCA", label: "ADCA - Advance Diploma in Computer Applications" },
              ]}
            />

            <Button type="submit" variant="primary" className="w-full py-3.5 text-base mt-2">
              Generate Student Code
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <span className="text-xs sm:text-sm text-slate-500">
              Already registered?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Student Login
              </Link>
            </span>
          </div>
        </Card>

        {/* Success Modal to Auto-show generated studentCode */}
        <Modal
          isOpen={successModalOpen}
          onClose={handleProceed}
          title="Registration Successful!"
          size="md"
        >
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-500 border-2 border-emerald-100">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900">Your Student Code is Ready!</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Save this code. You will need it and your phone number to sign back in.
              </p>
            </div>

            {/* Custom display code card */}
            <div className="w-full bg-slate-100 p-5 rounded-2xl border-2 border-slate-200 flex items-center justify-between gap-4 font-mono">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block font-sans">
                  Assigned Student Code
                </span>
                <span className="text-2xl font-bold text-indigo-900">{generatedCode}</span>
              </div>

              <Button
                type="button"
                onClick={copyToClipboard}
                variant={copied ? "secondary" : "outline"}
                className={`py-2 px-3 text-xs flex items-center gap-1.5 ${
                  copied ? "text-emerald-700 bg-emerald-50 border-emerald-200" : ""
                }`}
                title="Copy student code to clipboard"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>

            <Button onClick={handleProceed} className="w-full py-3">
              Enter Student Dashboard
            </Button>
          </div>
        </Modal>

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
