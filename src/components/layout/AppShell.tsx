import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-[radial-gradient(1200px_600px_at_-10%_-20%,rgba(109,40,217,0.10),transparent_60%),radial-gradient(900px_500px_at_110%_10%,rgba(56,189,248,0.10),transparent_60%),linear-gradient(180deg,#fbfaff_0%,#f6f5fb_100%)]">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/60 bg-white/60 px-4 backdrop-blur-xl">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs text-muted-foreground md:flex">
              <Search className="h-3.5 w-3.5" />
              <span>Search corridors, models, reports…</span>
              <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live · All models healthy
              </div>
              <button className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/70 px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[0_10px_25px_-10px_rgba(109,40,217,0.6)] transition-transform hover:scale-[1.02] md:inline-flex">
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI Insights
              </button>
              <button className="relative rounded-full border border-white/60 bg-white/70 p-2 text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
