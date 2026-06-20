/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, CheckCircle2, BookOpen, BarChart3, Clock, ArrowRight, ShieldCheck, HelpCircle, Users } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Evalo
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Login
          </Link>
          <Button onClick={() => navigate("/signup")} variant="primary" className="text-xs sm:text-sm py-2">
            Signup
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/50 via-purple-50/20 to-white py-16 md:py-24 px-6 text-center max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge variant="purple" className="px-4 py-1 text-xs">
            🎓 Premium Student Exam Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-950 font-sans">
            Level Up with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Evalo
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl">
            Practice Mock Tests & Improve Results. Achieve your dream certifications on national computer courses with instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4 w-full sm:w-auto">
            <Button onClick={() => navigate("/signup")} className="w-full sm:w-auto px-8 py-3.5 text-lg">
              Start Free Trial <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button onClick={() => navigate("/login")} variant="outline" className="w-full sm:w-auto px-8 py-3.5 text-lg">
              Take Practice Exam
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Awesome Features</h2>
          <p className="text-slate-600 mt-2">Engineered strictly to boost your final examination aggregate.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverable className="p-2">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-7 h-7" />
                <h3 className="text-lg font-bold">Instant Results</h3>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <p className="text-slate-600 text-sm">
                Get scored instantly after pressing submit. Review full analytics of incorrect flags with rich expert guidelines in milliseconds.
              </p>
            </CardContent>
          </Card>

          <Card hoverable className="p-2">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7" />
                <h3 className="text-lg font-bold">Performance Tracking</h3>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <p className="text-slate-600 text-sm">
                Track exam histories, daily streak counters, score logs, time-taken curves, and see which questions are frequently answered incorrectly.
              </p>
            </CardContent>
          </Card>

          <Card hoverable className="p-2">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-7 h-7" />
                <h3 className="text-lg font-bold">Multiple Courses</h3>
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <p className="text-slate-600 text-sm">
                Specially-tuned question databases spanning national certification guidelines like CCC, DCA applications, and advanced ADCA accounting.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/50 py-16 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
            <p className="text-slate-600 mt-2">Follow our four-step progress strategy to score above 90%.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register", desc: "Create a verified secure mock testing account in 10 seconds." },
              { step: "02", title: "Select Course", desc: "Select corresponding testing syllabi ranging from CCC, DCA to ADCA." },
              { step: "03", title: "Take Test", desc: "Answer 60 questions in a strict 30-minute exam simulated screen." },
              { step: "04", title: "See Result", desc: "Obtain detailed diagnostics, scoring trends, and complete explanations." }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-100 rounded-xl p-6 shadow-md relative hover:scale-102 transition-transform duration-200">
                <div className="absolute top-4 right-4 text-3xl font-extrabold text-indigo-100 font-mono">
                  {s.step}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 pt-4">{s.title}</h4>
                <p className="text-slate-600 text-xs sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Available Courses</h2>
          <p className="text-slate-600 mt-2">Targeted tests with real exam-style syllabus standards.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              code: "CCC",
              title: "Course on Computer Concepts",
              desc: "Perfect for foundational certification. Covers LibreOffice (Writer, Calc, Impress), basic Windows, internet communications, and general IT applications.",
              badge: "Foundational"
            },
            {
              code: "DCA",
              title: "Diploma in Computer Applications",
              desc: "Deepen spreadsheet, document, and structural web abilities. Features MS Office tools (Word, Access, Excel), DOS operations, and essential HTML styles.",
              badge: "Intermediate"
            },
            {
              code: "ADCA",
              title: "Advance Diploma in Computer Applications",
              desc: "High-tier accounting, network routing and programming competencies. Evaluates expertise under Tally ERP9 with GST, Photoshop editing, and SQL structures.",
              badge: "Advanced"
            }
          ].map((c, i) => (
            <Card key={i} hoverable className="flex flex-col h-full bg-white border-2 border-slate-100 rounded-xl shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                <span className="font-mono text-xl font-bold">{c.code}</span>
                <Badge variant="purple">{c.badge}</Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <h4 className="font-bold text-lg text-slate-900 mt-2">{c.title}</h4>
                <p className="text-slate-600 text-sm mt-2">{c.desc}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button onClick={() => navigate("/signup", { state: { course: c.code } })} variant="outline" className="w-full">
                  Explore Mock Test
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits / Stats Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Achievements</h2>
            <p className="text-indigo-200 mt-2">Trusted by students nationwide to deliver premium test preparation.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "10,000+", label: "Students Served", icon: <Users className="w-6 h-6 text-purple-300" /> },
              { val: "500+", label: "Mock tests", icon: <CheckCircle2 className="w-6 h-6 text-purple-300" /> },
              { val: "95%", label: "Success Rate", icon: <ShieldCheck className="w-6 h-6 text-purple-300" /> },
              { val: "24/7", label: "Student Support", icon: <HelpCircle className="w-6 h-6 text-purple-300" /> }
            ].map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <div className="p-3 bg-white/10 rounded-xl mb-3">
                  {st.icon}
                </div>
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-purple-100">{st.val}</span>
                <span className="text-xs md:text-sm text-indigo-200 font-semibold mt-1">{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 px-6 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">Evalo Ltd</span>
            </div>
            <p className="text-xs text-slate-400">
              Transforming standard exam practice into certified outcomes. Master computer certification courses instantly.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-bold text-white text-sm">Quick Links</h5>
            <Link to="/login" className="text-xs text-slate-400 hover:text-indigo-400 transition-colors">Student Login</Link>
            <Link to="/signup" className="text-xs text-slate-400 hover:text-indigo-400 transition-colors">Student Registration</Link>
          </div>
          <div>
            <h5 className="font-bold text-white text-sm mb-2">Copyright Disclaimer</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              &copy; {new Date().getFullYear()} Evalo. All layout frames, syllabus elements, and test modules are strictly aligned with accredited educational structures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
