// app/api/ai/route.ts
import { qwenClient, QWEN_MODEL } from '@/lib/qwen';

const responseCache = new Map<string, { text: string, expiry: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { prompt, contextData, pageName } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const cacheKey = `${pageName || 'unknown'}::${prompt}::${JSON.stringify(contextData).slice(0, 50)}`;
    const cached = responseCache.get(cacheKey);

    // Cache hit → stream the cached response instantly for consistency
    if (cached && cached.expiry > Date.now()) {
      console.log(`✅ Cache hit for [${pageName}] "${prompt.slice(0, 40)}..." (0 tokens)`);
      return streamText(cached.text, true);
    }

    const contextString = contextData ? JSON.stringify(contextData) : 'No page data available.';
    const page = pageName || 'Dashboard';

    const systemPrompt = `You are "Canton Copilot", an AI assistant embedded in a Canton Network dashboard.
The user is currently viewing the "${page}" page.

Data available on this page:
${contextString}

Instructions:
- Answer concisely (2-3 sentences max).
- Reference specific numbers, parties, or IDs from the data.
- If the user asks about something not in the data, say so clearly.
- Keep tone professional and factual.`;

    // Call Qwen with streaming enabled
    const stream = await qwenClient.chat.completions.create({
      model: QWEN_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.5,
      stream: true,
    });

    console.log(`📡 Streaming Qwen [${page}] "${prompt.slice(0, 40)}..."`);

    // Pipe the Qwen stream to the client
    const encoder = new TextEncoder();
    let fullText = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || '';
            if (token) {
              fullText += token;
              controller.enqueue(encoder.encode(token));
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
        } finally {
          // Save full response to cache when the stream completes
          responseCache.set(cacheKey, {
            text: fullText,
            expiry: Date.now() + CACHE_TTL_MS,
          });
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    console.error('❌ Qwen API Error:', error);
    return new Response(JSON.stringify({ error: 'AI processing failed.' }), { status: 500 });
  }
}

// Helper: stream a static text (used for cached responses)
function streamText(text: string, cached: boolean) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Cached': cached ? 'true' : 'false',
      },
    }
  );
}