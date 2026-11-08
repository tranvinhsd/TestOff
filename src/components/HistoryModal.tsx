import React from 'react';
import { ExamSubmission } from '../types/quiz';
import { History, Trash2, X, Award, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submissions: ExamSubmission[];
  onClearHistory: () => void;
  onViewSubmission?: (submission: ExamSubmission) => void;
}

export const HistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  submissions,
  onClearHistory,
  onViewSubmission,
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Lịch Sử Làm Bài Thi Offline</h3>
              <p className="text-xs text-slate-500">
                Các bài thi trắc nghiệm đã hoàn thành và chấm điểm trên máy này ({submissions.length})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Chưa có kết quả làm bài nào</p>
              <p className="text-xs text-slate-400 mt-1">
                Khi học sinh hoàn thành bất kỳ bài thi nào, kết quả và điểm số sẽ được ghi lại tại đây.
              </p>
            </div>
          ) : (
            submissions.map((sub) => {
              const dateStr = new Date(sub.completedAt).toLocaleString('vi-VN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });
              const mins = Math.floor(sub.durationTakenSeconds / 60);
              const secs = sub.durationTakenSeconds % 60;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                        {sub.subject}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{sub.examTitle}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Thí sinh: <strong>{sub.student.name || 'Tự do'}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {dateStr}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {mins}p {secs}s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-blue-600">
                        {sub.score.toFixed(1)} <span className="text-xs font-semibold text-slate-400">/ 10</span>
                      </div>
                      <div className="text-xs font-medium text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {sub.correctCount}/{sub.totalQuestions} câu ({sub.percentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
          {submissions.length > 0 ? (
            isConfirmingClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-semibold">Chắc chắn xóa?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setIsConfirmingClear(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
                >
                  Xóa ngay
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingClear(true)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xóa toàn bộ lịch sử
              </button>
            )
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
