exports.handler = async function (event) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.CHATKIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      console.error("Missing env vars", { apiKey: !!apiKey, workflowId: !!workflowId });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing OPENAI_API_KEY or CHATKIT_WORKFLOW_ID",
        }),
      };
    }

    let userId = "onklinic-landing-anon";
    try {
      if (event.body) {
        const body = JSON.parse(event.body);
        if (body.userId) userId = String(body.userId);
      }
    } catch (e) {
      console.warn("Could not parse body JSON:", e.message);
    }

    const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId,
        chatkit_configuration: {
          file_upload: { enabled: false },
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("ChatKit session error", {
        status: response.status,
        body: data,
      });
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Failed to create ChatKit session",
          details: data,
        }),
      };
    }

    if (!data.client_secret) {
      console.error("No client_secret in ChatKit response", data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "No client_secret in ChatKit response",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        client_secret: data.client_secret,
        expires_after: data.expires_after || null,
      }),
    };
  } catch (err) {
    console.error("chatkit-session error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error creating ChatKit session",
        details: err.message,
      }),
    };
  }
};
