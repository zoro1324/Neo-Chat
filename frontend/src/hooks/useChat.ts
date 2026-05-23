import { useCallback, useMemo, useState } from "react";

type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type UseChatOptions = {
  apiUrl?: string;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const requestReply = async (message: string, apiUrl?: string) => {
  if (!apiUrl) {
    return "VITE_API_URL is not configured.";
  }

  const response = await fetch(`${apiUrl}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return `Request failed with status ${response.status}: ${errorText}`;
  }

  const data = (await response.json()) as { reply?: string };
  return data.reply ?? "No reply returned from server.";
};

export const useChat = ({ apiUrl }: UseChatOptions = {}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();

    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!hasStarted) {
      setHasStarted(true);
    }

    setIsSending(true);

    try {
      const reply = await requestReply(trimmed, apiUrl);
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("[Neo-Chat][frontend] Failed to send message", error);
      const fallbackMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "Unable to reach the server. Check the console and backend logs.",
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  }, [apiUrl, hasStarted, input, isSending]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending],
  );

  return {
    input,
    setInput,
    messages,
    isSending,
    canSend,
    hasStarted,
    sendMessage,
  };
};
