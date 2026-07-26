import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { AnimatedNumber } from "./AnimatedNumber";
import type { Kpi } from "@/lib/mockApi";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const toneMap: Record<string, string> = {
  primary: "from-primary/15 to-primary/0 text-primary",
  success: "from-emerald-500/15 to-emerald-500/0 text-emerald-600",
  info: "from-sky-500/15 to-sky-500/0 text-sky-600",
  warning: "from-amber-500/20 to-amber-500/0 text-amber-600",
};

export function KpiCard({ kpi, index = 0 }: { kpi: Kpi; index?: number }) {
  const numeric = typeof kpi.value === "string" ? parseFloat(kpi.value.replace(/[^0-9.]/g, "")) : kpi.value;
  const isNumeric = !Number.isNaN(numeric) && typeof numeric === "number" && (typeof kpi.value === "number" || /\d/.test(String(kpi.value)));
  const suffix = typeof kpi.value === "string" ? kpi.value.replace(/[0-9.,\s]/g, "").trim() : "";
  const showRaw = typeof kpi.value === "string" && !/\d/.test(kpi.value);
  const positive = kpi.delta?.trim().startsWith("+");
  const tone = kpi.tone ?? "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <GlassCard className="group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(109,40,217,0.35)]">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${toneMap[tone]}`} />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {showRaw ? (
                kpi.value
              ) : isNumeric ? (
                <>
                  <AnimatedNumber value={numeric as number} />
                  {suffix && <span className="ml-1 text-lg text-muted-foreground">{suffix}</span>}
                </>
              ) : (
                kpi.value
              )}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {kpi.delta && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                  positive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}
              >
                {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.delta}
              </span>
            )}
            {kpi.hint && <span className="text-muted-foreground">{kpi.hint}</span>}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
