import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { ChatMessage } from "../hooks/useChat";

type MessageBubbleProps = {
  message: ChatMessage;
  variants?: Variants;
};

export const MessageBubble = ({ message, variants }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const alignment = isUser ? "items-end text-right" : "items-start";
  const bubbleStyle = isUser
    ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.35),rgba(34,211,238,0.12))] border border-white/10 shadow-[0_12px_40px_rgba(6,12,28,0.45)]"
    : isSystem
      ? "bg-white/5 border border-white/10"
      : "glass-panel border border-white/10";

  return (
    <motion.div layout variants={variants} className={`flex ${alignment}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-white ${bubbleStyle}`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};
