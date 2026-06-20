/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  course: "CCC" | "DCA" | "ADCA";
  duration: number; // in minutes (e.g. 30)
  totalQuestions: number; // e.g. 60
  description: string;
  questions: Question[];
}

export interface Attempt {
  id: string;
  testId: string;
  testTitle: string;
  course: "CCC" | "DCA" | "ADCA";
  startedAt: string;
  completedAt: string | null;
  score: number; // number of correct answers
  totalQuestions: number;
  status: "Completed" | "In Progress";
  answers: { [questionId: number]: string }; // questionId -> selectedOption ("A", "B", "C", "D")
}

export interface StudentProfile {
  studentCode: string;
  name: string;
  phone: string;
  course: "CCC" | "DCA" | "ADCA";
  joinedDate: string;
}
