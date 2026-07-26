import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  trafficTrend, weeklyTraffic, monthlyTrend, featureImportance, congestionHeatmap,
} from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Traffic Analytics · TrafficIQ" },
      { name: "description", content: "Hourly, weekly and monthly traffic patterns with feature importance and prediction accuracy." },
      { property: "og:title", content: "TrafficIQ Analytics" },
      { property: "og:description", content: "Deep analytics across the traffic network." },
    ],
  }),
  component: Analytics,
});

const congestionDist = [
  { name: "Free", value: 32, color: "oklch(0.7 0.18 155)" },
  { name: "Moderate", value: 41, color: "oklch(0.78 0.17 75)" },
  { name: "Heavy", value: 19, color: "oklch(0.62 0.22 20)" },
  { name: "Severe", value: 8, color: "oklch(0.5 0.22 292)" },
];

const accuracyByModel = [
  { model: "Random Forest", acc: 91 },
  { model: "XGBoost", acc: 95 },
  { model: "SVR", acc: 88 },
];

function Analytics() {
  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Traffic Analytics"
        description="Cross-sectional and time-series analytics powering the operations team."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Hourly Traffic</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficTrend} margin={{ left: -10, right: 6 }}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="oklch(0.55 0.24 295)" strokeWidth={2.5} fill="url(#a1)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Weekly Traffic</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyTraffic} margin={{ left: -18 }}>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="volume" fill="oklch(0.55 0.24 295)" radius={[8,8,0,0]} />
              <Bar dataKey="congestion" fill="oklch(0.7 0.18 235)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyTrend} margin={{ left: -8 }}>
              <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={54} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="volume" stroke="oklch(0.55 0.24 295)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.55 0.24 295)" }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Congestion Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={congestionDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {congestionDist.map((c) => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Prediction Accuracy by Model</h3>
          <div className="space-y-3">
            {accuracyByModel.map((m, i) => (
              <div key={m.model}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{m.model}</span>
                  <span className="text-muted-foreground">{m.acc}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.acc}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: i === 1 ? "linear-gradient(90deg, oklch(0.55 0.24 295), oklch(0.42 0.22 285))" : "oklch(0.7 0.18 235)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Feature Importance</h3>
          <div className="space-y-2.5">
            {featureImportance.map((f, i) => (
              <div key={f.feature}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{f.feature}</span>
                  <span className="text-muted-foreground">{(f.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.weight * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
