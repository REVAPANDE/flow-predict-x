import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { reportsList } from "@/lib/mockApi";
import { GlassCard } from "@/components/common/GlassCard";
import { PageHeader } from "@/components/common/PageHeader";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · TrafficIQ" },
      { name: "description", content: "Downloadable reports for model performance, forecasts and executive summaries." },
      { property: "og:title", content: "TrafficIQ Reports" },
      { property: "og:description", content: "Enterprise reports for city command review." },
    ],
  }),
  component: Reports,
});

function Reports() {
  return (
    <div>
      <PageHeader
        eyebrow="Deliverables"
        title="Reports"
        description="Auto-generated deliverables for stakeholders. Regenerated on every model deploy."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportsList.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="flex h-full flex-col p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">{r.title}</h3>
                  <p className="text-[11px] text-muted-foreground">Updated {r.updated} · {r.size}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-xs text-muted-foreground">{r.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{r.format}</span>
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/70 px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[0_10px_25px_-10px_rgba(109,40,217,0.6)]">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
