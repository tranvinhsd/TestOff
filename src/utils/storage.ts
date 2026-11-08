import { Exam, ExamSubmission, StudentInfo } from '../types/quiz';
import { SAMPLE_EXAMS } from '../data/sampleExams';

const STORAGE_KEYS = {
  CUSTOM_EXAMS: 'offline_quiz_custom_exams_v1',
  HISTORY: 'offline_quiz_history_v1',
  STUDENT: 'offline_quiz_student_profile_v1',
  CURRENT_STATE: 'offline_quiz_in_progress_state_v1',
};

export const getStoredStudentInfo = (): StudentInfo => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load student info', e);
  }
  return {
    name: '',
    className: '',
    studentId: '',
  };
};

export const saveStudentInfo = (info: StudentInfo) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save student info', e);
  }
};

export const getAllExams = (): Exam[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    const custom: Exam[] = raw ? JSON.parse(raw) : [];
    return [...SAMPLE_EXAMS, ...custom];
  } catch (e) {
    console.error('Failed to get custom exams', e);
    return SAMPLE_EXAMS;
  }
};

export const saveCustomExam = (exam: Exam): Exam[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    const custom: Exam[] = raw ? JSON.parse(raw) : [];
    const index = custom.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      custom[index] = exam;
    } else {
      custom.unshift(exam);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(custom));
    return [...SAMPLE_EXAMS, ...custom];
  } catch (e) {
    console.error('Failed to save custom exam', e);
    return getAllExams();
  }
};

export const deleteCustomExam = (examId: string): Exam[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    let custom: Exam[] = raw ? JSON.parse(raw) : [];
    custom = custom.filter(e => e.id !== examId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(custom));
    return [...SAMPLE_EXAMS, ...custom];
  } catch (e) {
    console.error('Failed to delete custom exam', e);
    return getAllExams();
  }
};

export const getExamHistory = (): ExamSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const saveExamSubmission = (submission: ExamSubmission): ExamSubmission[] => {
  try {
    const history = getExamHistory();
    history.unshift(submission);
    // Keep last 100 tests
    const trimmed = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    return trimmed;
  } catch (e) {
    console.error('Failed to save submission', e);
    return [];
  }
};

export const clearExamHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
};
