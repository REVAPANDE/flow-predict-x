import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { modelComparison, radarData } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/comparison")({
  head: () => ({
    meta: [
      { title: "Model Comparison · TrafficIQ" },
      { name: "description", content: "Side-by-side model metrics, radar profile and AI insight explaining why XGBoost wins." },
      { property: "og:title", content: "TrafficIQ Model Comparison" },
      { property: "og:description", content: "Compare Random Forest, XGBoost and SVR across 9 metrics." },
    ],
  }),
  component: Comparison,
});

const winReasons = [
  { title: "Highest R²", detail: "0.95 vs 0.91 (RF) and 0.88 (SVR)" },
  { title: "Lowest MAE", detail: "2.9 — 24% better than RF" },
  { title: "Lowest RMSE", detail: "4.1 — best fit on volatile hours" },
  { title: "Fast Inference", detail: "12 ms per prediction" },
  { title: "Non-linear Patterns", detail: "Gradient boosting captures interactions between weather × hour" },
  { title: "Robust Generalization", detail: "Consistent across 5 CV folds (σ=0.006)" },
  { title: "Balanced Cost", detail: "18 MB model, 210 MB RAM at serve time" },
];

function bestOf(m: typeof modelComparison[number]) {
  const vals = [m.RandomForest, m.XGBoost, m.SVR];
  return m.better === "lower" ? Math.min(...vals) : Math.max(...vals);
}

function Comparison() {
  return (
    <div>
      <PageHeader
        eyebrow="Benchmark"
        title="Model Comparison"
        description="Nine metrics evaluated across three trained models. XGBoost promoted to production."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Metric Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2">Metric</th>
                  <th className="pb-2 text-right">Random Forest</th>
                  <th className="pb-2 text-right">XGBoost</th>
                  <th className="pb-2 text-right">SVR</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((row) => {
                  const winner = bestOf(row);
                  const cell = (v: number) =>
                    v === winner
                      ? "text-primary font-semibold"
                      : "text-foreground";
                  return (
                    <tr key={row.metric} className="border-t border-black/5">
                      <td className="py-2 font-medium">{row.metric}</td>
                      <td className={`py-2 text-right ${cell(row.RandomForest)}`}>{row.RandomForest}</td>
                      <td className={`py-2 text-right ${cell(row.XGBoost)}`}>
                        <span className="inline-flex items-center gap-1.5">
                          {row.XGBoost === winner && <Trophy className="h-3 w-3 text-primary" />}
                          {row.XGBoost}
                        </span>
                      </td>
                      <td className={`py-2 text-right ${cell(row.SVR)}`}>{row.SVR}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Capability Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(30,20,60,0.1)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} angle={30} />
              <Radar name="XGBoost" dataKey="XGB" stroke="oklch(0.55 0.24 295)" fill="oklch(0.55 0.24 295)" fillOpacity={0.35} />
              <Radar name="Random Forest" dataKey="RF" stroke="oklch(0.7 0.18 155)" fill="oklch(0.7 0.18 155)" fillOpacity={0.15} />
              <Radar name="SVR" dataKey="SVR" stroke="oklch(0.7 0.18 235)" fill="oklch(0.7 0.18 235)" fillOpacity={0.12} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Accuracy vs Latency</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              { model: "Random Forest", Accuracy: 91, InferenceMs: 18 },
              { model: "XGBoost", Accuracy: 95, InferenceMs: 12 },
              { model: "SVR", Accuracy: 88, InferenceMs: 27 },
            ]} margin={{ left: -8 }}>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="model" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Accuracy" fill="oklch(0.55 0.24 295)" radius={[8,8,0,0]} />
              <Bar dataKey="InferenceMs" fill="oklch(0.7 0.18 235)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> AI Insight
            </div>
            <h3 className="mt-3 text-base font-semibold">Why XGBoost Won</h3>
            <ul className="mt-3 space-y-2">
              {winReasons.map((r, i) => (
                <motion.li
                  key={r.title}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 text-xs"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="text-muted-foreground">{r.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
