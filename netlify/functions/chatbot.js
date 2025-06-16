const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("✅ Function called: chatbot");
  console.log("✅ ENV OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "OK" : "MISSING");
  console.log("✅ ENV OPENAI_ASSISTANT_ID:", process.env.OPENAI_ASSISTANT_ID ? "OK" : "MISSING");

  try {
    const { message: userMessage, thread_id } = JSON.parse(event.body);
    console.log("📝 User message:", userMessage);
    console.log("🧵 Using thread ID:", thread_id);

    const commonHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "assistants=v2"
    };

    // Add message to thread
    const msgRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        role: "user",
        content: userMessage
      })
    });
    const msgData = await msgRes.json();
    if (!msgRes.ok) {
      console.error("❌ Error adding message:", msgData);
      return {
        statusCode: msgRes.status,
        body: JSON.stringify({ error: "Error adding message", details: msgData })
      };
    }

    // Start run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        assistant_id: process.env.OPENAI_ASSISTANT_ID
      })
    });
    const runData = await runRes.json();
    if (!runRes.ok) {
      console.error("❌ Error starting run:", runData);
      return {
        statusCode: runRes.status,
        body: JSON.stringify({ error: "Error starting run", details: runData })
      };
    }

    const runId = runData.id;

    // Polling
    let completed = false;
    let tries = 0;
    const maxTries = 20; // ~20 seconds
    let output = null;

    while (!completed && tries < maxTries) {
      const checkRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs/${runId}`, {
        headers: commonHeaders
      });
      const checkData = await checkRes.json();

      if (checkData.status === "completed") {
        completed = true;
        const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
          headers: commonHeaders
        });
        const messagesData = await messagesRes.json();
        output = messagesData.data[0]?.content[0]?.text?.value || "No response generated.";
      } else if (checkData.status === "failed") {
        console.error("❌ Run failed:", checkData);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Run failed", details: checkData })
        };
      }

      if (!completed) {
        tries++;
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (!completed) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: "OnKlinic is preparing your response. Please try again in a few seconds."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: output })
    };

  } catch (err) {
    console.error("❌ Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
