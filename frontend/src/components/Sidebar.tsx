import { AnimatePresence, motion } from "motion/react";
import {
  SquarePen,
  MessageSquare,
  LayoutGrid,
  FolderClosed,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";

type SidebarContentProps = {
  onNewChat?: () => void;
};

const SidebarContent = ({ onNewChat }: SidebarContentProps) => {
  const navItems = [
    { label: "New chat", icon: SquarePen, active: true, onClick: onNewChat },
    { label: "Chats", icon: MessageSquare },
    { label: "Explore GPTs", icon: LayoutGrid },
    { label: "Library", icon: FolderClosed },
  ];

  return (
    <div className="flex h-full flex-col bg-[#090a0f] px-3 pb-6 pt-5">
      {/* ChatGPT logo in top-left */}
      <div className="mb-6 px-3">
        {/* ChatGPT Logo */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 11.23a3.52 3.52 0 0 0-1.748-2.613 3.53 3.53 0 0 0-.256-4.524 3.534 3.534 0 0 0-4.524-.256 3.536 3.536 0 0 0-6.195 1.748 3.53 3.53 0 0 0-4.524.256 3.534 3.534 0 0 0-.256 4.524 3.536 3.536 0 0 0 1.748 6.195 3.53 3.53 0 0 0 .256 4.524 3.534 3.534 0 0 0 4.524.256 3.536 3.536 0 0 0 6.195-1.748 3.53 3.53 0 0 0 4.524-.256 3.534 3.534 0 0 0 .256-4.524 3.536 3.536 0 0 0-1.748-6.195zm-6.071 8.855a1.865 1.865 0 0 1-1.42-.66c-.19-.24-.31-.53-.35-.83a2.02 2.02 0 0 1 .15-1.07l.95-1.65a.5.5 0 0 0-.18-.68l-3.3-1.91a.507.507 0 0 0-.68.18l-1.65 2.85c-.27.46-.7.79-1.22.92a1.86 1.86 0 0 1-1.92-1.07 1.87 1.87 0 0 1 .25-2.18c.2-.23.47-.39.77-.47a1.85 1.85 0 0 1 .38-.04 2 2 0 0 1 1.07.31l3.3 1.91a.5.5 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91c-.48-.28-.84-.73-.99-1.26a1.87 1.87 0 0 1 .77-2.07 1.865 1.865 0 0 1 2.18.25c.23.2.39.47.47.77a2 2 0 0 1 .04.38c0 .38-.11.75-.31 1.07l-.95 1.65a.5.5 0 0 0 .18.68l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91a2.02 2.02 0 0 1-.77-2.33 1.87 1.87 0 0 1 2.07-.77c.53.15.98.51 1.26.99l1.65 2.85a.507.507 0 0 0 .68.18l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85c.28-.48.73-.84 1.26-.99a1.87 1.87 0 0 1 2.07.77c.28.48.37 1.05.25 1.6a1.88 1.88 0 0 1-.92 1.22l-2.85 1.65c-.46.27-.79.7-1.22.92l.02.01-3.3-1.91a.5.5 0 0 0-.68.18l-1.65 2.85a.5.5 0 0 0 .18.68l3.3 1.91c.48.28.84.73.99 1.26a1.87 1.87 0 0 1-.77 2.07c-.48.28-1.05.37-1.6.25a1.88 1.88 0 0 1-1.22-.92l-1.65-2.85a.5.5 0 0 0-.68-.18l-3.3-1.91a.5.5 0 0 0-.68.18l-1.65 2.85c-.27.46-.38 1.01-.29 1.55a1.87 1.87 0 0 0 1.22 1.34c.54.16 1.11.07 1.59-.25l2.85-1.65c.46-.27.79-.7 1.22-.92l3.3 1.91a.507.507 0 0 0 .68-.18l1.65-2.85a.507.507 0 0 0-.18-.68l-3.3-1.91c.27-.46.38-1.01.29-1.55a1.87 1.87 0 0 0-1.22-1.34z" />
        </svg>
      </div>

      {/* Navigation items */}
      <div className="flex-1 space-y-1.5">
        {navItems.map(({ label, icon: Icon, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-[#1c1d25] text-white cursor-pointer"
                : "text-[#9b9ca4] hover:bg-[#1c1d25]/50 hover:text-white cursor-pointer"
            }`}
            type="button"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Bottom profile and settings */}
      <div className="mt-auto space-y-4 px-1">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-[#9b9ca4] transition hover:bg-[#1c1d25]/50 hover:text-white cursor-pointer"
          type="button"
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span>Settings</span>
        </button>

        <button
          className="flex w-full items-center justify-between rounded-xl px-2 py-2 transition hover:bg-[#1c1d25]/50 cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1] text-xs font-semibold text-white">
              A
            </div>
            <span className="text-sm font-medium text-white">Alex</span>
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
};

export const Sidebar = ({ isOpen, onClose, onNewChat }: SidebarProps) => (
  <>
    <motion.aside
      className="hidden h-dvh w-64 flex-col border-r border-white/5 bg-[#090a0f] lg:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <SidebarContent onNewChat={onNewChat} />
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
            <SidebarContent onNewChat={onNewChat} />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </>
);
