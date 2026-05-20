import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/genytracer-logo.png";
import authBg from "@/assets/auth-bg-login.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!cred.user.emailVerified) {
        await auth.signOut();
        toast.error("Please verify your email before logging in.");
        return;
      }
      navigate("/", { replace: true });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-background bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-card/85 backdrop-blur-xl border border-border/60 shadow-2xl p-8">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="GenyTracer" width={96} height={96} className="h-24 w-24" style={{ filter: "brightness(0)" }} />
          <h1 className="font-heading text-2xl font-semibold mt-5 tracking-tight">GenyTracer</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="h-12" />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="h-12" />
          <Button type="submit" className="w-full h-12 mt-2" disabled={loading}>
            {loading ? "Signing in…" : "Log In"}
          </Button>
          <div className="flex justify-end -mt-1">
            <Link
              to="/reset-password"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          If you are new to GenyTracer
        </div>
        <Link to="/signup">
          <Button variant="outline" className="w-full h-12 mt-3">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
