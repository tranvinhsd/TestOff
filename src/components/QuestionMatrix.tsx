import React from 'react';
import { Question } from '../types/quiz';
import { Flag, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  flaggedQuestionIds: Set<string>;
  onSelectQuestion: (index: number) => void;
  isReviewMode?: boolean;
}

export const QuestionMatrix: React.FC<Props> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  flaggedQuestionIds,
  onSelectQuestion,
  isReviewMode = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isFlagged = flaggedQuestionIds.has(q.id);
          const isCurrent = currentQuestionIndex === idx;

          let bgClasses = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400';

          if (isReviewMode) {
            const studentAnswer = userAnswers[q.id];
            if (studentAnswer === q.correctAnswer) {
              bgClasses = 'bg-emerald-600 border-emerald-600 text-white font-bold';
            } else if (studentAnswer !== undefined) {
              bgClasses = 'bg-rose-600 border-rose-600 text-white font-bold';
            } else {
              bgClasses = 'bg-slate-200 border-slate-300 text-slate-600 font-medium';
            }
          } else {
            if (isAnswered) {
              bgClasses = 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs';
            }
          }

          if (isCurrent && !isReviewMode) {
            bgClasses += ' ring-2 ring-blue-500 ring-offset-2 ring-offset-white';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-9 rounded-md border text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${bgClasses}`}
              title={`Câu ${idx + 1}: ${isAnswered ? 'Đã làm' : 'Chưa làm'}${isFlagged ? ' (Đã cắm cờ)' : ''}`}
            >
              <span>{idx + 1}</span>

              {/* Flag badge */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-white ring-1 ring-white">
                  <Flag className="w-2 h-2 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
        {!isReviewMode ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-blue-600 inline-block"></span>
              <span>Đã chọn đáp án ({Object.keys(userAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm border border-slate-300 bg-white inline-block"></span>
              <span>Chưa làm ({questions.length - Object.keys(userAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-flex items-center justify-center text-white">
                <Flag className="w-2 h-2 fill-current" />
              </span>
              <span>Cắm cờ cần xem lại ({flaggedQuestionIds.size})</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600 inline-block"></span>
              <span>Trả lời đúng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-rose-600 inline-block"></span>
              <span>Trả lời sai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-200 inline-block"></span>
              <span>Chưa làm (bỏ trống)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
