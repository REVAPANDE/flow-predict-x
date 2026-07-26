import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Bell, Cpu, Database, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · TrafficIQ" },
      { name: "description", content: "Configure inference thresholds, notifications and data connections for the platform." },
      { property: "og:title", content: "TrafficIQ Settings" },
      { property: "og:description", content: "Platform configuration for the traffic intelligence system." },
    ],
  }),
  component: Settings,
});

function Row({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/60 bg-white/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span className={`inline-flex h-6 w-11 items-center rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
      <span className={`ml-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
    </span>
  );
}

function Settings() {
  return (
    <div>
      <PageHeader eyebrow="Platform" title="Settings" description="Configure inference behaviour, integrations and alerting." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Inference</h3>
          <div className="space-y-3">
            <Row icon={<Cpu className="h-4.5 w-4.5" />} title="Active Model" desc="XGBoost v2.1 · promoted 2024-06-30" action={<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">Serving</span>} />
            <Row icon={<Shield className="h-4.5 w-4.5" />} title="Auto-fallback" desc="Route to Random Forest on latency > 40ms" action={<Toggle on />} />
            <Row icon={<Database className="h-4.5 w-4.5" />} title="Feature Store" desc="lovable-cloud · 15 features · hourly refresh" action={<Toggle on />} />
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Alerts</h3>
          <div className="space-y-3">
            <Row icon={<Bell className="h-4.5 w-4.5" />} title="Congestion > 85%" desc="Push to command center console" action={<Toggle on />} />
            <Row icon={<Bell className="h-4.5 w-4.5" />} title="Model Drift" desc="Weekly PSI monitor across 15 features" action={<Toggle on />} />
            <Row icon={<Bell className="h-4.5 w-4.5" />} title="Weather-triggered rerun" desc="Re-score corridors when rainfall > 2mm/h" action={<Toggle /> } />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
