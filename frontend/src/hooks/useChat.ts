import { useCallback, useMemo, useState, useEffect } from "react";

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

const requestReply = async (message: string, sessionId: string, apiUrl?: string, username?: string | null) => {
  if (!apiUrl) return "VITE_API_URL is not configured.";

  const response = await fetch(`${apiUrl}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, username: username || undefined }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return `Request failed with status ${response.status}: ${errorText}`;
  }

  const data = (await response.json()) as { reply?: string };
  return data.reply ?? "No reply returned from server.";
};

const uploadFile = async (file: File, apiUrl?: string) => {
  if (!apiUrl) throw new Error("VITE_API_URL is not configured.");
  
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) throw new Error("Failed to upload document");
  return response.json();
}

export const useChat = ({ apiUrl }: UseChatOptions = {}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string>(createId());
  
  // Auth state
  const [username, setUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessions, setSessions] = useState<{ session_id: string; title: string }[]>([]);
  
  const fetchHistory = useCallback(async (sid: string) => {
    if (!apiUrl) return;
    try {
      const res = await fetch(`${apiUrl}/history/${sid}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setMessages(data);
          setHasStarted(true);
        } else {
          setMessages([]);
          setHasStarted(false);
        }
      }
    } catch(e) {
      console.error(e);
    }
  }, [apiUrl]);

  const fetchUserSessions = useCallback(async (user: string) => {
    if (!apiUrl) return;
    try {
      const res = await fetch(`${apiUrl}/sessions/${user}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error("Error fetching user sessions:", e);
    }
  }, [apiUrl]);
  
  useEffect(() => {
    // Restore authentication
    const savedUser = localStorage.getItem("neo_chat_username");
    const savedEmail = localStorage.getItem("neo_chat_email");
    if (savedUser) {
      setUsername(savedUser);
      setUserEmail(savedEmail);
      void fetchUserSessions(savedUser);
    }

    // Restore active session
    const savedSession = localStorage.getItem("neo_chat_session");
    if (savedSession) {
      setSessionId(savedSession);
      void fetchHistory(savedSession);
    } else {
      localStorage.setItem("neo_chat_session", sessionId);
    }
  }, [fetchHistory, fetchUserSessions]);

  const loadSession = useCallback(async (sid: string) => {
    setSessionId(sid);
    localStorage.setItem("neo_chat_session", sid);
    await fetchHistory(sid);
  }, [fetchHistory]);

  const handleLogin = useCallback((user: string, email: string) => {
    setUsername(user);
    setUserEmail(email);
    localStorage.setItem("neo_chat_username", user);
    localStorage.setItem("neo_chat_email", email);
    void fetchUserSessions(user);
  }, [fetchUserSessions]);

  const handleLogout = useCallback(() => {
    setUsername(null);
    setUserEmail(null);
    setSessions([]);
    setMessages([]);
    setHasStarted(false);
    localStorage.removeItem("neo_chat_username");
    localStorage.removeItem("neo_chat_email");
    
    const newId = createId();
    setSessionId(newId);
    localStorage.setItem("neo_chat_session", newId);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setHasStarted(true);
    setIsSending(true);

    try {
      const reply = await requestReply(trimmed, sessionId, apiUrl, username);
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Refresh user sessions list
      if (username) {
        void fetchUserSessions(username);
      }
    } catch (error) {
      const fallbackMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "Unable to reach the server.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  }, [apiUrl, input, isSending, sessionId, username, fetchUserSessions]);
  
  const handleFileUpload = async (file: File) => {
     try {
       await uploadFile(file, apiUrl);
       alert("Document uploaded and processed successfully. Neo-Chat can now answer based on this document.");
     } catch (e) {
       alert("Failed to upload document.");
     }
  };

  const reset = useCallback(() => {
    setMessages([]);
    setHasStarted(false);
    setInput("");
    const newId = createId();
    setSessionId(newId);
    localStorage.setItem("neo_chat_session", newId);
  }, []);

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
    reset,
    handleFileUpload,
    username,
    userEmail,
    sessions,
    loadSession,
    handleLogin,
    handleLogout,
    sessionId
  };
};



