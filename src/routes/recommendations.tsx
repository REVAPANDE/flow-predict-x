import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { smartRecommendations } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Lightbulb, ArrowRight, AlertTriangle, Zap, Route as RouteIcon, ShieldCheck, CloudRain } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Smart Recommendations · TrafficIQ" },
      { name: "description", content: "AI-generated actionable recommendations for signal timing, routing and incident response." },
      { property: "og:title", content: "TrafficIQ Smart Recommendations" },
      { property: "og:description", content: "Operational recommendations from the AI insights engine." },
    ],
  }),
  component: Recs,
});

const severity: Record<string, { bg: string; text: string; ring: string }> = {
  high: { bg: "bg-rose-500/10", text: "text-rose-600", ring: "ring-rose-500/20" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-600", ring: "ring-amber-500/20" },
  warning: { bg: "bg-orange-500/10", text: "text-orange-600", ring: "ring-orange-500/20" },
  info: { bg: "bg-sky-500/10", text: "text-sky-600", ring: "ring-sky-500/20" },
};

const iconFor = (title: string) => {
  if (/green|signal|adaptive/i.test(title)) return Zap;
  if (/route/i.test(title)) return RouteIcon;
  if (/alert|congestion/i.test(title)) return AlertTriangle;
  if (/emergency/i.test(title)) return ShieldCheck;
  if (/weather/i.test(title)) return CloudRain;
  return Lightbulb;
};

function Recs() {
  return (
    <div>
      <PageHeader
        eyebrow="AI Insights Engine"
        title="Smart Recommendations"
        description="Actionable recommendations generated from live predictions, historical outcomes and city-wide signal state."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {smartRecommendations.map((r, i) => {
          const Icon = iconFor(r.title);
          const tone = severity[r.severity] ?? severity.info;
          return (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className={`h-full p-5 ring-1 ${tone.ring}`}>
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.bg} ${tone.text}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full ${tone.bg} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone.text}`}>
                    {r.severity}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{r.title}</h3>
                <p className="text-xs text-muted-foreground">{r.corridor}</p>
                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Impact</p>
                    <p className="text-sm font-semibold text-primary">{r.impact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Window</p>
                    <p className="text-sm font-medium">{r.eta}</p>
                  </div>
                </div>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10">
                  Apply Recommendation <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
