import { motion } from "motion/react";
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

  return (
    <motion.section
      layout
      layoutId="main-panel"
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Robot component placed directly above the input */}
      <motion.div
        className="mb-4 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          layoutId="spline-hero"
          exit={{ opacity: 0, scale: 0.7, y: -30 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <SplineHero scene={scene} />
        </motion.div>
      </motion.div>

      {/* Input box directly beneath the robot group */}
      <motion.div
        layoutId="chat-input"
        className="w-full px-2"
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSend}
          disabled={isSending}
          isLanding={true}
        />
      </motion.div>
    </motion.section>
  );
};
