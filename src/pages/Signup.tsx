import { useState, FormEvent, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth, database, ref, set } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import logo from "@/assets/genytracer-logo.png";
import authBg from "@/assets/auth-bg-signup.jpg";

const passwordRegex = /^(?=.*[A-Z])(?=(?:.*\d){2,})(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const isValid = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      Number(age) > 0 &&
      emailRegex.test(email.trim()) &&
      passwordRegex.test(password) &&
      password === confirmPassword
    );
  }, [firstName, lastName, age, email, password, confirmPassword]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    const trimmedEmail = email.trim();
    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

      // Stage profile data in a pending node — will be promoted to /users/{uid}
      // only after the user verifies their email (handled in AuthContext).
      await set(ref(database, `pendingUsers/${cred.user.uid}`), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: Number(age),
        email: trimmedEmail,
        createdAt: Date.now(),
      });

      await sendEmailVerification(cred.user, {
        url: window.location.origin + "/login",
      });

      // Sign out so the user cannot access protected routes until verified
      await auth.signOut();
      setPendingEmail(trimmedEmail);
      setPendingVerification(true);
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        // Account exists — check if it was ever verified. If not, resend the
        // verification link instead of blocking the user.
        try {
          const existing = await signInWithEmailAndPassword(auth, trimmedEmail, password);
          if (existing.user.emailVerified) {
            await auth.signOut();
            toast.error("This email is already verified and in use. Please log in instead.");
          } else {
            // Refresh the staged profile so the latest details get promoted on verify
            await set(ref(database, `pendingUsers/${existing.user.uid}`), {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              age: Number(age),
              email: trimmedEmail,
              createdAt: Date.now(),
            });
            await sendEmailVerification(existing.user, {
              url: window.location.origin + "/login",
            });
            await auth.signOut();
            toast.success("A new verification link has been sent to your email.");
            setPendingEmail(trimmedEmail);
            setPendingVerification(true);
          }
        } catch (signInErr: any) {
          if (signInErr?.code === "auth/wrong-password" || signInErr?.code === "auth/invalid-credential") {
            toast.error("This email is already registered. Please use the correct password or reset it.");
          } else {
            toast.error(signInErr?.message ?? "Could not resend verification email");
          }
        }
      } else {
        toast.error(err?.message ?? "Could not create account");
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
      <div className="relative w-full max-w-sm rounded-2xl bg-card/85 backdrop-blur-xl border border-border/60 shadow-2xl p-8 my-10">
        {pendingVerification ? (
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-success/15 flex items-center justify-center mb-5">
              <MailCheck className="h-8 w-8 text-success" />
            </div>
            <h1 className="font-heading text-xl font-semibold tracking-tight">Verification Pending</h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We have sent a secure verification link to{" "}
              <span className="font-medium text-foreground">{pendingEmail}</span>. Please click the link to verify your
              account.
            </p>
            <div className="text-xs text-muted-foreground mt-4">
              Didn&apos;t see it? Check your spam folder.
            </div>
            <Button className="w-full h-12 mt-6" onClick={() => navigate("/login", { replace: true })}>
              Go to Log In
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="GenyTracer" width={64} height={64} className="h-16 w-16" style={{ filter: "brightness(0)" }} />
              <h1 className="font-heading text-xl font-semibold mt-4 tracking-tight">Create your account</h1>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12" />
              <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12" />
              <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} min={1} className="h-12" />
              <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
              />

              {/* Password Requirements */}
  <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
    <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
    <ul className="space-y-1.5">
      <li className={`flex items-center gap-1.5 text-xs ${password.length >= 6 ? "text-green-500" : "text-muted-foreground"}`}>
        <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-medium ${password.length >= 6 ? "bg-green-100 text-green-600" : "border border-border"}`}>
          {password.length >= 6 ? "✓" : "○"}
        </span>
        Minimum 6 characters
      </li>
      <li className={`flex items-center gap-1.5 text-xs ${/[A-Z]/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
        <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-medium ${/[A-Z]/.test(password) ? "bg-green-100 text-green-600" : "border border-border"}`}>
          {/[A-Z]/.test(password) ? "✓" : "○"}
        </span>
        At least 1 capital letter
      </li>
      <li className={`flex items-center gap-1.5 text-xs ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
        <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-medium ${/[^A-Za-z0-9]/.test(password) ? "bg-green-100 text-green-600" : "border border-border"}`}>
          {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}
        </span>
        At least 1 symbol
      </li>
      <li className={`flex items-center gap-1.5 text-xs ${/(?:.*\d){2}/.test(password) ? "text-green-500" : "text-muted-foreground"}`}>
        <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-medium ${/(?:.*\d){2}/.test(password) ? "bg-green-100 text-green-600" : "border border-border"}`}>
          {/(?:.*\d){2}/.test(password) ? "✓" : "○"}
        </span>
        At least 2 numbers
      </li>
    </ul>
  </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full h-12 rounded-md font-medium transition-colors mt-2 ${
                  isValid && !loading
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {loading ? "Creating…" : "Submit"}
              </button>
            </form>
            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-muted-foreground hover:underline">Back to Log In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
