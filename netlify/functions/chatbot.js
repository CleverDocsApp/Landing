const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    const { message: userMessage, thread_id: threadIdFromClient } = JSON.parse(event.body);

    const apiKey = process.env.OPENAI_API_KEY;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v2"
    };

    // Crear un thread si no hay uno
    let threadId = threadIdFromClient;
    if (!threadId) {
      const threadRes = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers
      });
      const threadData = await threadRes.json();
      threadId = threadData.id;
    }

    // Crear el mensaje
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: "user",
        content: userMessage
      })
    });

    // Lanzar el run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });
    const runData = await runRes.json();

    // Polling hasta que termine
    let completed = false;
    let responseData = {};
    while (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const checkRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runData.id}`, {
        method: "GET",
        headers
      });
      const checkData = await checkRes.json();
      if (checkData.status === "completed") {
        completed = true;
        const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          method: "GET",
          headers
        });
        const messagesData = await messagesRes.json();
        const lastMessage = messagesData.data.find(m => m.role === "assistant");
        responseData = {
          reply: lastMessage.content[0].text.value,
          thread_id: threadId
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
