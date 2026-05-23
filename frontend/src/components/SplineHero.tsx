import { memo, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

type SplineHeroProps = {
  scene: string;
};

export const SplineHero = memo(({ scene }: SplineHeroProps) => {
  const reduceMotion = useReducedMotion();
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }

    const handleLoad = () => {
      // 1. Hide the watermark logo and enforce transparent backgrounds in the Shadow DOM
      if (viewer.shadowRoot) {
        const shadowStyle = document.createElement("style");
        shadowStyle.innerHTML = `
          #logo { display: none !important; pointer-events: none !important; opacity: 0 !important; visibility: hidden !important; }
          #container { background: transparent !important; }
          canvas { background: transparent !important; }
        `;
        viewer.shadowRoot.appendChild(shadowStyle);

        const logo = viewer.shadowRoot.querySelector("#logo");
        if (logo) {
          logo.remove();
        }
      }

      // 2. Clear WebGL renderer solid background inside Spline's Application context
      try {
        const app = (viewer as any).app;
        if (app) {
          if (app.renderer) {
            app.renderer.setClearColor(0x000000, 0);
            app.renderer.alpha = true;
          }
          if (app.scene) {
            app.scene.background = null;
          }
        }
      } catch (err) {
        console.warn("[SplineHero] Failed to force transparent WebGL context", err);
      }
    };

    viewer.addEventListener("load", handleLoad);

    // In case the scene has already loaded by the time useEffect runs
    if ((viewer as any).app) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <motion.div
      className="relative mx-auto h-[380px] w-[min(480px,85vw)] rounded-[40px] overflow-hidden"
      animate={
        reduceMotion
          ? { y: 0 }
          : {
              y: [0, -8, 0],
            }
      }
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <spline-viewer
        ref={viewerRef as any}
        url={scene}
        className="w-full h-full bg-transparent"
      />
    </motion.div>
  );
});

SplineHero.displayName = "SplineHero";
