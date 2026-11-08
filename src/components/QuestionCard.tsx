import React from 'react';
import { Question } from '../types/quiz';
import { Flag, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react';

interface Props {
  question: Question;
  index: number;
  totalQuestions: number;
  selectedOptionIndex?: number;
  isFlagged: boolean;
  onSelectOption: (optionIndex: number) => void;
  onClearOption?: () => void;
  onToggleFlag: () => void;
  isReviewMode?: boolean;
  fontSizeClass?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuestionCard: React.FC<Props> = ({
  question,
  index,
  totalQuestions,
  selectedOptionIndex,
  isFlagged,
  onSelectOption,
  onClearOption,
  onToggleFlag,
  isReviewMode = false,
  fontSizeClass = 'text-base',
}) => {
  const isCorrect = isReviewMode && selectedOptionIndex === question.correctAnswer;
  const isWrong = isReviewMode && selectedOptionIndex !== undefined && selectedOptionIndex !== question.correctAnswer;
  const isSkipped = isReviewMode && selectedOptionIndex === undefined;

  return (
    <div
      id={`question-card-${index}`}
      className={`bg-white rounded-xl border p-5 sm:p-6 transition-all shadow-xs ${
        isReviewMode
          ? isCorrect
            ? 'border-emerald-300 bg-emerald-50/20'
            : isWrong
            ? 'border-rose-300 bg-rose-50/20'
            : 'border-slate-300 bg-slate-50/30'
          : selectedOptionIndex !== undefined
          ? 'border-slate-300'
          : 'border-slate-200'
      }`}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center font-bold text-sm px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Câu {index + 1}
          </span>
          {question.difficulty && (
            <span className="text-xs text-slate-500 font-medium">
              Độ khó: <span className="text-slate-700">{question.difficulty}</span>
            </span>
          )}

          {isReviewMode && (
            <div className="flex items-center gap-1.5 ml-1">
              {isCorrect && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                </span>
              )}
              {isWrong && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-sm">
                  <XCircle className="w-3.5 h-3.5" /> Sai
                </span>
              )}
              {isSkipped && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-sm">
                  Chưa trả lời
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action icons: Flag and Clear */}
        {!isReviewMode && (
          <div className="flex items-center gap-2 shrink-0">
            {selectedOptionIndex !== undefined && onClearOption && (
              <button
                type="button"
                onClick={onClearOption}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Bỏ chọn đáp án này"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Bỏ chọn</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleFlag}
              className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                isFlagged
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                  : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title={isFlagged ? 'Bỏ cắm cờ câu này' : 'Cắm cờ để xem lại sau'}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFlagged ? 'Đã cắm cờ' : 'Đánh dấu'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className={`font-semibold text-slate-900 leading-relaxed mb-4 ${fontSizeClass}`}>
        {question.question}
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {question.options.map((option, optIdx) => {
          const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1);
          const isSelected = selectedOptionIndex === optIdx;
          const isAnswerCorrect = isReviewMode && optIdx === question.correctAnswer;
          const isAnswerSelectedAndWrong = isReviewMode && isSelected && !isAnswerCorrect;

          let optionStyle =
            'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800';

          if (isReviewMode) {
            if (isAnswerCorrect) {
              optionStyle =
                'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold';
            } else if (isAnswerSelectedAndWrong) {
              optionStyle =
                'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400 line-through opacity-85';
            } else {
              optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-600 opacity-70';
            }
          } else {
            if (isSelected) {
              optionStyle =
                'border-blue-600 bg-blue-50/80 text-blue-950 ring-1 ring-blue-600 font-medium shadow-xs';
            }
          }

          return (
            <label
              key={optIdx}
              onClick={() => {
                if (!isReviewMode) {
                  onSelectOption(optIdx);
                }
              }}
              className={`flex items-start gap-3.5 p-3 sm:p-3.5 rounded-lg border transition-all select-none ${
                isReviewMode ? 'cursor-default' : 'cursor-pointer'
              } ${optionStyle}`}
            >
              <div className="pt-0.5 shrink-0">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => {
                    if (!isReviewMode) onSelectOption(optIdx);
                  }}
                  disabled={isReviewMode}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-start gap-2 flex-1">
                <span
                  className={`font-bold shrink-0 min-w-5 text-sm ${
                    isSelected
                      ? 'text-blue-700'
                      : isAnswerCorrect
                      ? 'text-emerald-700'
                      : 'text-slate-500'
                  }`}
                >
                  {letter}.
                </span>
                <span className={`text-sm sm:text-base leading-relaxed ${fontSizeClass}`}>
                  {option}
                </span>
              </div>

              {isReviewMode && isAnswerCorrect && (
                <span className="shrink-0 text-emerald-600 text-xs font-bold flex items-center gap-1 self-center">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Đáp án đúng</span>
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Explanation Box (Visible in Review Mode) */}
      {isReviewMode && (
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 bg-slate-50/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-xl">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Giải thích đáp án
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed">
                {question.explanation || 'Không có giải thích bổ sung cho câu hỏi này.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
