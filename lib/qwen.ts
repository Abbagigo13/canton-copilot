// lib/qwen.ts
import OpenAI from 'openai';

export const qwenClient = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',  // ← CHANGED (Singapore)
});

export const QWEN_MODEL = 'qwen-turbo';