import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { useState } from "react";
import type { ChatMessage } from "../hooks/useChat";
import { Copy, ThumbsUp, ThumbsDown, Volume2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";

type MessageBubbleProps = {
  message: ChatMessage;
  variants?: Variants;
};

const RobotAvatar = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full select-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="purpleGlow" cx="50%" cy="40%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4c1d95" />
      </radialGradient>
      <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#0891b2" />
      </radialGradient>
      <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
    
    {/* Dark cosmic blue background */}
    <rect width="100" height="100" fill="#0d0e14" />
    <circle cx="50" cy="50" r="46" fill="#14151f" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2" />
    
    {/* Neck and Shoulder Base */}
    <path d="M30 95 C30 82, 70 82, 70 95 Z" fill="url(#collarGrad)" />
    <ellipse cx="50" cy="84" rx="16" ry="5" fill="#94a3b8" />
    
    {/* White Head Base Collar */}
    <ellipse cx="50" cy="74" rx="22" ry="7" fill="url(#collarGrad)" />
    
    {/* Purple Glowing Dome Head */}
    <circle cx="50" cy="50" r="26" fill="url(#purpleGlow)" />
    
    {/* Head Earpads */}
    <rect x="20" y="44" width="4" height="12" rx="2" fill="#cbd5e1" />
    <rect x="76" y="44" width="4" height="12" rx="2" fill="#cbd5e1" />
    
    {/* Glowing Eyes */}
    <ellipse cx="42" cy="50" rx="3.5" ry="5.5" fill="url(#eyeGlow)" />
    <ellipse cx="58" cy="50" rx="3.5" ry="5.5" fill="url(#eyeGlow)" />
    
    {/* Glossy Dome Highlight */}
    <path d="M32 38 C38 30, 48 26, 62 29 C52 23, 38 25, 32 38" fill="#ffffff" opacity="0.3" />
  </svg>
);

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#07080c] shadow-lg">
      <div className="flex items-center justify-between bg-[#12131a] px-4 py-2 text-xs text-[#9b9ca4] border-b border-white/5 select-none font-sans">
        <span className="font-mono uppercase font-semibold text-[#818cf8]">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-0.5 transition hover:bg-white/5 hover:text-white cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-[#e5e7eb] font-mono">
        <pre className="m-0 bg-transparent border-none p-0">
          <code className="p-0 bg-transparent border-none text-inherit">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const MessageBubble = ({ message, variants }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    void navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        layout
        variants={variants}
        className="flex w-full justify-end py-2"
      >
        <div className="max-w-[75%] rounded-[22px] bg-[#1c1d25] border border-white/5 px-5 py-3 text-[15px] leading-relaxed text-white shadow-sm whitespace-pre-wrap font-sans">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      variants={variants}
      className="flex w-full gap-4.5 py-3.5 font-sans"
    >
      {/* Robot Avatar Column */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/15 bg-[#14151c] shadow-sm">
        <RobotAvatar />
      </div>

      {/* Message Bubble + Actions Column */}
      <div className="flex flex-col max-w-[80%]">
        {/* Assistant Bubble */}
        <div className="rounded-[22px] bg-[#181922] border border-white/5 px-5 py-3 text-[15px] leading-relaxed text-white shadow-sm prose max-w-none">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img {...props} className="max-w-full rounded-lg my-2 border border-white/10" loading="lazy" />
              ),
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const lang = match ? match[1] : "";
                const codeText = String(children).replace(/\n$/, "");
                const isBlock = match || codeText.includes("\n");
                
                if (isBlock) {
                  return <CodeBlock code={codeText} language={lang} />;
                }
                
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>


        {/* Action icons below the bubble */}
        <div className="mt-2 flex items-center gap-3 px-1 text-[#676870]">
          <button
            onClick={handleCopy}
            className="rounded p-1 transition hover:bg-white/5 hover:text-white cursor-pointer"
            aria-label="Copy response"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setLiked(liked === true ? null : true)}
            className={`rounded p-1 transition hover:bg-white/5 hover:text-white cursor-pointer ${
              liked === true ? "text-[#5850ec]" : ""
            }`}
            aria-label="Like response"
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLiked(liked === false ? null : false)}
            className={`rounded p-1 transition hover:bg-white/5 hover:text-white cursor-pointer ${
              liked === false ? "text-[#ef4444]" : ""
            }`}
            aria-label="Dislike response"
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            className="rounded p-1 transition hover:bg-white/5 hover:text-white cursor-pointer"
            aria-label="Read aloud"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
