const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("✅ Function called");
  console.log("✅ ENV DIFY_API_KEY:", process.env.DIFY_API_KEY ? "OK" : "MISSING");

  try {
    const { message: userMessage } = JSON.parse(event.body);
    console.log("📝 User message:", userMessage);

    const payload = {
      query: userMessage,
      inputs: { query: userMessage },
      user: "web-user",
      response_mode: "blocking"
    };

    console.log("📤 Sending payload:", JSON.stringify(payload));

    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("🌐 Dify response:", JSON.stringify(data));

    if (!response.ok) {
      console.error("❌ API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API error", details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.answer })
    };
  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
