import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  SquarePen,
  MessageSquare,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";

type SidebarContentProps = {
  onNewChat?: () => void;
  username: string | null;
  sessions: { session_id: string; title: string }[];
  activeSessionId: string;
  onSessionSelect: (sid: string) => void;
  onLogout: () => void;
  onTriggerLogin: () => void;
};

const SidebarContent = ({
  onNewChat,
  username,
  sessions,
  activeSessionId,
  onSessionSelect,
  onLogout,
  onTriggerLogin,
}: SidebarContentProps) => {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  return (
    <div className="flex h-full flex-col bg-[#090a0f] px-3 pb-6 pt-5 font-sans">
      {/* ChatGPT logo in top-left */}
      <div className="mb-6 px-3 select-none">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 11.23a3.52 3.52 0 0 0-1.748-2.613 3.53 3.53 0 0 0-.256-4.524 3.534 3.534 0 0 0-4.524-.256 3.536 3.536 0 0 0-6.195 1.748 3.53 3.53 0 0 0-4.524.256 3.534 3.534 0 0 0-.256 4.524 3.536 3.536 0 0 0 1.748 6.195 3.53 3.53 0 0 0 .256 4.524 3.534 3.534 0 0 0 4.524.256 3.536 3.536 0 0 0 6.195-1.748 3.53 3.53 0 0 0 4.524-.256 3.534 3.534 0 0 0 .256-4.524 3.536 3.536 0 0 0-1.748-6.195zm-6.071 8.855a1.865 1.865 0 0 1-1.42-.66c-.19-.24-.31-.53-.35-.83a2.02 2.02 0 0 1 .15-1.07l.95-1.65a.5.5 0 0 0-.18-.68l-3.3-1.91a.507.507 0 0 0-.68.18l-1.65 2.85c-.27.46-.7.79-1.22.92a1.86 1.86 0 0 1-1.92-1.07 1.87 1.87 0 0 1 .25-2.18c.2-.23.47-.39.77-.47a1.85 1.85 0 0 1 .38-.04 2 2 0 0 1 1.07.31l3.3 1.91a.5.5 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91c-.48-.28-.84-.73-.99-1.26a1.87 1.87 0 0 1 .77-2.07 1.865 1.865 0 0 1 2.18.25c.23.2.39.47.47.77a2 2 0 0 1 .04.38c0 .38-.11.75-.31 1.07l-.95 1.65a.5.5 0 0 0 .18.68l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91a2.02 2.02 0 0 1-.77-2.33 1.87 1.87 0 0 1 2.07-.77c.53.15.98.51 1.26.99l1.65 2.85a.507.507 0 0 0 .68.18l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85c.28-.48.73-.84 1.26-.99a1.87 1.87 0 0 1 2.07.77c.28.48.37 1.05.25 1.6a1.88 1.88 0 0 1-.92 1.22l-2.85 1.65c-.46.27-.79.7-1.22.92l.02.01-3.3-1.91a.5.5 0 0 0-.68.18l-1.65 2.85a.5.5 0 0 0 .18.68l3.3 1.91c.48.28.84.73.99 1.26a1.87 1.87 0 0 1-.77 2.07c-.48.28-1.05.37-1.6.25a1.88 1.88 0 0 1-1.22-.92l-1.65-2.85a.5.5 0 0 0-.68-.18l-3.3-1.91a.5.5 0 0 0-.68.18l-1.65 2.85c-.27.46-.38 1.01-.29 1.55a1.87 1.87 0 0 0 1.22 1.34c.54.16 1.11.07 1.59-.25l2.85-1.65c.46-.27.79-.7 1.22-.92l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91c.27-.46.38-1.01.29-1.55a1.87 1.87 0 0 0-1.22-1.34z" />
        </svg>
      </div>

      {/* Navigation and Recents List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 select-none">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-[#1c1d25] text-white hover:bg-[#1c1d25]/80 transition cursor-pointer"
          type="button"
        >
          <SquarePen className="h-[18px] w-[18px] shrink-0" />
          <span>New chat</span>
        </button>

        {/* Recents Category */}
        <div className="pt-2">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4e4f56]">Recents</span>
            <MessageSquare className="h-3 w-3 text-[#4e4f56]" />
          </div>

          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {username ? (
              sessions.length > 0 ? (
                sessions.map((session) => {
                  const isActive = session.session_id === activeSessionId;
                  return (
                    <button
                      key={session.session_id}
                      onClick={() => onSessionSelect(session.session_id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition text-left cursor-pointer ${
                        isActive
                          ? "bg-[#161820] text-white border border-white/5"
                          : "text-[#9b9ca4] hover:bg-[#1c1d25]/50 hover:text-white"
                      }`}
                      type="button"
                    >
                      <MessageSquare className={`h-[16px] w-[16px] shrink-0 ${isActive ? "text-[#818cf8]" : "text-[#4e4f56]"}`} />
                      <span className="truncate flex-1 pr-1">{session.title}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-xs text-[#4e4f56] italic">
                  No conversations yet.
                </div>
              )
            ) : (
              <div className="rounded-xl bg-white/3 border border-white/5 px-3.5 py-4 text-xs text-[#9b9ca4] space-y-2 select-none leading-relaxed">
                <p>Log in to save and sync your conversation history.</p>
                <button
                  onClick={onTriggerLogin}
                  className="w-full text-center text-xs font-semibold text-[#818cf8] hover:text-white transition cursor-pointer"
                >
                  Log In Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile and Settings */}
      <div className="relative mt-auto space-y-4 px-1 select-none">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-[#9b9ca4] transition hover:bg-[#1c1d25]/50 hover:text-white cursor-pointer"
          type="button"
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span>Settings</span>
        </button>

        {showLogoutDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-14 left-0 w-full p-1.5 bg-[#12131a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col gap-1"
          >
            <div className="px-3 py-2 text-xs text-[#676870] border-b border-white/5 truncate">
              {username ? `Signed in as ${username}` : "Not signed in"}
            </div>
            <button
              onClick={() => {
                setShowLogoutDropdown(false);
                onLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer text-left"
              type="button"
            >
              Log out
            </button>
          </motion.div>
        )}

        <button
          onClick={() => {
            if (username) {
              setShowLogoutDropdown(!showLogoutDropdown);
            } else {
              onTriggerLogin();
            }
          }}
          className="flex w-full items-center justify-between rounded-xl px-2 py-2 transition hover:bg-[#1c1d25]/50 cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1] text-xs font-semibold text-white">
              {username ? username.charAt(0).toUpperCase() : "G"}
            </div>
            <span className="text-sm font-medium text-white max-w-[120px] truncate">
              {username || "Guest User"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-[#9b9ca4]" />
        </button>
      </div>
    </div>
  );
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onNewChat?: () => void;
  username: string | null;
  sessions: { session_id: string; title: string }[];
  activeSessionId: string;
  onSessionSelect: (sid: string) => void;
  onLogout: () => void;
  onTriggerLogin: () => void;
};

export const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  username,
  sessions,
  activeSessionId,
  onSessionSelect,
  onLogout,
  onTriggerLogin,
}: SidebarProps) => (
  <>
    <motion.aside
      className="hidden h-dvh w-64 flex-col border-r border-white/5 bg-[#090a0f] lg:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SidebarContent
        onNewChat={onNewChat}
        username={username}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={onSessionSelect}
        onLogout={onLogout}
        onTriggerLogin={onTriggerLogin}
      />
    </motion.aside>

    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-40 flex lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            className="relative z-10 h-full w-64 border-r border-white/5"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="absolute right-4 top-4 z-50">
              <button
                className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent
              onNewChat={onNewChat}
              username={username}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSessionSelect={onSessionSelect}
              onLogout={onLogout}
              onTriggerLogin={onTriggerLogin}
            />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </>
);

