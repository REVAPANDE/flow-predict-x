import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { modelCards } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Brain, CheckCircle2, Trophy } from "lucide-react";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "ML Models · TrafficIQ" },
      { name: "description", content: "Trained model registry with hyperparameters, cross-validation and validation scores." },
      { property: "og:title", content: "TrafficIQ ML Models" },
      { property: "og:description", content: "Model training results and hyperparameters." },
    ],
  }),
  component: Models,
});

function Models() {
  return (
    <div>
      <PageHeader
        eyebrow="Model Registry"
        title="ML Model Training"
        description="Three candidate models trained on 48,204 hourly observations with 5-fold cross-validation. XGBoost selected as production model."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {modelCards.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <GlassCard className={`relative overflow-hidden p-6 ${m.winner ? "ring-2 ring-primary/30" : ""}`}>
              {m.winner && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-primary/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-[0_10px_25px_-10px_rgba(109,40,217,0.6)]">
                  <Trophy className="h-3 w-3" /> Winner
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: m.color + "22", color: m.color }}>
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Model</p>
                  <h3 className="text-base font-semibold leading-tight">{m.name}</h3>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> {m.status}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-muted-foreground">Training</dt><dd className="mt-0.5 font-medium">{m.trainingTime}</dd></div>
                <div><dt className="text-muted-foreground">CV</dt><dd className="mt-0.5 font-medium">{m.cv}</dd></div>
                {Object.entries(m.hyperparams).map(([k, v]) => (
                  <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
                ))}
              </dl>

              <div className="mt-5">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Validation Score</span>
                  <span className="font-semibold">{m.validation.toFixed(2)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.validation * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: m.winner ? "linear-gradient(90deg, oklch(0.55 0.24 295), oklch(0.42 0.22 285))" : m.color }}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold">Training Pipeline</h3>
          <p className="mt-1 text-xs text-muted-foreground">Automated pipeline executed on 2024-06-30. All artefacts stored in the model registry.</p>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-8">
            {["Raw Data","Preprocess","Feature Eng","Split 80/20","Train","Cross-Validate","Compare","Deploy Best"].map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/60 bg-white/60 p-3 text-center"
              >
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{i + 1}</div>
                <p className="text-[11px] font-medium">{s}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
