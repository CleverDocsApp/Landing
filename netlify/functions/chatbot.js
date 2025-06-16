const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("✅ Function called");
  console.log("✅ ENV OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "OK" : "MISSING");
  console.log("✅ ENV OPENAI_ASSISTANT_ID:", process.env.OPENAI_ASSISTANT_ID ? "OK" : "MISSING");

  try {
    const { message: userMessage } = JSON.parse(event.body);
    console.log("📝 User message:", userMessage);

    const commonHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "assistants=v2"
    };

    // Paso 1: Crear thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: commonHeaders
    });
    const threadData = await threadRes.json();
    if (!threadRes.ok) {
      console.error("❌ Thread creation error:", threadData);
      return {
        statusCode: threadRes.status,
        body: JSON.stringify({ error: "Error creating thread", details: threadData })
      };
    }
    const threadId = threadData.id;
    console.log("🧵 Created thread ID:", threadId);

    // Paso 2: Agregar mensaje del usuario
    const msgRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        role: "user",
        content: userMessage
      })
    });
    const msgData = await msgRes.json();
    if (!msgRes.ok) {
      console.error("❌ Message error:", msgData);
      return {
        statusCode: msgRes.status,
        body: JSON.stringify({ error: "Error adding message", details: msgData })
      };
    }

    // Paso 3: Iniciar run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        assistant_id: process.env.OPENAI_ASSISTANT_ID
      })
    });
    const runData = await runRes.json();
    if (!runRes.ok) {
      console.error("❌ Run start error:", runData);
      return {
        statusCode: runRes.status,
        body: JSON.stringify({ error: "Error starting run", details: runData })
      };
    }
    const runId = runData.id;
    console.log("🏃 Run started ID:", runId);

    // Paso 4: Polling para el run
    let output = null;
    let completed = false;
    while (!completed) {
      const checkRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: commonHeaders
      });
      const checkData = await checkRes.json();

      if (checkData.status === "completed") {
        completed = true;
        console.log("✅ Run completed");

        const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
          headers: commonHeaders
        });
        const messagesData = await messagesRes.json();
        output = messagesData.data[0]?.content[0]?.text?.value || "No response generated.";
      } else if (checkData.status === "failed") {
        console.error("❌ Run failed");
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Run failed", details: checkData })
        };
      }

      if (!completed) {
        await new Promise(r => setTimeout(r, 1000)); // Esperar 1 segundo antes de reintentar
      }
    }

    console.log("🌐 OpenAI response:", output);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: output })
    };

  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
