import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { ChatMessage } from "../hooks/useChat";
import { ChatView } from "./ChatView";
import { LandingView } from "./LandingView";

type AnimatedLayoutProps = {
  scene: string;
  isChatActive: boolean;
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export const AnimatedLayout = ({
  scene,
  isChatActive,
  messages,
  inputValue,
  onInputChange,
  onSend,
  isSending,
}: AnimatedLayoutProps) => (
  <LayoutGroup>
    <motion.div
      layout
      className="flex flex-1 flex-col px-2 pb-4 pt-6 lg:px-10"
      transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.9 }}
    >
      <AnimatePresence mode="sync">
        {isChatActive ? (
          <ChatView
            key="chat"
            messages={messages}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSend={onSend}
            isSending={isSending}
          />
        ) : (
          <LandingView
            key="landing"
            scene={scene}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSend={onSend}
            isSending={isSending}
          />
        )}
      </AnimatePresence>
    </motion.div>
  </LayoutGroup>
);
