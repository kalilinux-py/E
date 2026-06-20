/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Edit3, Save, CheckCircle, Smartphone, Calendar, FileText, Lock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getStoredProfile, saveStoredProfile } from "../lib/state";
import { StudentProfile } from "../types";

export default function ProfileView() {
  const currentProfile = getStoredProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(
    currentProfile || {
      studentCode: "STUXXXX",
      name: "Student",
      phone: "0000000000",
      course: "CCC",
      joinedDate: new Date().toISOString(),
    }
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(true);
    setSuccess(false);
    setError("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!profile.name.trim()) {
      setError("Name cannot be left blank.");
      return;
    }
    if (profile.name.trim().length < 3) {
      setError("Name must contain at least 3 letters.");
      return;
    }
    if (!profile.phone.trim()) {
      setError("Phone number cannot be empty.");
      return;
    }
    if (!/^\d{10}$/.test(profile.phone.trim())) {
      setError("Phone must contain exactly 10 digits.");
      return;
    }

    // Save profile
    saveStoredProfile({
      ...profile,
      name: profile.name.trim(),
      phone: profile.phone.trim(),
    });

    setIsEditing(false);
    setSuccess(true);
    window.dispatchEvent(new Event("storage")); // Trigger reactive header update
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10 max-w-3xl mx-auto w-full">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight flex items-center gap-2">
          <User className="w-8 h-8 text-indigo-600" />
          My Profile Details
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review your enrolled accreditation attributes, manage registration profiles, and maintain contact info.
        </p>
      </div>

      {/* Main Profile Form Card */}
      <Card className="p-6 sm:p-8 relative overflow-hidden shadow-md">
        {/* Upper colored corner tab */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-505/10 to-transparent pointer-events-none" />

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {success && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2.5 shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Great! Your student profile changes have been saved successfully.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50/60 border border-rose-105 text-rose-800 text-sm font-semibold rounded-xl flex items-center gap-2.5 shadow-xs">
              <Lock className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Read-only Student Code indicator */}
          <div className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-5 flex items-center justify-between gap-4 font-mono shadow-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider block">
                Accredited Student ID
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-800 select-all">
                {profile.studentCode}
              </span>
            </div>
            <Badge variant="default" className="bg-indigo-50 text-indigo-750 border-indigo-100 flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 shadow-xs">
              <Lock className="w-3 h-3" /> Private Code
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            {/* Student Name */}
            <div className="relative">
              <Input
                id="profile-name"
                label="Full Student Name"
                placeholder="Rahul Kumar"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
              <User className="absolute right-3.5 bottom-3.5 w-5 h-5 text-slate-300 pointer-events-none" />
            </div>

            {/* Mobile Contact */}
            <div className="relative">
              <Input
                id="profile-phone"
                label="Registered Mobile Contact"
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
              <Smartphone className="absolute right-3.5 bottom-3.5 w-5 h-5 text-slate-300 pointer-events-none" />
            </div>

            {/* Course Dropdown Selector */}
            <div className="relative md:col-span-2">
              <Select
                id="profile-course"
                label="Select Enrolled Core Focus"
                value={profile.course}
                onChange={(e) => setProfile({ ...profile, course: e.target.value as "CCC" | "DCA" | "ADCA" })}
                disabled={!isEditing}
                options={[
                  { value: "CCC", label: "CCC - Course on Computer Concepts" },
                  { value: "DCA", label: "DCA - Diploma in Computer Applications" },
                  { value: "ADCA", label: "ADCA - Advance Diploma in Computer Applications" },
                ]}
              />
            </div>
          </div>

          {/* Static Joined Date Display */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4.5 mt-2 text-slate-500">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-slate-400 block uppercase text-[10px]">Registry Date</span>
              <span className="font-medium text-slate-600">
                {new Date(profile.joinedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Form Actions edit / save */}
          <div className="flex justify-end gap-3.5 border-t border-slate-100 pt-6 mt-2">
            {!isEditing ? (
              <Button
                type="button"
                onClick={handleEditToggle}
                variant="outline"
                className="py-3 px-6 text-base inline-flex items-center gap-2 font-bold cursor-pointer transition-transform hover:scale-103"
              >
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Edit Profile Information</span>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setProfile(currentProfile || profile);
                  }}
                  variant="ghost"
                  className="py-3 px-5 font-semibold text-slate-600 hover:text-indigo-600 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="py-3 px-6 text-base inline-flex items-center gap-2 font-bold cursor-pointer transition-transform hover:scale-103"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Profile Changes</span>
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
