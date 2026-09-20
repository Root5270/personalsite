"use client";

import { useEffect, useRef } from "react";

export function IntroScene({ children }: { children: React.ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      scene.style.setProperty("--mx", x.toFixed(3));
      scene.style.setProperty("--my", y.toFixed(3));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="intro-scene" ref={sceneRef}>
      {children}
    </div>
  );
}
