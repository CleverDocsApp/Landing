* === /netlify/functions/chatbot.js === */

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const apiKey = "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";

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
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al contactar a OpenAI." })
    };
  }
};
