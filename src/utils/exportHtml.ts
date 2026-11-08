import { Exam } from '../types/quiz';

/**
 * Generates a 100% self-contained standalone pure HTML + CSS + JS file.
 * This file requires ZERO external dependencies, CDN or internet connection,
 * allowing students to take quizzes offline on any PC, laptop, tablet, or smartphone.
 */
export const generateStandaloneHtmlExam = (exam: Exam): string => {
  const jsonExam = JSON.stringify(exam);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(exam.title)} - Bài Thi Trắc Nghiệm Offline</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #eff6ff;
      --success: #16a34a;
      --success-light: #f0fdf4;
      --danger: #dc2626;
      --danger-light: #fef2f2;
      --warning: #d97706;
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-600: #475569;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background-color: #f8fafc;
      color: var(--slate-800);
      line-height: 1.6;
      padding-bottom: 60px;
    }
    .header {
      background: #ffffff;
      border-bottom: 1px solid var(--slate-200);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 14px 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--slate-900);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-offline {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .status-group {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .timer-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      font-size: 1.05rem;
      padding: 6px 14px;
      border-radius: 6px;
      background: #f1f5f9;
      color: var(--slate-800);
      border: 1px solid var(--slate-300);
    }
    .timer-warning {
      background: #fef2f2;
      color: #b91c1c;
      border-color: #f87171;
      animation: pulse 1s infinite alternate;
    }
    @keyframes pulse {
      from { opacity: 0.8; }
      to { opacity: 1; }
    }
    .container {
      max-width: 1100px;
      margin: 24px auto;
      padding: 0 16px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
    }
    @media (max-width: 860px) {
      .container {
        grid-template-columns: 1fr;
      }
    }
    .card {
      background: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      margin-bottom: 20px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 14px;
    }
    .form-group label {
      display: block;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--slate-700);
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--slate-300);
      border-radius: 6px;
      font-size: 0.95rem;
      background: #ffffff;
      color: var(--slate-900);
      outline: none;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }
    .question-item {
      padding: 20px 0;
      border-bottom: 1px solid var(--slate-200);
      scroll-margin-top: 90px;
    }
    .question-item:last-child {
      border-bottom: none;
    }
    .q-number {
      font-weight: 700;
      color: var(--primary);
      font-size: 1rem;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .q-text {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--slate-900);
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .options-list {
      display: grid;
      gap: 10px;
    }
    .option-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      border: 1.5px solid var(--slate-200);
      border-radius: 8px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.15s ease;
      font-size: 0.95rem;
    }
    .option-label:hover {
      border-color: var(--slate-300);
      background: var(--slate-50);
    }
    .option-label.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      font-weight: 500;
    }
    .option-radio {
      margin-top: 3px;
      cursor: pointer;
      accent-color: var(--primary);
      width: 17px;
      height: 17px;
    }
    .option-letter {
      font-weight: 700;
      color: var(--slate-600);
      min-width: 24px;
    }
    .option-label.selected .option-letter {
      color: var(--primary);
    }
    .explanation-box {
      margin-top: 14px;
      padding: 12px 16px;
      border-radius: 8px;
      background: #f8fafc;
      border-left: 4px solid var(--primary);
      font-size: 0.9rem;
      display: none;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
    }
    .btn-danger {
      background: var(--danger);
      color: #ffffff;
    }
    .btn-outline {
      background: #ffffff;
      border: 1px solid var(--slate-300);
      color: var(--slate-700);
    }
    .btn-outline:hover {
      background: var(--slate-100);
    }
    .btn-block {
      width: 100%;
    }
    /* Side panel matrix */
    .sticky-sidebar {
      position: sticky;
      top: 86px;
      height: fit-content;
    }
    .matrix-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-top: 14px;
      margin-bottom: 20px;
    }
    .matrix-btn {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      border-radius: 6px;
      border: 1px solid var(--slate-300);
      background: #ffffff;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s;
    }
    .matrix-btn:hover {
      background: var(--slate-100);
    }
    .matrix-btn.answered {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }
    .matrix-btn.correct {
      background: var(--success) !important;
      color: #ffffff !important;
      border-color: var(--success) !important;
    }
    .matrix-btn.wrong {
      background: var(--danger) !important;
      color: #ffffff !important;
      border-color: var(--danger) !important;
    }
    .progress-bar-bg {
      background: var(--slate-200);
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .progress-bar-fill {
      background: var(--primary);
      height: 100%;
      width: 0%;
      transition: width 0.3s;
    }
    /* Result section */
    .result-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      z-index: 100;
      padding: 20px;
      align-items: center;
      justify-content: center;
    }
    .result-dialog {
      background: #ffffff;
      max-width: 580px;
      width: 100%;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
      text-align: center;
      max-height: 90vh;
      overflow-y: auto;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 16px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--primary-light);
      border: 4px solid var(--primary);
      color: var(--primary);
    }
    .score-number {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1;
    }
    .score-max {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--slate-600);
    }
    .stats-table {
      width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }
    .stats-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--slate-200);
    }
    .stats-table tr:last-child td {
      border-bottom: none;
    }
    /* Review answer styles */
    .option-label.is-correct-answer {
      background: var(--success-light) !important;
      border-color: var(--success) !important;
      color: #14532d !important;
      font-weight: 600;
    }
    .option-label.is-wrong-answer {
      background: var(--danger-light) !important;
      border-color: var(--danger) !important;
      color: #7f1d1d !important;
      text-decoration: line-through;
    }
    @media print {
      .header, .sticky-sidebar, .btn, .result-modal {
        display: none !important;
      }
      .container {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .card {
        box-shadow: none !important;
        border: none !important;
      }
      .explanation-box {
        display: block !important;
      }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="header-container">
      <div class="brand-title">
        <span>📝</span>
        <span>${escapeHtml(exam.title)}</span>
        <span class="badge-offline">OFFLINE HTML</span>
      </div>
      <div class="status-group">
        <div id="timerContainer" class="timer-badge">
          <span>⏱️</span>
          <span id="timerText">00:00</span>
        </div>
        <button id="submitBtnHeader" class="btn btn-primary" onclick="confirmSubmitExam()">
          Nộp bài ngay
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <div class="container">
    <main>
      <!-- Student Info Card -->
      <div class="card" id="studentCard">
        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Thông Tin Thí Sinh Làm Bài</h2>
        <p style="font-size: 0.9rem; color: var(--slate-600);">Vui lòng điền thông tin để lưu kèm theo bảng điểm và kết quả bài thi offline:</p>
        <div class="info-grid">
          <div class="form-group">
            <label for="studentName">Họ và tên thí sinh *</label>
            <input type="text" id="studentName" class="form-control" placeholder="Nguyễn Văn A" required>
          </div>
          <div class="form-group">
            <label for="studentClass">Lớp / Khóa học</label>
            <input type="text" id="studentClass" class="form-control" placeholder="12A1">
          </div>
          <div class="form-group">
            <label for="studentId">Số báo danh / Mã SV</label>
            <input type="text" id="studentId" class="form-control" placeholder="SBD-001">
          </div>
        </div>
      </div>

      <!-- Question List Card -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--slate-200); padding-bottom: 12px;">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900);">Nội Dung Đề Thi Trắc Nghiệm</h2>
            <p style="font-size: 0.85rem; color: var(--slate-600);">Môn: ${escapeHtml(exam.subject)} | Tổng số: ${exam.questions.length} câu | Thời gian: ${exam.durationMinutes > 0 ? exam.durationMinutes + ' phút' : 'Tự do'}</p>
          </div>
          <button class="btn btn-outline" style="font-size: 0.85rem; padding: 6px 12px;" onclick="window.print()">
            🖨️ In đề thi
          </button>
        </div>

        <form id="quizForm" onsubmit="event.preventDefault(); confirmSubmitExam();">
          <div id="questionsContainer"></div>
        </form>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--slate-200); text-align: center;">
          <button type="button" class="btn btn-primary" style="font-size: 1.1rem; padding: 12px 32px;" onclick="confirmSubmitExam()">
            Hoàn Thành & Chấm Điểm Ngay
          </button>
        </div>
      </div>
    </main>

    <!-- Sidebar Matrix Navigation -->
    <aside>
      <div class="card sticky-sidebar">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Tiến Độ Bài Làm</h3>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--slate-600); margin-bottom: 6px;">
          <span>Đã hoàn thành:</span>
          <strong id="answeredCountText">0/${exam.questions.length}</strong>
        </div>
        <div class="progress-bar-bg">
          <div id="progressBarFill" class="progress-bar-fill"></div>
        </div>

        <div style="font-size: 0.85rem; font-weight: 600; color: var(--slate-700); margin-top: 12px;">Bảng câu hỏi:</div>
        <div class="matrix-grid" id="matrixGrid"></div>

        <div style="font-size: 0.8rem; color: var(--slate-600); display: flex; flex-direction: column; gap: 4px; margin-top: 12px; border-top: 1px solid var(--slate-200); padding-top: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 14px; height: 14px; border-radius: 3px; background: var(--primary);"></div>
            <span>Đã chọn đáp án</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--slate-300); background: #ffffff;"></div>
            <span>Chưa chọn</span>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-block" style="margin-top: 18px;" onclick="confirmSubmitExam()">
          Nộp bài chấm điểm
        </button>
      </div>
    </aside>
  </div>

  <!-- Confirmation Modal -->
  <div id="confirmModal" class="result-modal">
    <div class="result-dialog" style="max-width: 440px; text-align: left; padding: 24px;">
      <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--slate-900); margin-bottom: 8px;">Xác Nhận Nộp Bài Thi</h3>
      <p id="confirmModalText" style="font-size: 0.95rem; color: var(--slate-600); margin-bottom: 20px; line-height: 1.5;"></p>
      <div style="display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn btn-outline" onclick="closeConfirmModal()">Tiếp tục làm bài</button>
        <button type="button" class="btn btn-primary" onclick="proceedSubmitExam()">Nộp bài chấm điểm</button>
      </div>
    </div>
  </div>

  <!-- Instant Scoring Result Modal -->
  <div id="resultModal" class="result-modal">
    <div class="result-dialog">
      <div style="font-size: 2.8rem; margin-bottom: 4px;" id="resultEmoji">🎉</div>
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--slate-900);" id="resultTitle">Hoàn Thành Bài Thi!</h2>
      <p style="font-size: 0.95rem; color: var(--slate-600); margin-bottom: 12px;" id="studentResultGreeting">Chúc mừng bạn đã hoàn thành bài thi</p>

      <div class="score-circle">
        <span class="score-number" id="scoreDisplay">0.0</span>
        <span class="score-max">Thang điểm 10</span>
      </div>

      <div id="rankBadge" style="font-weight: 700; font-size: 1.1rem; color: var(--primary); margin-bottom: 16px;">
        Học Lực: Xuất Sắc
      </div>

      <table class="stats-table">
        <tr>
          <td><strong>Họ và tên thí sinh:</strong></td>
          <td id="statStudentName">Chưa đặt tên</td>
        </tr>
        <tr>
          <td><strong>Thời gian làm bài:</strong></td>
          <td id="statDuration">0 phút 0 giây</td>
        </tr>
        <tr>
          <td><strong>Số câu trả lời đúng:</strong></td>
          <td style="color: var(--success); font-weight: 700;" id="statCorrect">0 / 0</td>
        </tr>
        <tr>
          <td><strong>Số câu trả lời sai:</strong></td>
          <td style="color: var(--danger); font-weight: 700;" id="statWrong">0</td>
        </tr>
        <tr>
          <td><strong>Số câu bỏ trống:</strong></td>
          <td style="color: var(--warning); font-weight: 700;" id="statSkipped">0</td>
        </tr>
        <tr>
          <td><strong>Tỷ lệ chính xác:</strong></td>
          <td style="font-weight: 700;" id="statPercent">0%</td>
        </tr>
      </table>

      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button class="btn btn-outline" style="flex: 1;" onclick="closeModalAndReview()">
          🔍 Xem Lại Đáp Án
        </button>
        <button class="btn btn-primary" style="flex: 1;" onclick="restartExam()">
          🔄 Làm Lại Bài Thi
        </button>
      </div>
    </div>
  </div>

  <script>
    // Embedded exam data
    const EXAM_DATA = ${jsonExam};
    let userAnswers = {};
    let isSubmitted = false;
    let timerInterval = null;
    let timeRemaining = EXAM_DATA.durationMinutes > 0 ? EXAM_DATA.durationMinutes * 60 : 0;
    let totalSecondsElapsed = 0;

    // Initialize application
    window.addEventListener('DOMContentLoaded', () => {
      renderQuestions();
      renderMatrix();
      startTimer();
      loadSavedStudentInfo();
    });

    function escapeText(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderQuestions() {
      const container = document.getElementById('questionsContainer');
      const letterNames = ['A', 'B', 'C', 'D', 'E', 'F'];

      let html = '';
      EXAM_DATA.questions.forEach((q, qIndex) => {
        html += \`
          <div class="question-item" id="q-item-\${qIndex}">
            <div class="q-number">
              <span>Câu \${qIndex + 1} \${q.difficulty ? '<span style="font-size: 0.8rem; font-weight: 400; color: var(--slate-600);">(' + q.difficulty + ')</span>' : ''}</span>
            </div>
            <div class="q-text">\${escapeText(q.question)}</div>
            <div class="options-list">
        \`;

        q.options.forEach((opt, optIndex) => {
          const letter = letterNames[optIndex] || String(optIndex + 1);
          html += \`
            <label class="option-label" id="label-\${qIndex}-\${optIndex}" onclick="selectAnswer('\${q.id}', \${qIndex}, \${optIndex})">
              <input type="radio" class="option-radio" name="question_\${qIndex}" id="radio-\${qIndex}-\${optIndex}" value="\${optIndex}">
              <span class="option-letter">\${letter}.</span>
              <span class="option-text">\${escapeText(opt)}</span>
            </label>
          \`;
        });

        html += \`
            </div>
            <div class="explanation-box" id="explanation-\${qIndex}">
              <strong>💡 Lời giải chi tiết:</strong>
              <div>\${escapeText(q.explanation || 'Không có lời giải thích thêm.')}</div>
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
    }

    function renderMatrix() {
      const matrix = document.getElementById('matrixGrid');
      let html = '';
      EXAM_DATA.questions.forEach((q, index) => {
        html += \`
          <button type="button" class="matrix-btn" id="matrix-btn-\${index}" onclick="scrollToQuestion(\${index})">
            \${index + 1}
          </button>
        \`;
      });
      matrix.innerHTML = html;
    }

    function selectAnswer(questionId, qIndex, optIndex) {
      if (isSubmitted) return;

      userAnswers[questionId] = optIndex;

      // Update Radio input
      const radio = document.getElementById(\`radio-\${qIndex}-\${optIndex}\`);
      if (radio) radio.checked = true;

      // Update visually selected styles
      const question = EXAM_DATA.questions[qIndex];
      question.options.forEach((_, idx) => {
        const lbl = document.getElementById(\`label-\${qIndex}-\${idx}\`);
        if (lbl) {
          if (idx === optIndex) {
            lbl.classList.add('selected');
          } else {
            lbl.classList.remove('selected');
          }
        }
      });

      // Update Matrix
      const matrixBtn = document.getElementById(\`matrix-btn-\${qIndex}\`);
      if (matrixBtn) {
        matrixBtn.classList.add('answered');
      }

      // Update Progress
      updateProgress();
    }

    function updateProgress() {
      const total = EXAM_DATA.questions.length;
      const answered = Object.keys(userAnswers).length;
      const percent = Math.round((answered / total) * 100);

      document.getElementById('answeredCountText').textContent = \`\${answered}/\${total}\`;
      document.getElementById('progressBarFill').style.width = \`\${percent}%\`;
    }

    function scrollToQuestion(index) {
      const item = document.getElementById(\`q-item-\${index}\`);
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function startTimer() {
      if (EXAM_DATA.durationMinutes <= 0) {
        // Count up mode
        timerInterval = setInterval(() => {
          totalSecondsElapsed++;
          const m = String(Math.floor(totalSecondsElapsed / 60)).padStart(2, '0');
          const s = String(totalSecondsElapsed % 60).padStart(2, '0');
          document.getElementById('timerText').textContent = \`\${m}:\${s}\`;
        }, 1000);
      } else {
        // Count down mode
        timerInterval = setInterval(() => {
          timeRemaining--;
          totalSecondsElapsed++;

          const m = Math.floor(timeRemaining / 60);
          const s = timeRemaining % 60;
          const display = \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;
          document.getElementById('timerText').textContent = display;

          if (timeRemaining <= 60) {
            document.getElementById('timerContainer').classList.add('timer-warning');
          }

          if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam(true);
          }
        }, 1000);
      }
    }

    function confirmSubmitExam() {
      if (isSubmitted) return;

      const answered = Object.keys(userAnswers).length;
      const total = EXAM_DATA.questions.length;
      const unanswered = total - answered;

      let msg = 'Bạn đã hoàn thành đủ các câu hỏi. Bạn có chắc chắn muốn nộp bài thi để chấm điểm ngay?';
      if (unanswered > 0) {
        msg = \`Bạn còn \${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài ngay để chấm điểm?\`;
      }

      document.getElementById('confirmModalText').textContent = msg;
      document.getElementById('confirmModal').style.display = 'flex';
    }

    function closeConfirmModal() {
      document.getElementById('confirmModal').style.display = 'none';
    }

    function proceedSubmitExam() {
      closeConfirmModal();
      submitExam(false);
    }

    function submitExam(force) {
      if (isSubmitted) return;
      isSubmitted = true;
      if (timerInterval) clearInterval(timerInterval);

      // Disable inputs
      document.querySelectorAll('.option-radio').forEach(r => r.disabled = true);
      document.getElementById('submitBtnHeader').disabled = true;
      document.getElementById('submitBtnHeader').textContent = 'Đã nộp bài';

      // Save student info to localStorage
      saveStudentInfoLocal();

      // Calculate score
      let correct = 0;
      let wrong = 0;
      let skipped = 0;

      EXAM_DATA.questions.forEach((q, qIndex) => {
        const studentChoice = userAnswers[q.id];
        const correctChoice = q.correctAnswer;
        const matrixBtn = document.getElementById(\`matrix-btn-\${qIndex}\`);
        const explanationBox = document.getElementById(\`explanation-\${qIndex}\`);

        // Show explanation
        if (explanationBox) explanationBox.style.display = 'block';

        if (studentChoice === undefined) {
          skipped++;
          if (matrixBtn) matrixBtn.classList.add('wrong');
        } else if (studentChoice === correctChoice) {
          correct++;
          if (matrixBtn) matrixBtn.classList.add('correct');
        } else {
          wrong++;
          if (matrixBtn) matrixBtn.classList.add('wrong');
        }

        // Highlight options in questions
        q.options.forEach((_, optIdx) => {
          const lbl = document.getElementById(\`label-\${qIndex}-\${optIdx}\`);
          if (lbl) {
            if (optIdx === correctChoice) {
              lbl.classList.add('is-correct-answer');
            } else if (optIdx === studentChoice && studentChoice !== correctChoice) {
              lbl.classList.add('is-wrong-answer');
            }
          }
        });
      });

      const total = EXAM_DATA.questions.length;
      const score10 = Number(((correct / total) * 10).toFixed(2));
      const percentage = Math.round((correct / total) * 100);

      // Determine rank
      let rank = 'Cần Cố Gắng Thêm';
      let emoji = '💪';
      if (score10 >= 9) {
        rank = 'Xuất Sắc';
        emoji = '🏆';
      } else if (score10 >= 8) {
        rank = 'Giỏi';
        emoji = '🌟';
      } else if (score10 >= 6.5) {
        rank = 'Khá';
        emoji = '👍';
      } else if (score10 >= 5) {
        rank = 'Trung Bình';
        emoji = '📖';
      }

      // Populate results modal
      const studentName = document.getElementById('studentName').value.trim() || 'Thí sinh';
      document.getElementById('statStudentName').textContent = studentName;
      document.getElementById('studentResultGreeting').textContent = \`Chúc mừng thí sinh \${studentName} đã hoàn thành bài thi trắc nghiệm!\`;
      document.getElementById('resultEmoji').textContent = emoji;
      document.getElementById('resultTitle').textContent = \`Kết Quả: \${rank}\`;
      document.getElementById('scoreDisplay').textContent = score10.toFixed(1);
      document.getElementById('rankBadge').textContent = \`Xếp loại: \${rank} (\${percentage}%)\`;

      const m = Math.floor(totalSecondsElapsed / 60);
      const s = totalSecondsElapsed % 60;
      document.getElementById('statDuration').textContent = \`\${m} phút \${s} giây\`;
      document.getElementById('statCorrect').textContent = \`\${correct} / \${total} câu\`;
      document.getElementById('statWrong').textContent = \`\${wrong} câu\`;
      document.getElementById('statSkipped').textContent = \`\${skipped} câu\`;
      document.getElementById('statPercent').textContent = \`\${percentage}%\`;

      // Show result modal
      document.getElementById('resultModal').style.display = 'flex';
    }

    function closeModalAndReview() {
      document.getElementById('resultModal').style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function restartExam() {
      if (confirm('Bạn có muốn làm lại bài thi này từ đầu không?')) {
        window.location.reload();
      }
    }

    function saveStudentInfoLocal() {
      const student = {
        name: document.getElementById('studentName').value.trim(),
        className: document.getElementById('studentClass').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
      };
      try {
        localStorage.setItem('offline_quiz_student_temp', JSON.stringify(student));
      } catch (e) {}
    }

    function loadSavedStudentInfo() {
      try {
        const raw = localStorage.getItem('offline_quiz_student_temp');
        if (raw) {
          const s = JSON.parse(raw);
          if (s.name) document.getElementById('studentName').value = s.name;
          if (s.className) document.getElementById('studentClass').value = s.className;
          if (s.studentId) document.getElementById('studentId').value = s.studentId;
        }
      } catch (e) {}
    }
  </script>
</body>
</html>`;
};

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
