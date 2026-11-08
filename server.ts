import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Initialize Gemini SDK with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // AI Quiz Generation Endpoint
  app.post('/api/ai/generate-quiz', async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        topic,
        subject = 'Tổng hợp',
        grade = 'Phổ thông',
        numQuestions = 5,
        difficulty = 'Trung bình',
        customPrompt = '',
      } = req.body;

      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        res.status(400).json({ error: 'Vui lòng cung cấp chủ đề hoặc nội dung cần tạo câu hỏi.' });
        return;
      }

      const prompt = `Bạn là một chuyên gia giáo dục và biên soạn đề thi trắc nghiệm hàng đầu tại Việt Nam.
Hãy tạo một bộ đề thi trắc nghiệm chất lượng cao, chuẩn kiến thức, bằng tiếng Việt dựa trên yêu cầu sau:

- Chủ đề / Nội dung: "${topic.trim()}"
- Môn học: "${subject}"
- Cấp học / Lớp: "${grade}"
- Số lượng câu hỏi: ${Math.min(Math.max(Number(numQuestions) || 5, 1), 20)} câu
- Độ khó mong muốn: "${difficulty}"
${customPrompt ? `- Yêu cầu bổ sung của giáo viên: "${customPrompt.trim()}"` : ''}

Quy chuẩn biên soạn:
1. Mỗi câu hỏi phải có ĐÚNG 4 lựa chọn (A, B, C, D) tương ứng với mảng options có 4 phần tử chuỗi.
2. correctAnswer là số nguyên từ 0 đến 3 (0 tương ứng lựa chọn thứ nhất A, 1 là B, 2 là C, 3 là D).
3. Lời giải thích (explanation) phải chi tiết, khoa học, chỉ rõ tại sao đáp án đó đúng và giải thích ngắn gọn vì sao các phương án khác chưa chính xác.
4. Câu hỏi rõ ràng, không mơ hồ, không tạo các câu vô nghĩa như "Tất cả đều sai", "Cả A và B đều đúng" nếu không cần thiết.
5. Độ khó (difficulty) của từng câu phải được đánh giá khách quan: 'Dễ', 'Trung bình', hoặc 'Khó'.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Tiêu đề ngắn gọn, chuẩn mực của đề thi (Ví dụ: Đề Kiểm Tra Trắc Nghiệm: Khái Niệm Cơ Bản Về HTML)',
              },
              subject: {
                type: Type.STRING,
                description: 'Môn học tương ứng',
              },
              grade: {
                type: Type.STRING,
                description: 'Khối lớp hoặc cấp học',
              },
              description: {
                type: Type.STRING,
                description: 'Mô tả ngắn về nội dung và mục tiêu kiến thức của bài kiểm tra',
              },
              durationMinutes: {
                type: Type.INTEGER,
                description: 'Thời gian làm bài ước tính hợp lý tính bằng phút (e.g. 15, 20, 45)',
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                      description: 'Nội dung câu hỏi trắc nghiệm',
                    },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING,
                      },
                      description: 'Danh sách 4 phương án lựa chọn',
                    },
                    correctAnswer: {
                      type: Type.INTEGER,
                      description: 'Chỉ số phương án đúng từ 0 đến 3 (0 = A, 1 = B, 2 = C, 3 = D)',
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'Giải thích chi tiết lời giải vì sao đáp án đúng',
                    },
                    difficulty: {
                      type: Type.STRING,
                      description: 'Độ khó: Dễ, Trung bình, hoặc Khó',
                    },
                  },
                  required: ['question', 'options', 'correctAnswer', 'explanation', 'difficulty'],
                },
              },
            },
            required: ['title', 'subject', 'description', 'questions'],
          },
        },
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error('AI không phản hồi nội dung văn bản');
      }

      const parsedData = JSON.parse(rawJson);
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error in /api/ai/generate-quiz:', error);
      res.status(500).json({
        error: error.message || 'Đã xảy ra lỗi khi tạo câu hỏi bằng AI. Vui lòng thử lại.',
      });
    }
  });

  // Mount Vite middleware in dev or static files in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
