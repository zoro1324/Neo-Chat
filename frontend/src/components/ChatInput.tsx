import { Paperclip, ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  layoutId?: string;
  isLanding?: boolean;
  onFileUpload?: (file: File) => void;
};

export const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = "Message Neo-Chat",
  layoutId,
  isLanding = false,
  onFileUpload,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (disabled || (!isLanding && value.trim().length === 0)) return;
      onSend();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasText = value.trim().length > 0;
  const isSendActive = (isLanding && hasText) || hasText;
  const sendButtonClass = isSendActive
    ? "bg-[#5850ec] hover:bg-[#6366f1] text-white shadow-[0_0_15px_rgba(88,80,236,0.35)] cursor-pointer"
    : "bg-[#20212a] text-[#4e4f56] cursor-not-allowed";

  return (
    <motion.div layout layoutId={layoutId} className="relative rounded-[28px] border border-white/10 bg-[#161820]/90 px-4 py-2.5 transition-all duration-250 focus-within:border-white/20 focus-within:bg-[#161820] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.4)]">
      <div className="relative flex items-center gap-3">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.txt,.docx" />
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9b9ca4] transition hover:bg-white/5 hover:text-white cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          className="max-h-32 w-full resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-white outline-none placeholder:text-[#5c5e66]"
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />

        <button
          type="button"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${sendButtonClass}`}
          onClick={onSend}
          disabled={disabled || (!isLanding && !hasText)}
        >
          <ArrowUp className="h-[18px] w-[18px] stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
};

