const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("✅ Function called: create-thread");
  console.log("✅ ENV OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "OK" : "MISSING");

  try {
    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error creating thread:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Error creating thread", details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ thread_id: data.id })
    };
  } catch (err) {
    console.error("❌ Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};