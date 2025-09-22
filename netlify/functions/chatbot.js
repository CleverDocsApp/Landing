exports.handler = async function(event) {
  try {
    const { message: userMessage } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v2"
    };

    // Crear thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers
    });
    const threadData = await threadRes.json();
    const threadId = threadData.id;

    // Crear mensaje
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: "user",
        content: userMessage
      })
    });

    // Iniciar run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });
    const runData = await runRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        thread_id: threadId,
        run_id: runData.id
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
