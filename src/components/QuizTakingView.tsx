import React, { useState, useEffect, useRef } from 'react';
import { Exam, StudentInfo, ExamSubmission } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { QuestionMatrix } from './QuestionMatrix';
import {
  Clock,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Send,
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X,
  FileCheck,
} from 'lucide-react';

interface Props {
  exam: Exam;
  student: StudentInfo;
  onBack: () => void;
  onSubmit: (submission: ExamSubmission, flaggedIds: Set<string>) => void;
  onUpdateStudent: (info: StudentInfo) => void;
}

export const QuizTakingView: React.FC<Props> = ({
  exam,
  student,
  onBack,
  onSubmit,
  onUpdateStudent,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Confirmation Modals (in-app, no window.confirm or alert to avoid iframe blocking)
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);

  // Timer states
  const durationSeconds = exam.durationMinutes > 0 ? exam.durationMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationSeconds);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const startTimeRef = useRef<string>(new Date().toISOString());

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (durationSeconds > 0) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Automatic submit on timeout
            calculateAndSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [durationSeconds]);

  // Keyboard navigation for choices (1-4, A-D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal is open or typing in input
      if (showSubmitModal || showLeaveModal) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const activeQ = exam.questions[currentQuestionIndex];
      if (!activeQ) return;

      const key = e.key.toUpperCase();
      let selectedIdx = -1;

      if (key === 'A' || key === '1') selectedIdx = 0;
      else if (key === 'B' || key === '2') selectedIdx = 1;
      else if (key === 'C' || key === '3') selectedIdx = 2;
      else if (key === 'D' || key === '4') selectedIdx = 3;

      if (selectedIdx >= 0 && selectedIdx < activeQ.options.length) {
        handleSelectAnswer(activeQ.id, selectedIdx);
      } else if (key === 'F') {
        handleToggleFlag(activeQ.id);
      } else if (key === 'ARROWLEFT' && viewMode === 'single') {
        handlePrevQuestion();
      } else if (key === 'ARROWRIGHT' && viewMode === 'single') {
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, viewMode, exam.questions, showSubmitModal, showLeaveModal]);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearAnswer = (questionId: string) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const scrollToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    if (viewMode === 'all') {
      const element = document.getElementById(`question-card-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const calculateAndSubmit = () => {
    setShowSubmitModal(false);

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    exam.questions.forEach((q) => {
      const studentAns = userAnswers[q.id];
      if (studentAns === undefined) {
        skippedCount++;
      } else if (studentAns === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = exam.questions.length;
    const score10 = Number(((correctCount / total) * 10).toFixed(2));
    const percentage = Math.round((correctCount / total) * 100);

    let feedbackRank = 'Cần Cố Gắng';
    if (score10 >= 9) feedbackRank = 'Xuất Sắc';
    else if (score10 >= 8) feedbackRank = 'Giỏi';
    else if (score10 >= 6.5) feedbackRank = 'Khá';
    else if (score10 >= 5) feedbackRank = 'Trung Bình';

    const submission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      student: {
        name: student.name.trim() || 'Thí sinh tự do',
        className: student.className.trim(),
        studentId: student.studentId.trim(),
      },
      startedAt: startTimeRef.current,
      completedAt: new Date().toISOString(),
      durationTakenSeconds: secondsElapsed,
      totalQuestions: total,
      correctCount,
      wrongCount,
      skippedCount,
      score: score10,
      percentage,
      userAnswers,
      feedbackRank,
    };

    onSubmit(submission, flaggedQuestionIds);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const total = exam.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = total - answeredCount;
  const progressPercent = Math.round((answeredCount / total) * 100);
  const isTimeRunningLow = durationSeconds > 0 && secondsRemaining <= 120;

  return (
    <div className="space-y-4 pb-16">
      {/* Top Floating Control Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Quay lại danh sách đề thi"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {exam.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{exam.subject}</span>
                <span>·</span>
                <span>{exam.questions.length} câu trắc nghiệm</span>
                {student.name && (
                  <>
                    <span>·</span>
                    <span className="text-slate-700 font-medium">TS: {student.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls: Timer & Submit */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Cuộn tất cả
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'single' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Từng câu một
              </button>
            </div>

            {/* Font size */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  fontSize === 'normal' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Cỡ chữ tiêu chuẩn"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  fontSize === 'large' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
                }`}
                title="Cỡ chữ phóng lớn"
              >
                A+
              </button>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold font-mono ${
                isTimeRunningLow
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-50 text-slate-800 border-slate-300'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                {durationSeconds > 0 ? formatTimer(secondsRemaining) : formatTimer(secondsElapsed)}
              </span>
            </div>

            {/* Submit Button in Header */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Column: Questions */}
        <div className="lg:col-span-8 space-y-4">
          {/* Student Info Quick Edit Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Thí sinh:
              </span>
              <span>{student.name || 'Chưa điền tên'}</span>
              {student.className && <span>| Lớp: {student.className}</span>}
              {student.studentId && <span>| SBD: {student.studentId}</span>}
            </div>

            <div className="text-slate-500 flex items-center gap-2">
              <span>Phím tắt: [1-4] hoặc [A-D] chọn đáp án &bull; [F] cắm cờ</span>
            </div>
          </div>

          {/* Questions Rendering */}
          {viewMode === 'all' ? (
            <div className="space-y-4">
              {exam.questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  totalQuestions={exam.questions.length}
                  selectedOptionIndex={userAnswers[q.id]}
                  isFlagged={flaggedQuestionIds.has(q.id)}
                  onSelectOption={(optIdx) => handleSelectAnswer(q.id, optIdx)}
                  onClearOption={() => handleClearAnswer(q.id)}
                  onToggleFlag={() => handleToggleFlag(q.id)}
                  fontSizeClass={fontSize === 'large' ? 'text-lg' : 'text-base'}
                />
              ))}

              {/* Bottom Big Submit Button */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-xs">
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Đã hoàn thành {answeredCount} / {exam.questions.length} câu hỏi
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  {unansweredCount > 0
                    ? `Bạn còn ${unansweredCount} câu chưa chọn đáp án. Bạn có thể kiểm tra lại hoặc nộp bài để chấm điểm ngay.`
                    : 'Tuyệt vời! Bạn đã trả lời đủ tất cả các câu hỏi trong đề thi.'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-sm inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Hoàn Thành & Chấm Điểm Bài Thi
                </button>
              </div>
            </div>
          ) : (
            // Single question mode
            <div className="space-y-4">
              {exam.questions[currentQuestionIndex] && (
                <QuestionCard
                  question={exam.questions[currentQuestionIndex]}
                  index={currentQuestionIndex}
                  totalQuestions={exam.questions.length}
                  selectedOptionIndex={userAnswers[exam.questions[currentQuestionIndex].id]}
                  isFlagged={flaggedQuestionIds.has(exam.questions[currentQuestionIndex].id)}
                  onSelectOption={(optIdx) =>
                    handleSelectAnswer(exam.questions[currentQuestionIndex].id, optIdx)
                  }
                  onClearOption={() =>
                    handleClearAnswer(exam.questions[currentQuestionIndex].id)
                  }
                  onToggleFlag={() =>
                    handleToggleFlag(exam.questions[currentQuestionIndex].id)
                  }
                  fontSizeClass={fontSize === 'large' ? 'text-lg' : 'text-base'}
                />
              )}

              {/* Next / Previous Question Navigation */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>

                <span className="text-xs font-semibold text-slate-500">
                  Câu {currentQuestionIndex + 1} trên {exam.questions.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  Câu tiếp
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Navigation Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Bảng Câu Hỏi</h3>
                <span className="text-xs font-bold text-blue-600">
                  {answeredCount}/{exam.questions.length} câu
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Matrix of question buttons */}
              <QuestionMatrix
                questions={exam.questions}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                flaggedQuestionIds={flaggedQuestionIds}
                onSelectQuestion={scrollToQuestion}
                isReviewMode={false}
              />

              {/* Submit CTA */}
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-4 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Nộp bài & Chấm điểm tức thì
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* In-App Submit Confirmation Dialog (Ensures NO window.confirm is used) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${unansweredCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  {unansweredCount > 0 ? <AlertTriangle className="w-6 h-6" /> : <FileCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Xác Nhận Nộp Bài</h3>
                  <p className="text-xs text-slate-500">Hệ thống sẽ chấm điểm tự động ngay lập tức</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-700">
                <span>Tổng số câu hỏi:</span>
                <strong>{total} câu</strong>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã chọn đáp án:
                </span>
                <strong>{answeredCount} câu ({progressPercent}%)</strong>
              </div>
              {unansweredCount > 0 ? (
                <div className="flex items-center justify-between text-amber-700 font-semibold bg-amber-50/80 -mx-2 px-2 py-1.5 rounded-lg border border-amber-200">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Chưa trả lời:
                  </span>
                  <span>{unansweredCount} câu</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Trạng thái:</span>
                  <span>Đã hoàn thành 100% câu hỏi</span>
                </div>
              )}
              {flaggedQuestionIds.size > 0 && (
                <div className="flex items-center justify-between text-amber-600 text-xs">
                  <span className="flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5" />
                    Số câu đang cắm cờ:
                  </span>
                  <span>{flaggedQuestionIds.size} câu</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-500 text-xs pt-1 border-t border-slate-200">
                <span>Thời gian đã làm:</span>
                <span>{formatTimer(secondsElapsed)}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg mb-4 border border-amber-200/80 leading-relaxed">
                ⚠️ Chú ý: Bạn vẫn còn <strong>{unansweredCount} câu chưa làm</strong>. Các câu chưa chọn đáp án sẽ được tính là sai khi chấm điểm.
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={calculateAndSubmit}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Nộp bài & Chấm điểm ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Leave Confirmation Dialog */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Rời khỏi bài thi?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Nếu quay lại bây giờ, các câu trả lời bạn đã chọn trong lượt làm bài này sẽ không được lưu vào bảng điểm.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Ở lại làm tiếp
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  onBack();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
              >
                Xác nhận rời đi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
