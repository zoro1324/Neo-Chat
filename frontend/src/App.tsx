import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const API_URL = import.meta.env.VITE_API_URL;
  const debugPrefix = "[Neo-Chat][frontend]";

  const sendMessage = async () => {
    if (!API_URL) {
      const errorMessage = "VITE_API_URL is not configured.";
      console.error(debugPrefix, errorMessage);
      setReply(errorMessage);
      return;
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      const errorMessage = "Enter a message before sending.";
      console.warn(debugPrefix, errorMessage);
      setReply(errorMessage);
      return;
    }

    const requestUrl = `${API_URL}/send`;

    console.info(debugPrefix, "Sending message", {
      requestUrl,
      messageLength: trimmedMessage.length,
    });

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      console.info(debugPrefix, "Received response", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = (await response.json()) as { reply?: string };

      console.debug(debugPrefix, "Response payload", data);
      setReply(data.reply ?? "No reply returned from server.");
    } catch (error) {
      console.error(debugPrefix, "Failed to send message", error);
      setReply("Unable to reach the server. Check the console and backend logs.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Send
      </button>

      <h2>{reply}</h2>
    </div>
  );
}

export default App;