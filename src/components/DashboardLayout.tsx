import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "@/components/ProfileDialog";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  alertCount?: number;
}

export function DashboardLayout({ children, title, alertCount = 0 }: DashboardLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { profile, user } = useAuth();
  const initials = (profile?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="font-heading text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {alertCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive">
                    {alertCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProfileOpen(true)}
                className="gap-2 h-9 pl-2 pr-3"
              >
                <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-xs font-semibold text-accent-foreground">{initials}</span>
                </div>
                <span className="hidden sm:inline text-sm">Profile</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </SidebarProvider>
  );
}
