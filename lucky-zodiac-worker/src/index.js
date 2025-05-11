// src/index.js (Cloudflare Worker 전용)
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Only POST allowed', {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      const { prompt } = await request.json();

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await geminiRes.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '운세 생성 실패';

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      console.error('🔥 Gemini API error:', err);
      return new Response(
        JSON.stringify({ reply: '⚠️ Gemini API 오류로 운세를 가져오지 못했어요.' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
