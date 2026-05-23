import { motion, useReducedMotion } from "motion/react";
import { ChatInput } from "./ChatInput";
import { SplineHero } from "./SplineHero";

type LandingViewProps = {
  scene: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export const LandingView = ({
  scene,
  inputValue,
  onInputChange,
  onSend,
  isSending,
}: LandingViewProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      layout
      layoutId="main-panel"
      className="relative flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          layoutId="spline-hero"
          className="drop-shadow-[0_40px_80px_rgba(8,16,40,0.5)]"
          exit={{ opacity: 0, scale: 0.7, y: -30 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <SplineHero scene={scene} />
        </motion.div>
        <motion.div
          className="glass-panel rounded-full px-5 py-2 text-xs text-muted"
          animate={reduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Press on the canvas to focus and interact
        </motion.div>
      </motion.div>

      <motion.div
        layoutId="chat-input"
        className="absolute bottom-8 left-1/2 w-full max-w-2xl -translate-x-1/2 px-6"
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
