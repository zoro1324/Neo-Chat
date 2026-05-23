import { lazy, memo, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";

const LazySpline = lazy(() => import("@splinetool/react-spline"));

type SplineHeroProps = {
  scene: string;
};

const SplineSkeleton = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/5">
    <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.25),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(34,211,238,0.2),transparent_65%)]" />
  </div>
);

export const SplineHero = memo(({ scene }: SplineHeroProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto h-95 w-[min(520px,85vw)] rounded-[40px]"
      animate={
        reduceMotion
          ? { y: 0 }
          : {
              y: [0, -12, 0],
            }
      }
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <Suspense fallback={<SplineSkeleton />}>
        <LazySpline scene={scene} />
      </Suspense>
    </motion.div>
  );
});

SplineHero.displayName = "SplineHero";
