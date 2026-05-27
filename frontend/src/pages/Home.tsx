import { Menu, ChevronDown, SquarePen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { AnimatedLayout } from "../components/AnimatedLayout";
import { Sidebar } from "../components/Sidebar";
import { AuthModal } from "../components/AuthModal";
import { useChat } from "../hooks/useChat";

const SPLINE_SCENE =
  "https://prod.spline.design/KSZfx3TiBBgK6sYV/scene.splinecode";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const {
    input,
    setInput,
    messages,
    sendMessage,
    isSending,
    hasStarted,
    reset,
    handleFileUpload,
    username,
    sessions,
    loadSession,
    handleLogin,
    handleLogout,
    sessionId,
  } = useChat({ apiUrl: import.meta.env.VITE_API_URL });

  const backgroundMotion = reduceMotion
    ? {}
    : {
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      };

  const handleSend = () => {
    setSidebarOpen(false);
    void sendMessage();
  };

  const handleNewChat = () => {
    reset();
    setSidebarOpen(false);
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-[#0d0e12] font-body text-white">
      {/* Sleek, premium background gradient with center glow for the landing page */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(124, 58, 237, 0.08), transparent 50%), linear-gradient(180deg, #0d0e12 0%, #111218 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={backgroundMotion}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex h-dvh">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          username={username}
          sessions={sessions}
          activeSessionId={sessionId}
          onSessionSelect={(sid) => {
            void loadSession(sid);
            setSidebarOpen(false);
          }}
          onLogout={handleLogout}
          onTriggerLogin={() => setAuthModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex h-dvh flex-1 flex-col overflow-hidden">
          {/* Header (ChatGPT dropdown & New Chat icon) */}
          <header className="flex items-center justify-between px-5 py-4 shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger menu */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-full p-2 text-[#9b9ca4] hover:bg-white/5 hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Neo-Chat Selector */}
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-base font-semibold text-[#9b9ca4] transition hover:bg-white/5 hover:text-white"
              >
                <span>Neo-Chat</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-[#9b9ca4]" />
              </button>
            </div>

            {/* New Chat Edit Icon Button */}
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-lg p-2 text-[#9b9ca4] transition hover:bg-[#1c1d25] hover:text-white"
              aria-label="New chat"
            >
              <SquarePen className="h-5 w-5" />
            </button>
          </header>

          <AnimatedLayout
            scene={SPLINE_SCENE}
            isChatActive={hasStarted}
            messages={messages}
            inputValue={input}
            onInputChange={(value) => setInput(value)}
            onSend={handleSend}
            isSending={isSending}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>

      {/* Glassmorphic Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
        apiUrl={import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}
      />
    </div>
  );
}

