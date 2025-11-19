// DEPRECATED: This function is no longer used.
// Replaced by onklinic-agent.ts which uses the OpenAI Agents SDK
// Kept for reference only.

const fetch = require("node-fetch");

exports.handler = async function() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ thread_id: data.id })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
