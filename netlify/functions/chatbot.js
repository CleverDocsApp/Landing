const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const apiKey = process.env.OPENAI_API_KEY;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente conversacional de On Klinic. Tu objetivo es convertir visitantes en usuarios de prueba. " +
          "Responde preguntas sobre la plataforma, sus beneficios, cómo funciona y resalta su facilidad de uso. " +
          "Usa un tono profesional pero cercano. Sé breve, claro y enfocado en resolver dudas comunes. " +
          "Siempre que sea posible, invita a los usuarios a hacer clic en el botón 'Probar Gratis' para comenzar."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("🧠 OpenAI raw response:", JSON.stringify(data));

    const reply = data?.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply || "⚠️ GPT no devolvió respuesta válida." })
    };
  } catch (error) {
    console.error("❌ Error en chatbot.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al contactar a OpenAI." })
    };
  }
};
