import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

export type AnimatedTooltipItem = {
  id: string;
  name: string;
  designation: string;
  image: string;
};

type AnimatedTooltipProps = {
  items: AnimatedTooltipItem[];
  className?: string;
};

/**
 * Aceternity-style animated tooltip (manual port).
 * @see https://ui.aceternity.com/components/animated-tooltip
 */
export function AnimatedTooltip({
  items,
  className = "",
}: AnimatedTooltipProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.currentTarget.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    });
  };

  return (
    <div className={`flex flex-row items-center ${className}`}>
      {items.map((item) => (
        <div
          className="group relative -mr-3 first:ml-0"
          key={item.id}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredId === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.88 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                }}
                exit={{ opacity: 0, y: 16, scale: 0.88 }}
                style={{
                  translateX,
                  rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-[4.25rem] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-text-primary)] px-3 py-2 text-xs shadow-[var(--shadow-lg)]"
              >
                <div className="relative z-30 text-sm font-semibold text-[var(--color-text-inverse)]">
                  {item.name}
                </div>
                <div className="relative z-30 max-w-[200px] truncate text-[11px] text-[var(--color-text-inverse)]/85">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={40}
            width={40}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-9 w-9 rounded-full border-2 border-[var(--color-surface)] object-cover object-top !p-0 transition duration-300 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
