import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";

type ChatViewProps = {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export const ChatView = ({
  messages,
  inputValue,
  onInputChange,
  onSend,
  isSending,
}: ChatViewProps) => {
  const endRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages.length, reduceMotion]);

  return (
    <motion.section
      layout
      layoutId="main-panel"
      className="relative flex flex-1 flex-col"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex-1 overflow-y-auto px-2">
        <motion.div
          className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-10 pt-6"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              variants={itemVariants}
            />
          ))}
          <div ref={endRef} />
        </motion.div>
      </div>

      <motion.div
        layoutId="chat-input"
        className="mx-auto w-full max-w-3xl px-4 pb-6 pt-4"
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          disabled={isSending}
        />
      </motion.div>
    </motion.section>
  );
};
