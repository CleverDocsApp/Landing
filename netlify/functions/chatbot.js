const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`
      },
      body: JSON.stringify({
        query: userMessage,
        response_mode: "blocking"
        // Puedes agregar user: "user-id" si deseas rastrear usuarios
      })
    });

    const data = await response.json();
    console.log("🧠 Dify raw response:", JSON.stringify(data));

    if (!response.ok) {
      console.error("❌ Dify API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Error from Dify API",
          details: data
        })
      };
    }

    const reply = data?.answer;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply || "⚠️ Dify did not return a valid response." })
    };
  } catch (error) {
    console.error("❌ Error in chatbot.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message })
    };
  }
};
