import { AnimatePresence, motion } from "motion/react";
import {
  Compass,
  Library,
  MessageCircle,
  Plus,
  Settings,
  User2,
  X,
} from "lucide-react";

const navItems = [
  { label: "New Chat", icon: Plus, accent: true },
  { label: "Chats", icon: MessageCircle },
  { label: "Explore GPTs", icon: Compass },
  { label: "Library", icon: Library },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarContent = () => (
  <div className="flex h-full flex-col">
    <div className="px-5 pt-6">
      <div className="font-display text-xl font-semibold tracking-tight">
        ChatGPT
      </div>
      <p className="text-xs text-muted">Neo-Chat cinematic interface</p>
    </div>

    <div className="mt-6 flex-1 space-y-1 px-3">
      {navItems.map(({ label, icon: Icon, accent }) => (
        <button
          key={label}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
            accent
              ? "bg-white/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              : "text-muted hover:bg-white/5 hover:text-white"
          }`}
          type="button"
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>

    <div className="mt-auto space-y-3 px-4 pb-6">
      <button
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-white/5 hover:text-white"
        type="button"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>
      <button
        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm"
        type="button"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <User2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm">Alex</span>
          <span className="text-xs text-muted">Premium</span>
        </div>
      </button>
    </div>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    <motion.aside
      className="glass-panel hidden h-dvh w-72 flex-col lg:flex"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SidebarContent />
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
            className="glass-panel relative z-10 h-full w-72"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="text-sm uppercase tracking-[0.3em] text-muted">
                Menu
              </span>
              <button
                className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  </>
);
