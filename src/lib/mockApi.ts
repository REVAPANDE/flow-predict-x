// Mock API service — all data lives here. Later replace with real FastAPI calls.

const wait = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// Deterministic PRNG so SSR and client produce identical mock data (no hydration mismatch).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240630);

export interface Kpi {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  tone?: "primary" | "success" | "info" | "warning";
}

export const overviewKpis: Kpi[] = [
  { label: "Prediction Accuracy", value: "95%", delta: "+1.4%", tone: "primary" },
  { label: "Best Model", value: "XGBoost", hint: "R² 0.95", tone: "primary" },
  { label: "Models Trained", value: 3, hint: "RF · XGB · SVR", tone: "info" },
  { label: "Historical Records", value: "48,204", hint: "Hourly", tone: "info" },
  { label: "Predictions Today", value: "12,583", delta: "+7.2%", tone: "success" },
  { label: "Avg Congestion", value: "61%", delta: "-3.1%", tone: "warning" },
  { label: "Avg Speed", value: "39 km/h", delta: "+2 km/h", tone: "success" },
  { label: "System Health", value: "Operational", hint: "All services up", tone: "success" },
];

export const trafficTrend = Array.from({ length: 24 }, (_, h) => {
  const base = 1800 + Math.sin((h / 24) * Math.PI * 2) * 900;
  const peaks = h === 8 || h === 18 ? 1400 : h === 9 || h === 17 ? 900 : 0;
  const actual = Math.max(400, Math.round(base + peaks + (Math.random() - 0.5) * 200));
  const predicted = Math.max(400, Math.round(actual + (Math.random() - 0.5) * 180));
  return { hour: String(h).padStart(2, "0") + ":00", actual, predicted };
});

export const weeklyTraffic = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
  day: d,
  volume: 32000 + i * 1400 + (i >= 5 ? -6000 : 0) + Math.round(Math.random() * 2000),
  congestion: 55 + (i >= 5 ? -12 : 6) + Math.round(Math.random() * 6),
}));

export const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  volume: 900000 + Math.round(Math.sin(i / 2) * 80000 + Math.random() * 40000),
}));

export const congestionHeatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const peak = (h >= 7 && h <= 10) || (h >= 16 && h <= 19);
    const weekend = d >= 5;
    const base = peak ? 75 : h < 6 ? 15 : 45;
    return Math.max(5, Math.min(98, base + (weekend ? -15 : 0) + Math.round(Math.random() * 15)));
  }),
);

export const liveStatus = [
  { corridor: "MG Road", volume: 4720, speed: 28, status: "Heavy" },
  { corridor: "Ring Road N", volume: 3910, speed: 41, status: "Moderate" },
  { corridor: "Airport Expy", volume: 2860, speed: 62, status: "Free" },
  { corridor: "Central Ave", volume: 4180, speed: 33, status: "Heavy" },
  { corridor: "Riverside Blvd", volume: 2210, speed: 55, status: "Free" },
  { corridor: "Tech Park Loop", volume: 3540, speed: 38, status: "Moderate" },
];

export const recentPredictions = [
  { time: "10:42", corridor: "MG Road", predicted: 4725, actual: 4680, conf: 0.96 },
  { time: "10:37", corridor: "Ring Road N", predicted: 3820, actual: 3910, conf: 0.94 },
  { time: "10:32", corridor: "Central Ave", predicted: 4210, actual: 4180, conf: 0.97 },
  { time: "10:27", corridor: "Airport Expy", predicted: 2790, actual: 2860, conf: 0.92 },
  { time: "10:22", corridor: "Riverside Blvd", predicted: 2280, actual: 2210, conf: 0.93 },
];

export const datasetSummary = {
  samples: 48204,
  features: 15,
  granularity: "Hourly",
  target: "Traffic Volume",
  trainSplit: 80,
  testSplit: 20,
  missing: 0.4,
  timeRange: "2019-01-01 → 2024-06-30",
};

export const datasetRows = Array.from({ length: 20 }, (_, i) => ({
  id: 10000 + i,
  timestamp: `2024-06-${String(1 + (i % 30)).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:00`,
  hour: i % 24,
  dayOfWeek: i % 7,
  temp: +(22 + Math.random() * 12).toFixed(1),
  rainfall: +(Math.random() * 4).toFixed(2),
  cloud: Math.round(Math.random() * 100),
  holiday: i % 11 === 0 ? 1 : 0,
  volume: 1200 + Math.round(Math.random() * 3800),
}));

export const featureDistributions = [
  { bin: "0–500", count: 210 },
  { bin: "500–1k", count: 640 },
  { bin: "1k–2k", count: 1820 },
  { bin: "2k–3k", count: 3210 },
  { bin: "3k–4k", count: 2740 },
  { bin: "4k–5k", count: 1580 },
  { bin: "5k+", count: 720 },
];

export const correlationMatrix = [
  { f: "Volume",  Volume: 1.0,  Hour: 0.62, Temp:-0.12, Rain:-0.28, Holiday:-0.35, Lag1: 0.88 },
  { f: "Hour",    Volume: 0.62, Hour: 1.0,  Temp: 0.14, Rain: 0.02, Holiday:-0.06, Lag1: 0.55 },
  { f: "Temp",    Volume:-0.12, Hour: 0.14, Temp: 1.0,  Rain:-0.31, Holiday: 0.02, Lag1:-0.10 },
  { f: "Rain",    Volume:-0.28, Hour: 0.02, Temp:-0.31, Rain: 1.0,  Holiday: 0.01, Lag1:-0.25 },
  { f: "Holiday", Volume:-0.35, Hour:-0.06, Temp: 0.02, Rain: 0.01, Holiday: 1.0,  Lag1:-0.30 },
  { f: "Lag1",    Volume: 0.88, Hour: 0.55, Temp:-0.10, Rain:-0.25, Holiday:-0.30, Lag1: 1.0  },
];

export const engineeredFeatures = [
  { name: "Hour", type: "Temporal", importance: 0.32, reason: "Encodes daily rush cycles — peaks at 8AM and 6PM dominate volume." },
  { name: "Day of Week", type: "Temporal", importance: 0.05, reason: "Weekday vs weekend separates commuter flows from leisure traffic." },
  { name: "Holiday", type: "Calendar", importance: 0.10, reason: "Public holidays remove commuter load and shift peaks." },
  { name: "Temperature", type: "Weather", importance: 0.14, reason: "Extreme temps depress non-essential trips, lifting predictability." },
  { name: "Rainfall", type: "Weather", importance: 0.08, reason: "Heavy rain slows speeds and raises congestion at equal volume." },
  { name: "Cloud Cover", type: "Weather", importance: 0.06, reason: "Weak signal for rain events and dawn/dusk visibility drops." },
  { name: "Lag_1", type: "Lag", importance: 0.12, reason: "Traffic is strongly autocorrelated at t−1 hour." },
  { name: "Lag_3", type: "Lag", importance: 0.08, reason: "Captures the tail of the previous rush window." },
  { name: "Lag_6", type: "Lag", importance: 0.05, reason: "Half-day lag helps morning ↔ evening symmetry." },
  { name: "Rolling Mean (6h)", type: "Rolling", importance: 0.07, reason: "Smooths local noise into a stable trend baseline." },
  { name: "Rolling Std (6h)", type: "Rolling", importance: 0.04, reason: "Measures recent volatility — high std often precedes congestion." },
  { name: "Traffic Volume", type: "Target", importance: 1.0, reason: "The variable we forecast — used only as ground truth in training." },
  { name: "Peak Hour", type: "Derived", importance: 0.09, reason: "Binary flag for rush windows — strong non-linear cue for trees." },
  { name: "Weekend", type: "Derived", importance: 0.05, reason: "Binary flag encoding structural demand differences." },
  { name: "Weather Index", type: "Derived", importance: 0.03, reason: "Composite score blending temp, rain and cloud into one axis." },
];

export type ModelName = "Random Forest" | "XGBoost" | "SVR";
export interface ModelCard {
  name: string;
  status: "Completed";
  trainingTime: string;
  hyperparams: Record<string, string | number>;
  cv: string;
  validation: number;
  winner?: boolean;
  color: string;
}

export const modelCards: ModelCard[] = [
  { name: "Random Forest", status: "Completed", trainingTime: "18 sec",
    hyperparams: { Trees: 300, MaxDepth: 18, MinSamplesLeaf: 4 },
    cv: "5-Fold", validation: 0.91, color: "oklch(0.7 0.18 155)" },
  { name: "XGBoost", status: "Completed", trainingTime: "24 sec",
    hyperparams: { BoostingRounds: 500, LearningRate: 0.05, MaxDepth: 8 },
    cv: "5-Fold", validation: 0.95, winner: true, color: "oklch(0.55 0.22 292)" },
  { name: "Support Vector Regression", status: "Completed", trainingTime: "41 sec",
    hyperparams: { Kernel: "RBF", C: 10, Epsilon: 0.1 },
    cv: "5-Fold", validation: 0.88, color: "oklch(0.7 0.18 200)" },
];

export const modelComparison = [
  { metric: "MAE", RandomForest: 3.8, XGBoost: 2.9, SVR: 4.5, better: "lower" },
  { metric: "RMSE", RandomForest: 5.2, XGBoost: 4.1, SVR: 6.0, better: "lower" },
  { metric: "R²", RandomForest: 0.91, XGBoost: 0.95, SVR: 0.88, better: "higher" },
  { metric: "Training Time (s)", RandomForest: 18, XGBoost: 24, SVR: 41, better: "lower" },
  { metric: "Inference (ms)", RandomForest: 18, XGBoost: 12, SVR: 27, better: "lower" },
  { metric: "Model Size (MB)", RandomForest: 42, XGBoost: 18, SVR: 65, better: "lower" },
  { metric: "Memory (MB)", RandomForest: 320, XGBoost: 210, SVR: 480, better: "lower" },
  { metric: "CPU (%)", RandomForest: 34, XGBoost: 22, SVR: 58, better: "lower" },
  { metric: "Interpretability", RandomForest: 8, XGBoost: 7, SVR: 4, better: "higher" },
];

export const radarData = [
  { axis: "Accuracy", RF: 91, XGB: 95, SVR: 88 },
  { axis: "Speed", RF: 82, XGB: 92, SVR: 65 },
  { axis: "Efficiency", RF: 78, XGB: 88, SVR: 55 },
  { axis: "Interpretability", RF: 80, XGB: 70, SVR: 40 },
  { axis: "Robustness", RF: 84, XGB: 93, SVR: 72 },
  { axis: "Scalability", RF: 76, XGB: 90, SVR: 58 },
];

export const featureImportance = [
  { feature: "Hour", weight: 0.32 },
  { feature: "Lag Features", weight: 0.25 },
  { feature: "Temperature", weight: 0.14 },
  { feature: "Holiday", weight: 0.10 },
  { feature: "Rainfall", weight: 0.08 },
  { feature: "Cloud Cover", weight: 0.06 },
  { feature: "Day of Week", weight: 0.05 },
];

export interface PredictionInput {
  hour: number; day: string; temperature: number; holiday: boolean;
  rainfall: number; cloudCover: number; roadType: string; horizon: number;
}
export interface PredictionResult {
  volume: number;
  congestion: "Low" | "Moderate" | "High" | "Severe";
  avgSpeed: number;
  delay: number;
  confidence: number;
  recommendation: string;
  band: { lower: number; upper: number };
  series: { t: string; value: number }[];
}

export function predictTraffic(input: PredictionInput): Promise<PredictionResult> {
  const rush = (input.hour >= 7 && input.hour <= 10) || (input.hour >= 16 && input.hour <= 19) ? 1.6 : 0.9;
  const holidayMult = input.holiday ? 0.6 : 1;
  const rainPenalty = 1 - Math.min(0.25, input.rainfall * 0.04);
  const arterial = input.roadType === "Arterial" ? 1.2 : input.roadType === "Highway" ? 1.4 : 1;
  const volume = Math.round(2600 * rush * holidayMult * rainPenalty * arterial + (Math.random() - 0.5) * 220);
  const congPct = Math.min(99, Math.round((volume / 5200) * 100));
  const congestion: PredictionResult["congestion"] =
    congPct > 85 ? "Severe" : congPct > 70 ? "High" : congPct > 45 ? "Moderate" : "Low";
  const avgSpeed = Math.max(14, Math.round(72 - congPct * 0.5));
  const delayMin = Math.max(1, Math.round(congPct * 0.18));
  const confidence = Math.round((0.92 + Math.random() * 0.06) * 100) / 100;
  const recs: Record<string, string> = {
    Severe: "Escalate to emergency plan: reroute via arterial bypass, extend green +22s, dispatch marshals.",
    High: "Increase green signal timing by 18 seconds and pre-activate adaptive corridor mode.",
    Moderate: "Hold current phase plan; monitor Lag_1 and re-evaluate in 15 minutes.",
    Low: "No intervention required. System operating within nominal envelope.",
  };
  const series = Array.from({ length: input.horizon }, (_, i) => ({
    t: `+${i + 1}h`,
    value: Math.round(volume * (1 + Math.sin(i / 2) * 0.08) + (Math.random() - 0.5) * 120),
  }));
  return wait({
    volume, congestion, avgSpeed, delay: delayMin, confidence,
    recommendation: recs[congestion],
    band: { lower: Math.round(volume * 0.93), upper: Math.round(volume * 1.07) },
    series,
  }, 700);
}

export const smartRecommendations = [
  { title: "Increase Green Signal Timing", corridor: "MG Road ∙ Junction 12", impact: "+12% throughput", severity: "high", eta: "Apply now" },
  { title: "Suggest Alternative Route", corridor: "Central Ave → Ring Road N", impact: "−7 min travel time", severity: "medium", eta: "Next 20 min" },
  { title: "Enable Adaptive Signal Timing", corridor: "Downtown Grid", impact: "+15% flow", severity: "high", eta: "Auto scheduled" },
  { title: "Emergency Vehicle Priority", corridor: "Airport Expy", impact: "54 km/h avg", severity: "info", eta: "Standby" },
  { title: "Heavy Congestion Alert", corridor: "Tech Park Loop", impact: "Expected in 30 min", severity: "warning", eta: "T−30" },
  { title: "Weather-adjusted Model", corridor: "City-wide", impact: "Auto switched to rain-mode", severity: "info", eta: "Live" },
];

export const reportsList = [
  { title: "Model Performance", desc: "Cross-model metrics, CV folds, residual analysis.", size: "2.4 MB", format: "PDF", updated: "10 min ago" },
  { title: "Traffic Forecast", desc: "24h and 7d rolling forecasts across 42 corridors.", size: "1.8 MB", format: "PDF", updated: "1 h ago" },
  { title: "Congestion Analysis", desc: "Heatmap of chronic vs incidental congestion.", size: "3.1 MB", format: "PDF", updated: "3 h ago" },
  { title: "Prediction History", desc: "90-day archive of predictions vs actuals.", size: "12.4 MB", format: "CSV", updated: "Today" },
  { title: "Weekly Summary", desc: "Executive summary for command center review.", size: "0.9 MB", format: "PDF", updated: "Monday" },
];

export const api = {
  getOverview: () => wait({ kpis: overviewKpis, trafficTrend, liveStatus, recentPredictions, weeklyTraffic, congestionHeatmap }),
  getAnalytics: () => wait({ trafficTrend, weeklyTraffic, monthlyTrend, featureImportance, congestionHeatmap }),
  getDataset: () => wait({ datasetSummary, datasetRows, featureDistributions, correlationMatrix }),
  getFeatures: () => wait(engineeredFeatures),
  getModels: () => wait(modelCards),
  getComparison: () => wait({ modelComparison, radarData }),
  getRecommendations: () => wait(smartRecommendations),
  getReports: () => wait(reportsList),
  predict: predictTraffic,
};
