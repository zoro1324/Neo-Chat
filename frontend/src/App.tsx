import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const API_URL = import.meta.env.VITE_API_URL;
  const sendMessage = async () => {
    const response = await fetch(`${API_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await response.json();

    setReply(data.reply);
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