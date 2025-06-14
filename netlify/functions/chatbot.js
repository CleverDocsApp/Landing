const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("✅ Function called");
  console.log("✅ ENV DIFY_API_KEY:", process.env.DIFY_API_KEY ? "OK" : "MISSING");

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    console.log("📝 User message:", userMessage);

    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {
          query: userMessage,
          user: "web-user" // O genera un ID dinámico si lo prefieres
        },
        response_mode: "blocking"
      })
    });

    const data = await response.json();
    console.log("🌐 Dify response:", JSON.stringify(data));

    if (!response.ok) {
      console.error("❌ API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "API error",
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.answer || "⚠️ Empty response from Dify" })
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
