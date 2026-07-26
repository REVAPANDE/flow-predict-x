import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { predictTraffic, type PredictionResult } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { Zap, Gauge, Clock, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Live Prediction · TrafficIQ" },
      { name: "description", content: "Interactive short-term traffic prediction with confidence bands and signal recommendations." },
      { property: "og:title", content: "TrafficIQ Live Prediction" },
      { property: "og:description", content: "Simulate traffic conditions and receive AI recommendations in real time." },
    ],
  }),
  component: Predict,
});

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const roads = ["Arterial", "Highway", "Local"];

const congestionTone: Record<string, string> = {
  Low: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  Moderate: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  High: "text-orange-600 bg-orange-500/10 border-orange-500/20",
  Severe: "text-rose-600 bg-rose-500/10 border-rose-500/20",
};

function Predict() {
  const [form, setForm] = useState({
    hour: 8, day: "Monday", temperature: 26, holiday: false,
    rainfall: 0.4, cloudCover: 40, roadType: "Arterial", horizon: 6,
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const res = await predictTraffic(form);
    setResult(res);
    setLoading(false);
  }

  const field = "flex flex-col gap-1.5";
  const label = "text-[11px] font-medium uppercase tracking-wider text-muted-foreground";
  const input = "rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

  return (
    <div>
      <PageHeader
        eyebrow="Inference Studio"
        title="Live Traffic Prediction"
        description="Send scenario parameters to the XGBoost inference endpoint and receive volume, congestion and signal recommendations."
        actions={
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/70 px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_12px_30px_-10px_rgba(109,40,217,0.55)] transition-all hover:scale-[1.02] disabled:opacity-70"
          >
            {loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Zap className="h-3.5 w-3.5" />}
            Run Prediction
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Scenario Inputs</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className={field}>
              <span className={label}>Hour of Day</span>
              <input type="number" min={0} max={23} className={input} value={form.hour}
                onChange={(e) => setForm({ ...form, hour: +e.target.value })} />
            </div>
            <div className={field}>
              <span className={label}>Day</span>
              <select className={input} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
                {days.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className={field}>
              <span className={label}>Temperature (°C)</span>
              <input type="number" className={input} value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: +e.target.value })} />
            </div>
            <div className={field}>
              <span className={label}>Rainfall (mm)</span>
              <input type="number" step={0.1} className={input} value={form.rainfall}
                onChange={(e) => setForm({ ...form, rainfall: +e.target.value })} />
            </div>
            <div className={field}>
              <span className={label}>Cloud Cover (%)</span>
              <input type="number" className={input} value={form.cloudCover}
                onChange={(e) => setForm({ ...form, cloudCover: +e.target.value })} />
            </div>
            <div className={field}>
              <span className={label}>Road Type</span>
              <select className={input} value={form.roadType} onChange={(e) => setForm({ ...form, roadType: e.target.value })}>
                {roads.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className={field}>
              <span className={label}>Prediction Horizon (h)</span>
              <input type="number" min={1} max={24} className={input} value={form.horizon}
                onChange={(e) => setForm({ ...form, horizon: +e.target.value })} />
            </div>
            <div className={field}>
              <span className={label}>Holiday</span>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-sm">
                <input type="checkbox" checked={form.holiday}
                  onChange={(e) => setForm({ ...form, holiday: e.target.checked })} />
                Public holiday
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Prediction Output</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Model: XGBoost · v2.1
            </span>
          </div>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 text-center">
                <Sparkles className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">Ready to infer</p>
                <p className="text-xs text-muted-foreground">Set your scenario on the left and press Run Prediction.</p>
              </motion.div>
            ) : (
              <motion.div key={result.volume} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <MetricTile icon={<TrendingUp className="h-3.5 w-3.5" />} label="Traffic Volume" value={<AnimatedNumber value={result.volume} />} unit="veh/h" />
                  <MetricTile icon={<Gauge className="h-3.5 w-3.5" />} label="Avg Speed" value={<AnimatedNumber value={result.avgSpeed} />} unit="km/h" />
                  <MetricTile icon={<Clock className="h-3.5 w-3.5" />} label="Delay" value={<AnimatedNumber value={result.delay} />} unit="min" />
                  <MetricTile icon={<Zap className="h-3.5 w-3.5" />} label="Confidence" value={<>{(result.confidence * 100).toFixed(0)}</>} unit="%" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${congestionTone[result.congestion]}`}>
                    {result.congestion} congestion
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Confidence band: {result.band.lower.toLocaleString()} – {result.band.upper.toLocaleString()} veh/h
                  </span>
                </div>

                <div className="mt-4 h-40 rounded-xl border border-white/60 bg-white/40 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.series} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="oklch(0.55 0.24 295)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(30,20,60,0.06)" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                      <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke="oklch(0.55 0.24 295)" strokeWidth={2.5} fill="url(#pg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/0 p-4">
                  <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
                  </div>
                  <p className="text-sm text-foreground">{result.recommendation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
}

function MetricTile({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: React.ReactNode; unit: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/60 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
