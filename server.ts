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

// Allowed models from gemini-api guidelines (ordered by preference)
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
] as const;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Thiếu cấu hình GEMINI_API_KEY trên máy chủ.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isTransientError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('high demand') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('fetch failed')
  );
}

function formatReadableError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw);
    const code = parsed?.error?.code;
    const status = parsed?.error?.status;
    if (code === 503 || status === 'UNAVAILABLE') {
      return 'Hệ thống AI đang quá tải tạm thời (503). Vui lòng thử lại sau vài giây.';
    }
    if (code === 429 || status === 'RESOURCE_EXHAUSTED') {
      return 'Đã vượt quá giới hạn lượt gọi AI tạm thời (429). Vui lòng đợi một lát rồi thử lại.';
    }
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // Not JSON, inspect plain text
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE')) {
    return 'Hệ thống AI đang quá tải tạm thời (503). Vui lòng thử lại sau vài giây.';
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return 'Đã vượt quá giới hạn lượt gọi AI tạm thời (429). Vui lòng đợi một lát rồi thử lại.';
  }
  return raw || 'Đã xảy ra lỗi khi tạo câu hỏi bằng AI. Vui lòng thử lại.';
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

      const safeCount = Math.min(Math.max(Number(numQuestions) || 5, 1), 20);

      const prompt = `Bạn là một chuyên gia giáo dục và biên soạn đề thi trắc nghiệm hàng đầu tại Việt Nam.
Hãy tạo một bộ đề thi trắc nghiệm chất lượng cao, chuẩn kiến thức, bằng tiếng Việt dựa trên yêu cầu sau:

- Chủ đề / Nội dung: "${topic.trim()}"
- Môn học: "${subject}"
- Cấp học / Lớp: "${grade}"
- Số lượng câu hỏi: ${safeCount} câu
- Độ khó mong muốn: "${difficulty}"
${customPrompt ? `- Yêu cầu bổ sung của giáo viên: "${customPrompt.trim()}"` : ''}

Quy chuẩn biên soạn:
1. Mỗi câu hỏi phải có ĐÚNG 4 lựa chọn (A, B, C, D) tương ứng với mảng options có 4 phần tử chuỗi.
2. correctAnswer là số nguyên từ 0 đến 3 (0 tương ứng lựa chọn thứ nhất A, 1 là B, 2 là C, 3 là D).
3. Lời giải thích (explanation) phải chi tiết, khoa học, chỉ rõ tại sao đáp án đó đúng và giải thích ngắn gọn vì sao các phương án khác chưa chính xác.
4. Câu hỏi rõ ràng, không mơ hồ, không tạo các câu vô nghĩa như "Tất cả đều sai", "Cả A và B đều đúng" nếu không cần thiết.
5. Độ khó (difficulty) của từng câu phải được đánh giá khách quan: 'Dễ', 'Trung bình', hoặc 'Khó'.`;

      const ai = getAiClient();
      let lastError: unknown = null;
      let parsedData: unknown = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await Promise.race([
            ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description:
                        'Tiêu đề ngắn gọn, chuẩn mực của đề thi (Ví dụ: Đề Kiểm Tra Trắc Nghiệm: Khái Niệm Cơ Bản Về HTML)',
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
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('ETIMEDOUT: Yêu cầu AI vượt quá thời gian chờ')), 20000)
            ),
          ]);

          const rawJson = response.text;
          if (!rawJson) {
            throw new Error('AI không phản hồi nội dung văn bản');
          }

          parsedData = JSON.parse(extractJsonText(rawJson));
          break;
        } catch (err) {
          lastError = err;
          console.warn(`AI generation failed with ${modelName}:`, err);
          if (isTransientError(err)) {
            await sleep(300);
            continue;
          }
          // Non-transient error (e.g. invalid API key, bad request), stop trying immediately
          throw err;
        }
      }

      if (!parsedData) {
        throw lastError || new Error('Không thể tạo câu hỏi từ AI lúc này.');
      }

      res.json({ success: true, data: parsedData });
    } catch (error: unknown) {
      console.error('Error in /api/ai/generate-quiz:', error);
      res.status(500).json({
        error: formatReadableError(error),
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
