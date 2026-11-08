import React from 'react';
import {
  FileCode2,
  User,
  History,
  PlusCircle,
  WifiOff,
  Download,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { StudentInfo } from '../types/quiz';

interface Props {
  student: StudentInfo;
  onOpenStudentModal: () => void;
  onOpenCreateExam: () => void;
  onOpenHistory: () => void;
  onHomeClick: () => void;
  historyCount: number;
}

export const Header: React.FC<Props> = ({
  student,
  onOpenStudentModal,
  onOpenCreateExam,
  onOpenHistory,
  onHomeClick,
  historyCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Trắc Nghiệm HTML
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <WifiOff className="w-3 h-3" />
                Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Hệ thống thi & chấm điểm tự động tức thì
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Profile Button */}
          <button
            onClick={onOpenStudentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer"
            title="Xem và chỉnh sửa thông tin học sinh"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[120px] truncate">
              {student.name ? student.name : 'Nhập thông tin'}
            </span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Lịch sử làm bài"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Lịch sử</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Create Exam Button */}
          <button
            onClick={onOpenCreateExam}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo đề AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
