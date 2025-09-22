exports.handler = async function(event) {
  try {
    const { thread_id: threadId, run_id: runId } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v2"
    };

    // Consultar run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: "GET",
      headers
    });
    const runData = await runRes.json();

    if (runData.status === "completed") {
      // Traer mensajes
      const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: "GET",
        headers
      });
      const messagesData = await messagesRes.json();
      const lastMessage = messagesData.data.find(m => m.role === "assistant");

      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "completed",
          reply: lastMessage.content[0].text.value
        })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: runData.status })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
