import React, { useState, useEffect } from 'react';
import { Exam, StudentInfo, ExamSubmission } from './types/quiz';
import {
  getAllExams,
  saveCustomExam,
  deleteCustomExam,
  getExamHistory,
  saveExamSubmission,
  clearExamHistory,
  getStoredStudentInfo,
  saveStudentInfo,
} from './utils/storage';
import { Header } from './components/Header';
import { ExamSelector } from './components/ExamSelector';
import { QuizTakingView } from './components/QuizTakingView';
import { QuizResultView } from './components/QuizResultView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ExamEditorModal } from './components/ExamEditorModal';
import { HistoryModal } from './components/HistoryModal';
import { WifiOff, Code, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentView, setCurrentView] = useState<'selector' | 'taking' | 'result'>('selector');
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    className: '',
    studentId: '',
  });
  const [latestSubmission, setLatestSubmission] = useState<ExamSubmission | null>(null);
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const [historyList, setHistoryList] = useState<ExamSubmission[]>([]);

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const loadedExams = getAllExams();
    setExams(loadedExams);

    const loadedStudent = getStoredStudentInfo();
    setStudentInfo(loadedStudent);

    const loadedHistory = getExamHistory();
    setHistoryList(loadedHistory);
  }, []);

  const handleSaveStudent = (info: StudentInfo) => {
    setStudentInfo(info);
    saveStudentInfo(info);
  };

  const handleSelectExam = (exam: Exam) => {
    // If student name is empty, open profile modal first, but still let them start
    setActiveExam(exam);
    setFlaggedQuestionIds(new Set());
    setLatestSubmission(null);
    setCurrentView('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitQuiz = (submission: ExamSubmission, flaggedIds: Set<string>) => {
    setLatestSubmission(submission);
    setFlaggedQuestionIds(flaggedIds);
    const updatedHistory = saveExamSubmission(submission);
    setHistoryList(updatedHistory);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeExam = () => {
    if (activeExam) {
      setLatestSubmission(null);
      setFlaggedQuestionIds(new Set());
      setCurrentView('taking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToExams = () => {
    setActiveExam(null);
    setLatestSubmission(null);
    setCurrentView('selector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNewExam = (newExam: Exam) => {
    const updated = saveCustomExam(newExam);
    setExams(updated);
  };

  const handleDeleteExam = (examId: string) => {
    const updated = deleteCustomExam(examId);
    setExams(updated);
  };

  const handleClearHistory = () => {
    clearExamHistory();
    setHistoryList([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        student={studentInfo}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenCreateExam={() => setIsCreateModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onHomeClick={handleBackToExams}
        historyCount={historyList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'selector' && (
          <ExamSelector
            exams={exams}
            onSelectExam={handleSelectExam}
            onOpenCreateExam={() => setIsCreateModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onOpenStudentProfile={() => setIsStudentModalOpen(true)}
            onDeleteCustomExam={handleDeleteExam}
            studentName={studentInfo.name}
          />
        )}

        {currentView === 'taking' && activeExam && (
          <QuizTakingView
            exam={activeExam}
            student={studentInfo}
            onBack={handleBackToExams}
            onSubmit={handleSubmitQuiz}
            onUpdateStudent={handleSaveStudent}
          />
        )}

        {currentView === 'result' && activeExam && latestSubmission && (
          <QuizResultView
            exam={activeExam}
            submission={latestSubmission}
            flaggedQuestionIds={flaggedQuestionIds}
            onRetake={handleRetakeExam}
            onBackToExams={handleBackToExams}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              <WifiOff className="w-3 h-3" />
              100% Offline Capable
            </span>
            <span>·</span>
            <span>Lưu trữ cục bộ LocalStorage</span>
            <span>·</span>
            <span>Tự động chấm điểm tức thì</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Dành cho học sinh & giáo viên làm bài thi trắc nghiệm</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentInfo={studentInfo}
        onSave={handleSaveStudent}
      />

      <ExamEditorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveExam={handleSaveNewExam}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        submissions={historyList}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
