import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/genytracer-logo.png";

interface SplashProps {
  onDone?: () => void;
}

export default function Splash({ onDone }: SplashProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);   // brief black
    const t2 = setTimeout(() => setPhase(2), 1300);  // logo settles, text reveals
    const t3 = setTimeout(() => {
      if (onDone) {
        if (!loading && !user) navigate("/login", { replace: true });
        else onDone();
      } else {
        navigate(user ? "/" : "/login", { replace: true });
      }
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigate, user, loading, onDone]);

  const word = "GenyTracer";

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden z-50">
      {phase >= 1 && (
        <img
          src={logo}
          alt="GenyTracer"
          width={512}
          height={512}
          className={`select-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === 1
              ? "h-44 w-44 opacity-100 scale-100 translate-y-0"
              : "h-28 w-28 opacity-100 -translate-y-4 scale-100"
          }`}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      )}
      {phase === 2 && (
        <div className="mt-5 -translate-y-4 flex font-heading text-4xl md:text-5xl font-semibold text-white tracking-wide">
          {word.split("").map((ch, i) => (
            <span
              key={i}
              className="opacity-0"
              style={{
                animation: `splashChar 360ms cubic-bezier(0.22,1,0.36,1) forwards`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      )}
      <style>{`
        @keyframes splashChar {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
