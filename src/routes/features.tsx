import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { engineeredFeatures } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Feature Engineering · TrafficIQ" },
      { name: "description", content: "Engineered features with predictive rationale — temporal, weather, lag and derived signals." },
      { property: "og:title", content: "TrafficIQ Feature Engineering" },
      { property: "og:description", content: "15 features that power the traffic forecasting models." },
    ],
  }),
  component: Features,
});

const typeColor: Record<string, string> = {
  Temporal: "oklch(0.55 0.24 295)",
  Weather: "oklch(0.7 0.18 235)",
  Lag: "oklch(0.7 0.18 155)",
  Rolling: "oklch(0.78 0.17 75)",
  Calendar: "oklch(0.62 0.22 20)",
  Derived: "oklch(0.5 0.22 292)",
  Target: "oklch(0.35 0.05 280)",
};

function Features() {
  return (
    <div>
      <PageHeader
        eyebrow="Feature Store"
        title="Feature Engineering"
        description="15 engineered features designed to encode temporal rhythms, weather effects and autocorrelation."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {engineeredFeatures.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <GlassCard className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(109,40,217,0.35)]">
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: (typeColor[f.type] ?? "#888") + "1a", color: typeColor[f.type] ?? "#555" }}
                >
                  {f.type}
                </span>
                <span className="text-[10px] text-muted-foreground">Importance</span>
              </div>
              <h3 className="mt-2 text-base font-semibold">{f.name}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{f.reason}</p>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 text-primary"><Sparkles className="h-3 w-3" /> Signal</span>
                  <span className="font-semibold">{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.importance * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.03 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${typeColor[f.type] ?? "oklch(0.55 0.24 295)"}, oklch(0.55 0.24 295))` }}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
