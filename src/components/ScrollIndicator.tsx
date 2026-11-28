import { useEffect, useRef, useState } from "react";

export default function ScrollIndicator() {
  const [state, setState] = useState({ top: 0, height: 0, visible: false });
  const timer = useRef<number>();

  useEffect(() => {
    const measure = (show: boolean) => {
      const doc = document.documentElement;
      const vh = window.innerHeight;
      const sh = doc.scrollHeight;
      if (sh <= vh + 1) return setState({ top: 0, height: 0, visible: false });
      const height = Math.max((vh / sh) * vh, 32);
      const top = (window.scrollY / (sh - vh)) * (vh - height);
      setState((s) => ({ top, height, visible: show ? true : s.visible }));
    };
    const onScroll = () => {
      measure(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState((s) => ({ ...s, visible: false })), 1000);
    };
    const onResize = () => measure(false);
    measure(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!state.height) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0.5 z-50 w-1.5 rounded-full bg-muted-foreground/40 transition-opacity duration-300"
      style={{ top: state.top, height: state.height, opacity: state.visible ? 1 : 0 }}
    />
  );
}
