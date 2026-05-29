import { useEffect, useRef } from "react";

export function useScrollRestoration(
  scrollRef: React.RefObject<{ scrollTo: (options: { y: number; animated: boolean }) => void } | null>,
  scrollOffset: number,
) {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    if (scrollOffset <= 0) {
      hasRestored.current = true;
      return;
    }
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: scrollOffset, animated: false });
      hasRestored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [scrollOffset]);

  useEffect(() => {
    return () => {
      hasRestored.current = false;
    };
  }, []);
}
