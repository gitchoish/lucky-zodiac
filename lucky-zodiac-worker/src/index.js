export default {
  async fetch(request, env, ctx) {
    // ✅ Preflight (OPTIONS 요청 처리)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // ✅ POST 요청만 허용
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      const { prompt } = await request.json();

      if (!prompt) {
        return new Response('Missing prompt', {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await geminiRes.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '운세 생성 실패';

      return new Response(JSON.stringify({ reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('🔥 Gemini API error:', error);
      return new Response(JSON.stringify({ reply: '⚠️ Gemini API 오류로 운세를 가져오지 못했어요.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
