/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, Attempt } from "../types";
import { mockTestsList } from "../data/mockTests";

// Initial seed profile for demo purposes so user can login with STU7492 immediately
const SEED_PROFILE: StudentProfile = {
  studentCode: "STU7492",
  name: "Rahul Kumar",
  phone: "9876543210",
  course: "CCC",
  joinedDate: "2026-01-15T10:00:00.000Z",
};

// Seed attempts that populates dashboard nicely with 5 realistic, full-featured rows
const SEED_ATTEMPTS: Attempt[] = [
  {
    id: "att-1",
    testId: "ccc-test-1",
    testTitle: "CCC Core Syllabus Exam",
    course: "CCC",
    startedAt: "2026-05-10T14:00:00.000Z",
    completedAt: "2026-05-10T14:28:10.000Z",
    score: 45,
    totalQuestions: 60,
    status: "Completed",
    answers: Array.from({ length: 60 }).reduce<{ [key: number]: string }>((acc, _, idx) => {
      // 45 correct answers, 15 incorrect
      const qNum = idx + 1;
      const test = mockTestsList.find(t => t.id === "ccc-test-1");
      const correct = test?.questions[idx]?.correctOption || "A";
      if (idx < 45) {
        acc[qNum] = correct;
      } else {
        const alt: { [key: string]: string } = { A: "B", B: "C", C: "D", D: "A" };
        acc[qNum] = alt[correct];
      }
      return acc;
    }, {}),
  },
  {
    id: "att-2",
    testId: "dca-test-1",
    testTitle: "DCA Comprehensive Practice Test",
    course: "DCA",
    startedAt: "2026-05-22T11:00:00.000Z",
    completedAt: "2026-05-22T11:29:45.000Z",
    score: 52,
    totalQuestions: 60,
    status: "Completed",
    answers: Array.from({ length: 60 }).reduce<{ [key: number]: string }>((acc, _, idx) => {
      const qNum = idx + 1;
      const test = mockTestsList.find(t => t.id === "dca-test-1");
      const correct = test?.questions[idx]?.correctOption || "B";
      if (idx < 52) {
        acc[qNum] = correct;
      } else {
        const alt: { [key: string]: string } = { A: "C", B: "D", C: "A", D: "B" };
        acc[qNum] = alt[correct];
      }
      return acc;
    }, {}),
  },
  {
    id: "att-3",
    testId: "ccc-test-1",
    testTitle: "CCC Core Syllabus Exam",
    course: "CCC",
    startedAt: "2026-06-02T09:30:00.000Z",
    completedAt: "2026-06-02T09:59:12.000Z",
    score: 38,
    totalQuestions: 60,
    status: "Completed",
    answers: Array.from({ length: 60 }).reduce<{ [key: number]: string }>((acc, _, idx) => {
      const qNum = idx + 1;
      const test = mockTestsList.find(t => t.id === "ccc-test-1");
      const correct = test?.questions[idx]?.correctOption || "A";
      if (idx < 38) {
        acc[qNum] = correct;
      } else {
        const alt: { [key: string]: string } = { A: "D", B: "C", C: "B", D: "A" };
        acc[qNum] = alt[correct];
      }
      return acc;
    }, {}),
  },
  {
    id: "att-4",
    testId: "adca-test-1",
    testTitle: "ADCA Advanced Evaluation Challenge",
    course: "ADCA",
    startedAt: "2026-06-12T16:15:00.000Z",
    completedAt: "2026-06-12T16:44:02.000Z",
    score: 55,
    totalQuestions: 60,
    status: "Completed",
    answers: Array.from({ length: 60 }).reduce<{ [key: number]: string }>((acc, _, idx) => {
      const qNum = idx + 1;
      const test = mockTestsList.find(t => t.id === "adca-test-1");
      const correct = test?.questions[idx]?.correctOption || "C";
      if (idx < 55) {
        acc[qNum] = correct;
      } else {
        const alt: { [key: string]: string } = { A: "B", B: "A", C: "D", D: "C" };
        acc[qNum] = alt[correct];
      }
      return acc;
    }, {}),
  },
  {
    id: "att-5",
    testId: "dca-test-1",
    testTitle: "DCA Comprehensive Practice Test",
    course: "DCA",
    startedAt: "2026-06-18T10:00:22.000Z",
    completedAt: null,
    score: 0,
    totalQuestions: 60,
    status: "In Progress",
    answers: { 1: "A", 2: "C" },
  }
];

export function getStoredProfile(): StudentProfile | null {
  const profileStr = localStorage.getItem("student_profile");
  if (!profileStr) return null;
  try {
    return JSON.parse(profileStr);
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile) {
  localStorage.setItem("student_profile", JSON.stringify(profile));
  
  // Also store in user directory registry so they can log back in with their code
  const users = getRegisteredUsers();
  users[profile.studentCode] = profile;
  localStorage.setItem("registered_users", JSON.stringify(users));
}

export function logoutProfile() {
  localStorage.removeItem("student_profile");
}

export function getRegisteredUsers(): { [studentCode: string]: StudentProfile } {
  const usersStr = localStorage.getItem("registered_users");
  if (!usersStr) {
    const initialUsers = { [SEED_PROFILE.studentCode]: SEED_PROFILE };
    localStorage.setItem("registered_users", JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(usersStr);
  } catch {
    return {};
  }
}

export function getStoredAttempts(): Attempt[] {
  const attemptsStr = localStorage.getItem("test_attempts");
  if (!attemptsStr) {
    localStorage.setItem("test_attempts", JSON.stringify(SEED_ATTEMPTS));
    return SEED_ATTEMPTS;
  }
  try {
    return JSON.parse(attemptsStr);
  } catch {
    return SEED_ATTEMPTS;
  }
}

export function saveStoredAttempts(attempts: Attempt[]) {
  localStorage.setItem("test_attempts", JSON.stringify(attempts));
}

export function loginStudent(studentCode: string, phone: string): StudentProfile | null {
  const users = getRegisteredUsers();
  const found = users[studentCode.toUpperCase().trim()];
  if (found && found.phone.trim() === phone.trim()) {
    localStorage.setItem("student_profile", JSON.stringify(found));
    return found;
  }
  return null;
}

export function registerStudent(name: string, phone: string, course: "CCC" | "DCA" | "ADCA"): StudentProfile {
  const randNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random code
  const studentCode = `STU${randNum}`;
  const newProfile: StudentProfile = {
    studentCode,
    name,
    phone,
    course,
    joinedDate: new Date().toISOString()
  };
  
  const users = getRegisteredUsers();
  users[studentCode] = newProfile;
  localStorage.setItem("registered_users", JSON.stringify(users));
  localStorage.setItem("student_profile", JSON.stringify(newProfile));
  
  return newProfile;
}
