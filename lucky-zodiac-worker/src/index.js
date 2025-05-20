export default {
  async fetch(request, env, ctx) {
    // OPTIONS 요청 처리 (CORS preflight 대응)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // POST 요청 처리
    if (request.method !== "POST") {
      return new Response("Only POST requests allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    try {
      // 요청 본문에서 prompt 추출
      const { prompt } = await request.json();

      // prompt 값이 없을 경우 오류 반환
      if (!prompt) {
        return new Response("Missing prompt", {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Gemini API 호출
      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      // Gemini API 응답이 성공적인지 확인
      if (!geminiResponse.ok) {
        console.error("Gemini API 응답 오류", geminiResponse.statusText);
        return new Response(
          JSON.stringify({ reply: "운세를 불러오지 못했습니다." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // JSON 응답 처리
      const data = await geminiResponse.json();
      console.log("🌐 Gemini 응답:", JSON.stringify(data));

      // AI 운세 텍스트 추출
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "운세 생성 실패";

      // 정상적으로 결과를 반환
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });

    } catch (error) {
      // API 호출 중 오류가 발생한 경우
      console.error("🔥 Gemini API 오류:", error);
      return new Response(
        JSON.stringify({ reply: "⚠️ Gemini API 오류로 운세를 가져오지 못했어요." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );
    }
  }
};
