import React, { useState } from 'react';
import { Exam } from '../types/quiz';
import {
  BookOpen,
  Clock,
  HelpCircle,
  Play,
  Download,
  PlusCircle,
  History,
  User,
  Trash2,
  CheckCircle,
  FileCode,
  Search,
  Sparkles,
} from 'lucide-react';
import { generateStandaloneHtmlExam } from '../utils/exportHtml';

interface Props {
  exams: Exam[];
  onSelectExam: (exam: Exam) => void;
  onOpenCreateExam: () => void;
  onOpenHistory: () => void;
  onOpenStudentProfile: () => void;
  onDeleteCustomExam?: (examId: string) => void;
  studentName?: string;
}

export const ExamSelector: React.FC<Props> = ({
  exams,
  onSelectExam,
  onOpenCreateExam,
  onOpenHistory,
  onOpenStudentProfile,
  onDeleteCustomExam,
  studentName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  // Extract unique subjects
  const subjects = ['all', ...Array.from(new Set(exams.map((e) => e.subject)))];

  const filteredExams = exams.filter((exam) => {
    const matchesSubject = selectedCategory === 'all' || exam.subject === selectedCategory;
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleDownloadHtml = (e: React.MouseEvent, exam: Exam) => {
    e.stopPropagation();
    const html = generateStandaloneHtmlExam(exam);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BaiThi_${exam.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/15 backdrop-blur-xs text-blue-50 border border-white/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Trang Web Thuần HTML &bull; Hoạt Động 100% Offline
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hệ Thống Làm Bài Thi Trắc Nghiệm Tự Động
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
            Hỗ trợ học sinh làm bài thi trắc nghiệm không cần mạng internet, tự động tính điểm
            ngay lập tức, xem giải thích chi tiết từng câu và xuất file HTML độc lập mang về máy.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={onOpenStudentProfile}
              className="px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-600" />
              {studentName ? `Thí sinh: ${studentName}` : 'Đăng ký thông tin thí sinh'}
            </button>

            <button
              onClick={onOpenCreateExam}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Tạo đề thi bằng AI
            </button>

            <button
              onClick={onOpenHistory}
              className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <History className="w-4 h-4" />
              Lịch sử làm bài
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedCategory(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === subj
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {subj === 'all' ? 'Tất cả các môn' : subj}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm đề thi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            onClick={() => onSelectExam(exam)}
            className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group relative"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-sm border border-blue-200">
                  {exam.subject}
                </span>

                <div className="flex items-center gap-1">
                  {exam.isCustom && onDeleteCustomExam && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExamToDelete(exam);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Xóa đề thi tự tạo này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadHtml(e, exam)}
                    className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors"
                    title="Tải file HTML độc lập chạy offline"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base line-clamp-2">
                {exam.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {exam.description || 'Bộ đề thi trắc nghiệm chuẩn có đầy đủ lời giải chi tiết.'}
              </p>
            </div>

            {/* Card Footer Info */}
            <div className="mt-5 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exam.questions.length} câu trắc nghiệm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {exam.durationMinutes > 0 ? `${exam.durationMinutes} phút` : 'Tự do'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectExam(exam);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Bắt đầu làm bài
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownloadHtml(e, exam)}
                  className="py-2 px-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Xuất file .HTML độc lập"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">HTML</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Exam Confirmation Modal */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-2">Xóa đề thi tự tạo?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Bạn có chắc chắn muốn xóa đề thi <strong>"{examToDelete.title}"</strong> không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteCustomExam) {
                    onDeleteCustomExam(examToDelete.id);
                  }
                  setExamToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
