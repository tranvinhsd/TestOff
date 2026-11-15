import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Allowed models from gemini-api guidelines (ordered by speed & reliability)
const CANDIDATE_MODELS: Array<{ name: string; useLowThinking: boolean }> = [
  { name: 'gemini-3.1-flash-lite', useLowThinking: true },
  { name: 'gemini-3.8-flash', useLowThinking: true },
  { name: 'gemini-flash-latest', useLowThinking: false },
];

const MODEL_TIMEOUT_MS = 25000;

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
  if (raw.includes('ETIMEDOUT')) {
    return 'Yêu cầu AI mất quá nhiều thời gian phản hồi. Vui lòng thử giảm số lượng câu hỏi hoặc thử lại sau.';
  }
  return raw || 'Đã xảy ra lỗi khi tạo câu hỏi bằng AI. Vui lòng thử lại.';
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function handleGenerateQuiz(req: Request, res: Response): Promise<void> {
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

    const prompt = `Bạn là chuyên gia biên soạn đề thi trắc nghiệm tại Việt Nam.
Hãy tạo bộ đề thi trắc nghiệm chuẩn kiến thức bằng tiếng Việt dựa trên thông tin sau:
- Chủ đề: "${topic.trim()}"
- Môn học: "${subject}"
- Cấp học / Lớp: "${grade}"
- Số câu hỏi: ${safeCount} câu
- Độ khó: "${difficulty}"
${customPrompt ? `- Yêu cầu bổ sung: "${customPrompt.trim()}"` : ''}

Quy chuẩn bắt buộc:
1. Mỗi câu có ĐÚNG 4 lựa chọn (options gồm 4 chuỗi).
2. correctAnswer là số nguyên từ 0 đến 3 (0=A, 1=B, 2=C, 3=D).
3. explanation ngắn gọn, súc tích (1-2 câu), nêu rõ vì sao đáp án đúng chính xác.
4. difficulty của từng câu là 'Dễ', 'Trung bình', hoặc 'Khó'.`;

    const ai = getAiClient();
    let lastError: unknown = null;
    let parsedData: unknown = null;

    for (const candidate of CANDIDATE_MODELS) {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      try {
        const config: Record<string, unknown> = {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'Tiêu đề ngắn gọn của đề thi',
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
                description: 'Mô tả ngắn về mục tiêu kiến thức của bài kiểm tra',
              },
              durationMinutes: {
                type: Type.INTEGER,
                description: 'Thời gian làm bài ước tính tính bằng phút',
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
                      description: 'Giải thích ngắn gọn vì sao đáp án đúng',
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
        };

        if (candidate.useLowThinking) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const response = await Promise.race([
          ai.models.generateContent({
            model: candidate.name,
            contents: prompt,
            config,
          }),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(
              () => reject(new Error('ETIMEDOUT: Yêu cầu AI vượt quá thời gian chờ')),
              MODEL_TIMEOUT_MS
            );
          }),
        ]);

        const rawJson = response.text;
        if (!rawJson) {
          throw new Error('AI không phản hồi nội dung văn bản');
        }

        parsedData = JSON.parse(extractJsonText(rawJson));
        break;
      } catch (err) {
        lastError = err;
        if (isTransientError(err)) {
          await sleep(250);
          continue;
        }
        throw err;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
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
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Enable CORS for API endpoints so static frontends (e.g. GitHub Pages) can call this backend
  app.use(['/api', '/TestOff/api'], (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // AI Quiz Generation Endpoint (mounted at both root and base subpath)
  app.post('/api/ai/generate-quiz', handleGenerateQuiz);
  app.post('/TestOff/api/ai/generate-quiz', handleGenerateQuiz);

  // Mount Vite middleware in dev or static files in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use('/TestOff', express.static(distDir));
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
