import React, { useState } from 'react';
import { Exam, ExamSubmission, Question } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { generateStandaloneHtmlExam } from '../utils/exportHtml';

interface Props {
  exam: Exam;
  submission: ExamSubmission;
  flaggedQuestionIds: Set<string>;
  onRetake: () => void;
  onBackToExams: () => void;
}

export const QuizResultView: React.FC<Props> = ({
  exam,
  submission,
  flaggedQuestionIds,
  onRetake,
  onBackToExams,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct' | 'flagged'>('all');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const filteredQuestions = exam.questions.filter((q) => {
    const studentAnswer = submission.userAnswers[q.id];
    const isCorrect = studentAnswer === q.correctAnswer;
    const isFlagged = flaggedQuestionIds.has(q.id);

    if (filterType === 'wrong') return !isCorrect;
    if (filterType === 'correct') return isCorrect;
    if (filterType === 'flagged') return isFlagged;
    return true;
  });

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtmlExam(exam);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaiThi_Offline_${exam.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút ${s} giây`;
  };

  // Color scheme based on score
  let scoreTheme = {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-600',
  };

  if (submission.score < 5) {
    scoreTheme = {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      badge: 'bg-rose-600',
    };
  } else if (submission.score < 7) {
    scoreTheme = {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-600',
    };
  } else if (submission.score < 8.5) {
    scoreTheme = {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-600',
    };
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Score Summary Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${scoreTheme.border} ${scoreTheme.bg} shadow-xs`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Kết quả làm bài trắc nghiệm
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {exam.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                {submission.student.name || 'Thí sinh tự do'}
                {submission.student.className ? ` - Lớp ${submission.student.className}` : ''}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                Làm trong: {formatDuration(submission.durationTakenSeconds)}
              </span>
              <span>·</span>
              <span>Ngày: {new Date(submission.completedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          {/* Big Score Dial */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-2 border-slate-200/80 shadow-md flex flex-col items-center justify-center p-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {submission.score.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Thang điểm 10
              </span>
            </div>
            <span className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs ${scoreTheme.badge}`}>
              {submission.feedbackRank} ({submission.percentage}%)
            </span>
          </div>
        </div>

        {/* Mini stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/60">
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Số câu đúng</div>
            <div className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {submission.correctCount} / {submission.totalQuestions}
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Số câu làm sai</div>
            <div className="text-xl font-bold text-rose-600 mt-0.5 flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4" />
              {submission.wrongCount} câu
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Chưa trả lời</div>
            <div className="text-xl font-bold text-slate-600 mt-0.5 flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4" />
              {submission.skippedCount} câu
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Tỷ lệ chính xác</div>
            <div className="text-xl font-bold text-blue-600 mt-0.5">
              {submission.percentage}%
            </div>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-6 pt-5 border-t border-slate-200/60">
          <button
            onClick={onRetake}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại đề này
          </button>

          <button
            onClick={onBackToExams}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Chọn đề thi khác
          </button>

          <button
            onClick={handleDownloadStandaloneHtml}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-2 cursor-pointer ml-auto"
            title="Tải về máy file .html để chạy offline bất cứ đâu không cần mạng"
          >
            <Download className="w-4 h-4" />
            Xuất file HTML Offline
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="In đề thi kèm lời giải ra giấy / lưu PDF"
          >
            <Printer className="w-4 h-4" />
            In phiếu điểm
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Xem lại chi tiết bài làm:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({exam.questions.length})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'wrong'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Câu sai & bỏ trống ({submission.wrongCount + submission.skippedCount})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Câu đúng ({submission.correctCount})
            </button>
            {flaggedQuestionIds.size > 0 && (
              <button
                onClick={() => setFilterType('flagged')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filterType === 'flagged'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã cắm cờ ({flaggedQuestionIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Questions list in review mode */}
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Không có câu hỏi nào theo bộ lọc đã chọn.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const originalIndex = exam.questions.findIndex((item) => item.id === q.id);
              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={originalIndex >= 0 ? originalIndex : 0}
                  totalQuestions={exam.questions.length}
                  selectedOptionIndex={submission.userAnswers[q.id]}
                  isFlagged={flaggedQuestionIds.has(q.id)}
                  onSelectOption={() => {}}
                  onToggleFlag={() => {}}
                  isReviewMode={true}
                  fontSizeClass={fontSize === 'large' ? 'text-lg' : 'text-base'}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
