exports.handler = async function() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configuration error", details: "OpenAI API key not configured" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "assistants=v2"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenAI API error", details: errorText })
      };
    }

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
