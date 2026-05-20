import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, Mail } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: Props) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Could not send reset email");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onOpenChange(false);
    navigate("/login", { replace: true });
  };

  const initials = (profile?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Account settings and session</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 py-2">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center font-semibold text-accent-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            {profile?.firstName && (
              <div className="font-medium truncate">{profile.firstName} {profile.lastName}</div>
            )}
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5" /> {user?.email}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={handleReset}>
            <KeyRound className="h-4 w-4" /> Account Password Reset
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
