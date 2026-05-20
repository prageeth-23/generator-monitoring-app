import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, database, ref, get, set } from "@/lib/firebase";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      // Treat unverified users as signed-out for the app's purposes
      if (u && !u.emailVerified) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      setUser(u);
      if (u) {
        try {
          const userRef = ref(database, `users/${u.uid}`);
          const snap = await get(userRef);
          if (snap.exists()) {
            setProfile(snap.val());
          } else {
            // Promote pending profile (created at signup) now that email is verified
            const pendingSnap = await get(ref(database, `pendingUsers/${u.uid}`));
            if (pendingSnap.exists()) {
              const data = pendingSnap.val();
              await set(userRef, { ...data, verifiedAt: Date.now() });
              setProfile(data);
            } else {
              setProfile({ email: u.email ?? undefined });
            }
          }
        } catch {
          setProfile({ email: u.email ?? undefined });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
