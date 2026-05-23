import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  layoutId?: string;
};

export const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Message ChatGPT",
  layoutId,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (disabled) {
        return;
      }
      onSend();
    }
  };

  return (
    <motion.div
      layout
      layoutId={layoutId}
      className="relative glass-input rounded-3xl px-4 py-3 glow-ring transition focus-within:shadow-[0_0_0_1px_rgba(56,189,248,0.55),0_0_30px_rgba(56,189,248,0.35)]"
    >
      <div className="absolute inset-0 rounded-3xl border border-white/5" />
      <div className="relative flex items-end gap-3">
        <textarea
          ref={textareaRef}
          className="max-h-32 w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-muted"
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onSend}
          disabled={disabled || value.trim().length === 0}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};
