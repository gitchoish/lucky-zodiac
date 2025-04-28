export default {
	async fetch(request, env, ctx) {
	  if (request.method !== 'POST') {
		return new Response('Only POST allowed', { status: 405 });
	  }
  
	  const { prompt } = await request.json();
	  if (!prompt) {
		return new Response('No prompt provided', { status: 400 });
	  }
  
	  const geminiRes = await fetch(
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + env.GEMINI_API_KEY,
		{
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({
			contents: [{ parts: [{ text: prompt }] }]
		  })
		}
	  );
  
	  const data = await geminiRes.json();
	  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '운세를 불러오지 못했어요.';
  
	  return new Response(JSON.stringify({ reply }), {
		headers: { 'Content-Type': 'application/json' }
	  });
	}
  };
  