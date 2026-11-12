import React, { useState } from 'react';
import { Exam, Question } from '../types/quiz';
import {
  Plus,
  Trash2,
  FileText,
  Wand2,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Sparkles,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Layers,
  GraduationCap,
  SlidersHorizontal,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveExam: (exam: Exam) => void;
}

const PRESET_TOPICS = [
  { label: '🌐 HTML & Lập trình Web', topic: 'Các thẻ cơ bản trong HTML5, biểu mẫu form và cấu trúc trang web', subject: 'Tin học & Công nghệ', grade: 'Lớp 10 - 12' },
  { label: '💻 Mạng máy tính & An toàn TT', topic: 'Kiến thức mạng máy tính, giao thức IP, bảo mật và an toàn thông tin', subject: 'Tin học & Công nghệ', grade: 'Phổ thông' },
  { label: '📐 Hàm số & Đạo hàm', topic: 'Tính đơn điệu, cực trị của hàm số và ứng dụng đạo hàm', subject: 'Toán học', grade: 'Lớp 12 / THPT' },
  { label: '🇬🇧 Tiếng Anh: Câu điều kiện', topic: 'Conditional sentences type 1, 2, 3 và câu điều kiện hỗn hợp', subject: 'Tiếng Anh', grade: 'Lớp 10 - 12' },
  { label: '🔬 Quang học & Ánh sáng', topic: 'Hiện tượng khúc xạ, phản xạ toàn phần và thấu kính quang học', subject: 'Khoa học Tự nhiên', grade: 'Lớp 9 - 11' },
  { label: '🇻🇳 Kháng chiến chống Pháp (1945-1954)', topic: 'Chiến dịch Điện Biên Phủ và các mốc lịch sử dựng nước, giữ nước', subject: 'Lịch sử & Địa lý', grade: 'Lớp 12' },
];

export const ExamEditorModal: React.FC<Props> = ({ isOpen, onClose, onSaveExam }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'quickImport' | 'form'>('ai');

  // Exam Meta
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Tin học & Công nghệ');
  const [grade, setGrade] = useState('Lớp 10 - 12');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  // AI Generator States
  const [aiTopic, setAiTopic] = useState('Các thẻ cơ bản trong HTML5, thuộc tính và liên kết trang web');
  const [aiSubject, setAiSubject] = useState('Tin học & Công nghệ');
  const [aiGrade, setAiGrade] = useState('Lớp 10 - 12');
  const [aiNumQuestions, setAiNumQuestions] = useState<number>(5);
  const [aiDifficulty, setAiDifficulty] = useState('Trung bình');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Manual & Generated questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'custom-q-1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'Trung bình',
    },
  ]);

  // Quick import raw text
  const [rawText, setRawText] = useState(`Câu 1: Thẻ nào trong HTML dùng để liên kết đến trang web khác?
A. <link>
B. <a>
C. <href>
D. <url>
Đáp án: B
Giải thích: Thẻ <a> (anchor) cùng thuộc tính href được sử dụng để tạo siêu liên kết (hyperlink).

Câu 2: Đâu là định dạng file của trang web thuần?
A. .html hoặc .htm
B. .docx
C. .exe
D. .mp3
Đáp án: A
Giải thích: File HTML có phần mở rộng tiêu chuẩn là .html hoặc .htm.`);

  // Validation error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setAiTopic(preset.topic);
    setAiSubject(preset.subject);
    setAiGrade(preset.grade);
    setErrorMessage(null);
  };

  const handleGenerateWithAi = async (appendMode: boolean = false) => {
    if (!aiTopic.trim()) {
      setErrorMessage('Vui lòng nhập chủ đề hoặc bài học cần tạo câu hỏi!');
      return;
    }

    setErrorMessage(null);
    setAiSuccessMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          subject: aiSubject,
          grade: aiGrade,
          numQuestions: aiNumQuestions,
          difficulty: aiDifficulty,
          customPrompt: aiCustomPrompt,
        }),
      });

      const responseText = await response.text();
      let resData: any;
      try {
        resData = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.ok
            ? 'Phản hồi từ máy chủ không đúng định dạng JSON.'
            : `Máy chủ gặp sự cố (${response.status}). Vui lòng thử lại sau giây lát.`
        );
      }

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Máy chủ không thể tạo câu hỏi lúc này.');
      }

      const generated = resData.data;

      // Update Meta
      if (!appendMode || !title.trim()) {
        setTitle(generated.title || `Đề thi trắc nghiệm: ${aiTopic.slice(0, 40)}`);
      }
      setSubject(generated.subject || aiSubject);
      setGrade(generated.grade || aiGrade);
      setDescription(generated.description || `Đề thi trắc nghiệm được tạo tự động bởi AI về chủ đề ${aiTopic}.`);
      if (generated.durationMinutes && (!appendMode || durationMinutes <= 0)) {
        setDurationMinutes(generated.durationMinutes);
      }

      // Map generated questions to ensure valid structure
      const formattedQuestions: Question[] = (generated.questions || []).map((q: any, idx: number) => ({
        id: `ai-q-${Date.now()}-${idx}`,
        question: q.question || `Câu hỏi ${idx + 1}`,
        options: Array.isArray(q.options) && q.options.length >= 4 ? q.options.slice(0, 4) : ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
        correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
        explanation: q.explanation || 'Không có giải thích chi tiết.',
        difficulty: q.difficulty || aiDifficulty,
      }));

      if (formattedQuestions.length === 0) {
        throw new Error('AI không trả về danh sách câu hỏi hợp lệ.');
      }

      if (appendMode) {
        setQuestions((prev) => [...prev, ...formattedQuestions]);
        setAiSuccessMessage(`Đã tạo và thêm thành công ${formattedQuestions.length} câu hỏi mới vào đề thi!`);
      } else {
        setQuestions(formattedQuestions);
        setAiSuccessMessage(`Đã tạo thành công ${formattedQuestions.length} câu hỏi chuẩn xác! Bạn có thể xem lại hoặc chỉnh sửa bên dưới.`);
      }

      // Switch to review & edit form
      setActiveTab('form');
    } catch (err: any) {
      console.error('Failed to generate quiz with AI:', err);
      setErrorMessage(err.message || 'Đã xảy ra lỗi trong quá trình kết nối với AI. Vui lòng kiểm tra lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    setErrorMessage(null);
    setQuestions([
      ...questions,
      {
        id: `custom-q-${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'Trung bình',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      setErrorMessage('Đề thi phải có ít nhất 1 câu hỏi.');
      return;
    }
    setErrorMessage(null);
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const parseRawTextToQuestions = (text: string): Question[] => {
    const lines = text.split('\n').map((l) => l.trim());
    const parsedQuestions: Question[] = [];

    let currentQ: Partial<Question> | null = null;
    let currentOptions: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Detect question start: "Câu 1:", "1.", "Câu 1."
      const questionMatch = line.match(/^(?:Câu\s*\d+[\s:.-]+|\d+[\s:.-]+)(.*)/i);
      if (questionMatch) {
        if (currentQ && currentQ.question && currentOptions.length >= 2) {
          parsedQuestions.push({
            id: `parsed-q-${Date.now()}-${parsedQuestions.length}`,
            question: currentQ.question,
            options: currentOptions,
            correctAnswer: currentQ.correctAnswer ?? 0,
            explanation: currentQ.explanation || '',
            difficulty: 'Trung bình',
          });
        }

        currentQ = {
          question: questionMatch[1].trim() || line,
          correctAnswer: 0,
          explanation: '',
        };
        currentOptions = [];
        continue;
      }

      // Detect option: "A.", "A)", "a."
      const optMatch = line.match(/^([A-D])[\s.)-]+(.*)/i);
      if (optMatch && currentQ) {
        currentOptions.push(optMatch[2].trim());
        continue;
      }

      // Detect Answer: "Đáp án: A", "Đ/a: B"
      const ansMatch = line.match(/^(?:Đáp án|Đ\/a|Đáp án đúng|Answer)[\s:.-]+([A-D])/i);
      if (ansMatch && currentQ) {
        const letter = ansMatch[1].toUpperCase();
        const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
        currentQ.correctAnswer = map[letter] ?? 0;
        continue;
      }

      // Detect Explanation: "Giải thích: ..."
      const expMatch = line.match(/^(?:Giải thích|Lời giải|Explanation)[\s:.-]+(.*)/i);
      if (expMatch && currentQ) {
        currentQ.explanation = expMatch[1].trim();
        continue;
      }

      // If continuation of question or explanation
      if (currentQ) {
        if (currentOptions.length === 0) {
          currentQ.question += ' ' + line;
        } else if (currentQ.explanation) {
          currentQ.explanation += ' ' + line;
        }
      }
    }

    // Flush last question
    if (currentQ && currentQ.question && currentOptions.length >= 2) {
      parsedQuestions.push({
        id: `parsed-q-${Date.now()}-${parsedQuestions.length}`,
        question: currentQ.question,
        options: currentOptions,
        correctAnswer: currentQ.correctAnswer ?? 0,
        explanation: currentQ.explanation || '',
        difficulty: 'Trung bình',
      });
    }

    return parsedQuestions;
  };

  const handleSave = () => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tên đề thi!');
      return;
    }

    let finalQuestions: Question[] = [];

    if (activeTab === 'quickImport') {
      finalQuestions = parseRawTextToQuestions(rawText);
      if (finalQuestions.length === 0) {
        setErrorMessage(
          'Không thể trích xuất câu hỏi từ văn bản. Vui lòng kiểm tra định dạng câu hỏi (Ví dụ: "Câu 1: ... A. ... B. ... Đáp án: A")'
        );
        return;
      }
    } else {
      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim()) {
          setErrorMessage(`Câu hỏi ${i + 1} chưa có nội dung.`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            setErrorMessage(`Câu hỏi ${i + 1} thiếu nội dung đáp án ${String.fromCharCode(65 + j)}.`);
            return;
          }
        }
      }
      finalQuestions = questions;
    }

    const newExam: Exam = {
      id: `custom-exam-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim() || 'Tổng hợp',
      grade: grade.trim() || 'Phổ thông',
      description: description.trim() || 'Đề thi trắc nghiệm tự tạo.',
      durationMinutes: Number(durationMinutes) || 15,
      questions: finalQuestions,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    onSaveExam(newExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Biên Soạn & Tạo Đề Thi</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AI Hỗ Trợ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tạo đề tự động bằng AI, nhập nhanh từ văn bản hoặc soạn thủ công
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ai');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Tạo bằng AI
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('quickImport');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quickImport'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-slate-500" />
              Dán văn bản
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('form');
                setErrorMessage(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Chỉnh sửa ({questions.length})
            </button>
          </div>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {aiSuccessMessage && activeTab === 'form' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{aiSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setAiSuccessMessage(null)}
                className="text-xs text-emerald-700 hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {/* AI Tab Content */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              {/* AI Intro Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-4 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-900">
                    Trợ lý AI Biên Soạn Câu Hỏi Tự Động
                  </h4>
                  <p className="text-blue-800/90 text-xs leading-relaxed">
                    Chỉ cần nhập chủ đề bất kỳ (hoặc chọn mẫu có sẵn), AI sẽ tự động sinh ra bộ câu hỏi 4 lựa chọn chuẩn mực, kèm đáp án đúng và lời giải thích chi tiết từng câu.
                  </p>
                </div>
              </div>

              {/* Preset Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Gợi ý chủ đề nhanh:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TOPICS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-medium text-slate-700 transition-colors cursor-pointer text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chủ đề bài học hoặc nội dung kiểm tra <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ví dụ: Các thẻ cơ bản trong HTML5, thuộc tính và liên kết trang web"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Tin học & Công nghệ">Tin học & Công nghệ</option>
                    <option value="Toán học">Toán học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Khoa học Tự nhiên">Khoa học Tự nhiên</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tổng hợp">Kiến thức tổng hợp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cấp học / Khối</label>
                  <select
                    value={aiGrade}
                    onChange={(e) => setAiGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Lớp 10 - 12">THPT (Lớp 10 - 12)</option>
                    <option value="Lớp 6 - 9">THCS (Lớp 6 - 9)</option>
                    <option value="Tiểu học">Tiểu học (Lớp 1 - 5)</option>
                    <option value="Đại cương / Sinh viên">Đại học / Chuyên nghiệp</option>
                    <option value="Phổ thông">Phổ thông tự do</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng câu</label>
                  <select
                    value={aiNumQuestions}
                    onChange={(e) => setAiNumQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={5}>5 câu (Kiểm tra nhanh)</option>
                    <option value={10}>10 câu (Tiêu chuẩn)</option>
                    <option value={15}>15 câu (Đầy đủ)</option>
                    <option value={20}>20 câu (Toàn diện)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Độ khó</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Trung bình">Trung bình</option>
                    <option value="Dễ">Dễ (Nhận biết)</option>
                    <option value="Khó">Khó (Vận dụng cao)</option>
                    <option value="Hỗn hợp">Hỗn hợp (Từ dễ đến khó)</option>
                  </select>
                </div>
              </div>

              {/* Extra Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yêu cầu bổ sung cho AI (tùy chọn)
                </label>
                <input
                  type="text"
                  value={aiCustomPrompt}
                  onChange={(e) => setAiCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Tập trung vào ví dụ thực tế mã nguồn HTML; giải thích kỹ các bẫy thường gặp"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Generate Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleGenerateWithAi(false)}
                  className="w-full sm:w-auto flex-1 py-3 px-5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI đang biên soạn câu hỏi & lời giải...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Tạo Đề Thi Mới Bằng AI</span>
                    </>
                  )}
                </button>

                {questions.length > 0 && questions[0].question.trim() !== '' && (
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleGenerateWithAi(true)}
                    className="w-full sm:w-auto py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    title="Tạo thêm câu hỏi vào bộ câu hỏi hiện tại"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tạo thêm vào đề này</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Metadata Inputs (Shown in Quick Import & Form tabs) */}
          {activeTab !== 'ai' && (
            <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên đề thi trắc nghiệm *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Kiểm tra 15 phút Tin học - Ngôn ngữ HTML"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ví dụ: Tin học, Toán, Anh..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Thời gian làm bài (Phút, 0 = không giới hạn)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả ngắn / Lớp
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Đề kiểm tra định kỳ học kỳ 2"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Import Tab */}
          {activeTab === 'quickImport' && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Dán nội dung câu hỏi trắc nghiệm vào đây:
                </label>
                <span className="text-xs text-blue-600 font-medium">
                  Định dạng: Câu 1 / A. B. C. D. / Đáp án: A / Giải thích
                </span>
              </div>
              <textarea
                rows={12}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-3 font-mono text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 focus:bg-white transition-all leading-relaxed"
                placeholder="Câu 1: ...&#10;A. ...&#10;B. ...&#10;C. ...&#10;D. ...&#10;Đáp án: A&#10;Giải thích: ..."
              />
            </div>
          )}

          {/* Manual Form Tab */}
          {activeTab === 'form' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Danh sách câu hỏi ({questions.length} câu)
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ai')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Thêm câu bằng AI
                  </button>
                </div>
              </div>

              {questions.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                        Câu hỏi {qIdx + 1}
                      </span>
                      {q.difficulty && (
                        <span className="text-[11px] text-slate-500">
                          ({q.difficulty})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-xs text-rose-600 hover:text-rose-700 p-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa câu này
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={q.question}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[qIdx].question = e.target.value;
                        setQuestions(copy);
                      }}
                      placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* 4 Choices */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctAnswer === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-1.5 rounded-lg border transition-all ${
                            isCorrect ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={isCorrect}
                            onChange={() => {
                              const copy = [...questions];
                              copy[qIdx].correctAnswer = optIdx;
                              setQuestions(copy);
                            }}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                            title="Chọn làm đáp án đúng"
                          />
                          <span className={`text-xs font-bold w-4 ${isCorrect ? 'text-emerald-700' : 'text-slate-600'}`}>
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const copy = [...questions];
                              copy[qIdx].options[optIdx] = e.target.value;
                              setQuestions(copy);
                            }}
                            placeholder={`Phương án ${String.fromCharCode(65 + optIdx)}`}
                            className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                          />
                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 pr-2">
                              ✓ Đúng
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      Lời giải chi tiết:
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[qIdx].explanation = e.target.value;
                        setQuestions(copy);
                      }}
                      placeholder="Giải thích chi tiết vì sao đáp án này đúng để học sinh xem lại sau khi nộp bài..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-white hover:bg-blue-50/30"
              >
                <Plus className="w-4 h-4" /> Thêm câu hỏi thủ công tiếp theo
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'ai' ? (
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Xem danh sách ({questions.length} câu)
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Lưu & Bắt Đầu Dùng Đề Này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
