import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, KeyRound, ArrowLeft } from "lucide-react";
import logo from "@/assets/genytracer-logo.png";
import authBg from "@/assets/auth-bg-login.jpg";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: window.location.origin + "/login",
      });
      setSentTo(email.trim());
      setSent(true);
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        toast.error("No account found with that email.");
      } else if (err?.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error(err?.message ?? "Could not send reset email");
      }
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
        {sent ? (
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-9 w-9 text-success" />
            </div>
            <h1 className="font-heading text-xl font-semibold tracking-tight">Check your email</h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              A password reset link has been sent to{" "}
              <span className="font-medium text-foreground">{sentTo}</span>. Please check your inbox to create a new
              password.
            </p>
            <Link to="/login" className="w-full mt-6">
              <Button className="w-full h-12">Back to Log In</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="GenyTracer" width={64} height={64} className="h-16 w-16" style={{ filter: "brightness(0)" }} />
              <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center mt-5">
                <KeyRound className="h-6 w-6 text-accent" />
              </div>
              <h1 className="font-heading text-xl font-semibold mt-4 tracking-tight">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground mt-2 text-center leading-relaxed">
                Enter your registered email and we&apos;ll send you a secure link to reset it.
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12"
              />
              <Button type="submit" className="w-full h-12 mt-2" disabled={loading || !email.trim()}>
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>
            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
