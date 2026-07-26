import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  overviewKpis, trafficTrend, weeklyTraffic, liveStatus,
  recentPredictions, congestionHeatmap,
} from "@/lib/mockApi";
import { KpiCard } from "@/components/common/KpiCard";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Dashboard · TrafficIQ" },
      { name: "description", content: "Live KPIs, congestion heatmap and prediction stream across the city corridor network." },
      { property: "og:title", content: "TrafficIQ Command Dashboard" },
      { property: "og:description", content: "Real-time traffic KPIs, ML model status and live predictions." },
    ],
  }),
  component: Dashboard,
});

const statusTone: Record<string, string> = {
  Heavy: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Moderate: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Free: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function Heatmap({ data }: { data: number[][] }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="mb-1 grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-1 text-[9px] text-muted-foreground">
          <div />
          {Array.from({ length: 24 }).map((_, h) => (
            <div key={h} className="text-center">{h % 3 === 0 ? h : ""}</div>
          ))}
        </div>
        {data.map((row, di) => (
          <div key={di} className="mb-1 grid grid-cols-[40px_repeat(24,minmax(0,1fr))] items-center gap-1">
            <div className="text-[10px] font-medium text-muted-foreground">{days[di]}</div>
            {row.map((v, hi) => (
              <motion.div
                key={hi}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: (di * 24 + hi) * 0.002 }}
                className="aspect-square rounded"
                style={{
                  background: `oklch(${0.98 - (v / 100) * 0.5} ${0.03 + (v / 100) * 0.2} 292)`,
                }}
                title={`${days[di]} ${hi}:00 — ${v}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Smart City Command Center · Live"
        title="Traffic Intelligence Overview"
        description="Real-time congestion posture, model health and predictive signals across 42 monitored corridors."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {overviewKpis.map((k, i) => <KpiCard key={k.label} kpi={k} index={i} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Traffic Volume · Actual vs Predicted</h3>
              <p className="text-xs text-muted-foreground">Last 24 hours across the monitored network</p>
            </div>
            <div className="flex gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Predicted</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Actual</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trafficTrend} margin={{ left: -10, right: 8 }}>
              <defs>
                <linearGradient id="p1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="p2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 235)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="oklch(0.7 0.18 235)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7c7893" }} interval={2} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7c7893" }} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.95)", fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="oklch(0.7 0.18 235)" strokeWidth={2} fill="url(#p2)" />
              <Area type="monotone" dataKey="predicted" stroke="oklch(0.55 0.24 295)" strokeWidth={2.5} fill="url(#p1)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Weekly Rhythm</h3>
            <p className="text-xs text-muted-foreground">Volume and congestion by weekday</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyTraffic} margin={{ left: -20, right: 4 }}>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7c7893" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7c7893" }} width={44} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.95)", fontSize: 12 }} />
              <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
                {weeklyTraffic.map((_, i) => (
                  <Cell key={i} fill={i >= 5 ? "oklch(0.7 0.18 235)" : "oklch(0.55 0.24 295)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Congestion Heatmap</h3>
              <p className="text-xs text-muted-foreground">Hourly congestion intensity by day of week</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              Low
              <div className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg, oklch(0.98 0.03 292), oklch(0.48 0.23 292))" }} />
              High
            </div>
          </div>
          <Heatmap data={congestionHeatmap} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Live Corridor Status</h3>
            <span className="text-[11px] text-muted-foreground">6 monitored</span>
          </div>
          <div className="space-y-2">
            {liveStatus.map((c, i) => (
              <motion.div
                key={c.corridor}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{c.corridor}</p>
                  <p className="text-[11px] text-muted-foreground">{c.volume.toLocaleString()} veh/h · {c.speed} km/h</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusTone[c.status]}`}>{c.status}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recent Predictions</h3>
              <p className="text-xs text-muted-foreground">Streaming from XGBoost inference service</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Model: XGBoost v2.1</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Corridor</th>
                  <th className="pb-2 text-right">Predicted</th>
                  <th className="pb-2 text-right">Actual</th>
                  <th className="pb-2 text-right">Δ</th>
                  <th className="pb-2 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((r) => {
                  const diff = r.actual - r.predicted;
                  return (
                    <tr key={r.time} className="border-t border-black/5">
                      <td className="py-2 font-mono text-xs text-muted-foreground">{r.time}</td>
                      <td className="py-2 font-medium">{r.corridor}</td>
                      <td className="py-2 text-right">{r.predicted.toLocaleString()}</td>
                      <td className="py-2 text-right">{r.actual.toLocaleString()}</td>
                      <td className={`py-2 text-right ${Math.abs(diff) < 100 ? "text-emerald-600" : "text-amber-600"}`}>
                        {diff > 0 ? "+" : ""}{diff}
                      </td>
                      <td className="py-2 text-right">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <span className="block h-full rounded-full bg-primary" style={{ width: `${r.conf * 100}%` }} />
                          </span>
                          {(r.conf * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
