export interface Question {
  id: string;
  question: string;
  options: string[]; // [Option A, Option B, Option C, Option D]
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
  category?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Khó';
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  durationMinutes: number; // in minutes (0 for unlimited)
  questions: Question[];
  createdAt: string;
  isCustom?: boolean;
}

export interface StudentInfo {
  name: string;
  className: string;
  studentId: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  student: StudentInfo;
  startedAt: string;
  completedAt: string;
  durationTakenSeconds: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  score: number; // Scale of 10
  percentage: number;
  userAnswers: Record<string, number>; // questionId -> selected option index (0..3)
  feedbackRank: string;
}
