import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { datasetSummary, datasetRows, featureDistributions, correlationMatrix } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "Dataset Explorer · TrafficIQ" },
      { name: "description", content: "Explore the processed hourly traffic dataset: distributions, correlations and sample rows." },
      { property: "og:title", content: "TrafficIQ Dataset Explorer" },
      { property: "og:description", content: "48,204 hourly observations across 15 engineered features." },
    ],
  }),
  component: Dataset,
});

const summaryTiles = [
  { label: "Samples", value: datasetSummary.samples.toLocaleString() },
  { label: "Features", value: datasetSummary.features },
  { label: "Granularity", value: datasetSummary.granularity },
  { label: "Target", value: datasetSummary.target },
  { label: "Train / Test", value: `${datasetSummary.trainSplit} / ${datasetSummary.testSplit}` },
  { label: "Missing", value: `${datasetSummary.missing}%` },
];

function corrColor(v: number) {
  const a = Math.min(1, Math.abs(v));
  return v >= 0
    ? `oklch(${0.98 - a * 0.4} ${0.03 + a * 0.2} 292)`
    : `oklch(${0.98 - a * 0.4} ${0.03 + a * 0.15} 25)`;
}

function Dataset() {
  const corrKeys = ["Volume", "Hour", "Temp", "Rain", "Holiday", "Lag1"] as const;
  return (
    <div>
      <PageHeader
        eyebrow="Dataset"
        title="Dataset Explorer"
        description="Time range 2019-01-01 → 2024-06-30 · already preprocessed and feature-engineered."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {summaryTiles.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <GlassCard className="p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t.label}</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">{t.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Feature Distribution · Traffic Volume</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={featureDistributions} margin={{ left: -14 }}>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="bin" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" fill="oklch(0.55 0.24 295)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Correlation Heatmap</h3>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              −1
              <div className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.58 0.18 25), #fff, oklch(0.48 0.23 292))" }} />
              +1
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="p-1 text-left text-muted-foreground"></th>
                  {corrKeys.map((k) => <th key={k} className="p-1 text-muted-foreground">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {correlationMatrix.map((row) => (
                  <tr key={row.f}>
                    <td className="p-1 pr-2 text-right font-medium text-muted-foreground">{row.f}</td>
                    {corrKeys.map((k) => {
                      const v = (row as any)[k] as number;
                      return (
                        <td key={k} className="p-1">
                          <div className="rounded-md py-1.5 text-center font-mono" style={{ background: corrColor(v), color: Math.abs(v) > 0.6 ? "white" : "#333" }}>
                            {v.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Train / Test Split</h3>
          <div className="flex h-4 overflow-hidden rounded-full">
            <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-primary to-primary/70" />
            <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-sky-500/70" />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" /> Train · 38,563</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-500" /> Test · 9,641</span>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground">Missing Values</h4>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-emerald-500/70" style={{ width: "99.6%" }} />
              <div className="h-full bg-rose-500/70" style={{ width: "0.4%" }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">99.6% complete · 193 rows imputed via linear interpolation</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Sample Rows</h3>
          <div className="max-h-[300px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white/80 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Timestamp</th>
                  <th className="p-2 text-right">Hour</th>
                  <th className="p-2 text-right">DoW</th>
                  <th className="p-2 text-right">Temp</th>
                  <th className="p-2 text-right">Rain</th>
                  <th className="p-2 text-right">Cloud</th>
                  <th className="p-2 text-right">Holiday</th>
                  <th className="p-2 text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                {datasetRows.map((r) => (
                  <tr key={r.id} className="border-t border-black/5 hover:bg-primary/5">
                    <td className="p-2 font-mono text-muted-foreground">{r.id}</td>
                    <td className="p-2 font-mono">{r.timestamp}</td>
                    <td className="p-2 text-right">{r.hour}</td>
                    <td className="p-2 text-right">{r.dayOfWeek}</td>
                    <td className="p-2 text-right">{r.temp}</td>
                    <td className="p-2 text-right">{r.rainfall}</td>
                    <td className="p-2 text-right">{r.cloud}</td>
                    <td className="p-2 text-right">{r.holiday}</td>
                    <td className="p-2 text-right font-medium">{r.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
