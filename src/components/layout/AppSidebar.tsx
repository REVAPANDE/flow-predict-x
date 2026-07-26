import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BarChart3, Zap, Brain, GitCompare, Database,
  Sparkles, Lightbulb, FileText, Settings, Activity,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Traffic Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Live Prediction", url: "/predict", icon: Zap },
];
const ml = [
  { title: "ML Models", url: "/models", icon: Brain },
  { title: "Model Comparison", url: "/comparison", icon: GitCompare },
  { title: "Dataset Explorer", url: "/dataset", icon: Database },
  { title: "Feature Engineering", url: "/features", icon: Sparkles },
];
const ops = [
  { title: "Recommendations", url: "/recommendations", icon: Lightbulb },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (u: string) => (u === "/" ? pathname === "/" : pathname.startsWith(u));

  const Section = ({ label, items }: { label: string; items: typeof primary }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} className="h-10 rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm">
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/60">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-[0_8px_20px_-8px_rgba(109,40,217,0.6)]">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">TrafficIQ</p>
            <p className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">AI Command Center</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <Section label="Operations" items={primary} />
        <Section label="Machine Learning" items={ml} />
        <Section label="Insights" items={ops} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
          <div className="min-w-0 text-xs">
            <p className="truncate font-medium text-foreground">Ops Team</p>
            <p className="truncate text-muted-foreground">Command Center</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
