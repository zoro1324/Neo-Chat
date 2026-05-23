import { Menu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { AnimatedLayout } from "../components/AnimatedLayout";
import { Sidebar } from "../components/Sidebar";
import { useChat } from "../hooks/useChat";

const SPLINE_SCENE =
  "https://prod.spline.design/KSZfx3TiBBgK6sYV/scene.splinecode";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { input, setInput, messages, sendMessage, isSending, hasStarted } =
    useChat({ apiUrl: import.meta.env.VITE_API_URL });

  const backgroundMotion = reduceMotion
    ? {}
    : {
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      };

  const handleSend = () => {
    setSidebarOpen(false);
    void sendMessage();
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(56, 189, 248, 0.18), transparent 45%), radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.2), transparent 40%), linear-gradient(160deg, #050816, #0b1020)",
          backgroundSize: "200% 200%",
        }}
        animate={backgroundMotion}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-35" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)] blur-3xl" />

      <div className="relative z-10 flex min-h-dvh">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-dvh flex-1 flex-col">
          <header className="flex items-center justify-between px-4 pt-5 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="glass-panel rounded-full p-2 text-white"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="font-display text-xs uppercase tracking-[0.35em] text-muted">
              ChatGPT
            </span>
            <div className="h-8 w-8" />
          </header>

          <AnimatedLayout
            scene={SPLINE_SCENE}
            isChatActive={hasStarted}
            messages={messages}
            inputValue={input}
            onInputChange={(value) => setInput(value)}
            onSend={handleSend}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
}
