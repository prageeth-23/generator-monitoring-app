import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/genytracer-logo.png";

const LETTERS = ["P", "R", "A", "G", "E", "E", "T", "H"] as const;
// 8 positions starting at 12 o'clock, clockwise, every 45deg
const ANGLES = [-90, -45, 0, 45, 90, 135, 180, 225];

interface GenyTracerSplashSimProps {
  onDone?: () => void;
  autoRedirect?: boolean;
}

export default function GenyTracerSplashSim({ onDone, autoRedirect = false }: GenyTracerSplashSimProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [logoIn, setLogoIn] = useState(false);
  const [letterCount, setLetterCount] = useState(0);
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    // Phase 1: 1s delay then logo fade-in
    timers.push(window.setTimeout(() => setLogoIn(true), 1000));

    // After logo fade (~500ms) + 500ms pause => start letters at 2000ms
    const letterStart = 2000;
    const letterGap = 50; // fast "typing" feel
    LETTERS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLetterCount(i + 1), letterStart + i * letterGap));
    });

    // Phase 3: 0.8s after last letter -> show wordmark
    const wordmarkAt = letterStart + LETTERS.length * letterGap + 800;
    timers.push(window.setTimeout(() => setShowWordmark(true), wordmarkAt));

    // After wordmark fades in (~700ms) + 1.5s pause -> redirect
    const redirectAt = wordmarkAt + 700 + 1500;
    timers.push(
      window.setTimeout(() => {
        if (autoRedirect) {
          if (loading) return;
          navigate(user ? "/dashboard" : "/login", { replace: true });
        }
        onDone?.();
      }, redirectAt)
    );

    return () => timers.forEach(clearTimeout);
  }, [navigate, user, loading, autoRedirect, onDone]);

  // Radius for letter ring (in px) — sits much closer to the logo border
  const ringRadius = 90;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Central logo + ring container */}
      <div className="relative" style={{ width: 224, height: 224 }}>
        {/* Logo */}
        <img
          src={logo}
          alt="GenyTracer"
          className={`absolute inset-0 m-auto h-56 w-56 select-none transition-opacity duration-700 ease-out ${
            logoIn ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "brightness(0) invert(1)" }}
        />

        {/* Letters placed exactly inside the 8 hour markers */}
        {ANGLES.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * ringRadius;
          const y = Math.sin(rad) * ringRadius;
          const visible = i < letterCount;
          return (
            <span
              key={`l-${i}`}
              className={`absolute left-1/2 top-1/2 font-heading text-[10px] font-semibold leading-none text-white transition-all duration-100 ease-out ${
                visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              {LETTERS[i]}
            </span>
          );
        })}

        {/* GENY TRACER wordmark below */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-heading text-3xl md:text-4xl font-semibold tracking-[0.2em] text-white transition-all duration-700 ease-out ${
            showWordmark ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ top: `calc(100% + 60px)` }}
        >
          GENY TRACER
        </div>
      </div>
    </div>
  );
}
