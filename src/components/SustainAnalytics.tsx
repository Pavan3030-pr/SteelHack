import React, { useState, useMemo } from "react";
import {
  Leaf,
  Globe,
  TrendingDown,
  Cpu,
  Trash2,
  Zap,
  Flame,
  Award,
  BookOpen,
  Download,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Sparkles,
  Layers,
  Thermometer,
  Trees,
  Droplets,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EsgMetric {
  title: string;
  value: string;
  unit: string;
  change: string;
  isPositive: boolean; // meaning good for environment
  color: string;
  icon: React.ComponentType<any>;
}

export default function SustainAnalytics() {
  // Interactive factory inputs to drive real-time carbon & energy mathematical projections
  const [productionTonnage, setProductionTonnage] = useState<number>(850000); // Metric tons / year
  const [aiEfficiencyRate, setAiEfficiencyRate] = useState<number>(94.5); // AI detection accuracy percentage
  const [gasFurnaceOptimization, setGasFurnaceOptimization] = useState<number>(12); // % thermal recycle improvement

  // Static constants for heavy blast furnace environmental coefficients (Tata Jamshedpur standard baseline variables)
  const CO2_COEFFICIENT_PER_TON_STEEL = 1.85; // average tons of CO2 per ton of raw steel produced in traditional blast furnaces
  const ENERGY_MWH_PER_TON_STEEL = 2.4; // Average MWh per ton
  const SCRAP_PERCENTAGE_BASELINE = 8.5; // 8.5% waste due to slag and defect rollbacks

  // Derived environmental metrics based on AI optimizations
  // Higher accuracy rate means fewer defects, leading to less scrap rework and lower thermal energy cycles
  const optimizedMetrics = useMemo(() => {
    // 1. Scrap reduction estimation
    const baselineScrapTons = productionTonnage * (SCRAP_PERCENTAGE_BASELINE / 100);
    // AI reduces scrap by making early cut decisions and reducing defect rollbacks
    const aiWasteReductionFactor = (aiEfficiencyRate - 50) / 100; // e.g. at 94.5% efficiency, we save ~44.5% of rework waste
    const tonsScrapSaved = Math.max(0, baselineScrapTons * aiWasteReductionFactor);
    const optimizedScrapTons = Math.max(0, baselineScrapTons - tonsScrapSaved);

    // 2. Carbon reduction calculation
    // Reworking a ton of scrap steel emits about 0.6 tons of CO2 compared to 1.85 tonnes for primary virgin steel.
    // However, thermal optimizations in furnaces adds additional carbon savings
    const carbonSavedFromScrapRework = tonsScrapSaved * 0.55; 
    const carbonSavedFromGasOptimization = productionTonnage * (gasFurnaceOptimization / 100) * 0.18;
    const totalCarbonSavedKg = (carbonSavedFromScrapRework + carbonSavedFromGasOptimization) * 1000; // converts to KG

    // 3. Energy Saving in Megawatt Hours
    const energySavedScrapMwh = tonsScrapSaved * 1.1; // 1.1 MWh saved per ton reduction of re-smelted slag
    const energySavedFumesRecycleMwh = productionTonnage * (gasFurnaceOptimization / 100) * 0.08;
    const totalEnergySavedMwh = energySavedScrapMwh + energySavedFumesRecycleMwh;

    // 4. Financial ESG Yield (Carbon offsets + Raw metal savings)
    const carbonTaxOffsetDollars = (totalCarbonSavedKg / 1000) * 45; // $45 per ton of carbon credit values
    const copperSteelRecoveryValue = tonsScrapSaved * 280; // $280 value average per ton recovered
    const totalFinancialEsgSaving = carbonTaxOffsetDollars + copperSteelRecoveryValue;

    // 5. Environmental Equivalencies (Tons of CO2 to Trees etc)
    const tonsCo2Saved = totalCarbonSavedKg / 1000;
    const treeSeedlingsGrown = tonsCo2Saved * 16.5; // ~16.5 tree seedlings grown for 10 years per ton of CO2
    const homesElectricityPowered = totalEnergySavedMwh / 10.4; // 10.4 MWh standard home annual usage in India/USA heavy sectors
    const waterGallonsConserved = tonsScrapSaved * 1250; // 1,250 Gallons of industrial cooling water saved per ton of scrap avoided

    // 6. Dynamic ESG Composite Score
    const baselineEsg = 62; // original mill baseline without AI
    const esgModifier = (aiEfficiencyRate - 60) * 0.4 + (gasFurnaceOptimization * 0.6);
    const esgScore = Math.min(98, Math.round(baselineEsg + esgModifier));

    return {
      baselineScrapTons,
      optimizedScrapTons,
      tonsScrapSaved,
      totalCarbonSavedKg,
      totalEnergySavedMwh,
      totalFinancialEsgSaving,
      treeSeedlingsGrown,
      homesElectricityPowered,
      waterGallonsConserved,
      esgScore,
      tonsCo2Saved
    };
  }, [productionTonnage, aiEfficiencyRate, gasFurnaceOptimization]);

  // Export sustainability report
  const exportSustainReportJSON = () => {
    const report = {
      facility: "Steel Defect AI ESG Auditor",
      timestamp: new Date().toISOString(),
      mill_parameters: {
        annual_production_tonnage: productionTonnage,
        ai_defect_isolation_efficiency: `${aiEfficiencyRate}%`,
        furnace_thermal_recycle: `${gasFurnaceOptimization}%`
      },
      sustainability_yield: {
        waste_scrap_avoided_tons: optimizedMetrics.tonsScrapSaved.toFixed(1),
        co2_reduction_tons: optimizedMetrics.tonsCo2Saved.toFixed(1),
        total_energy_saved_mwh: optimizedMetrics.totalEnergySavedMwh.toFixed(1),
        water_cooled_conserved_gallons: optimizedMetrics.waterGallonsConserved.toFixed(0),
        esg_score_achieved: optimizedMetrics.esgScore
      },
      equivalent_impact: {
        trees_planted_equivalent: Math.round(optimizedMetrics.treeSeedlingsGrown),
        annual_homes_powered: Math.round(optimizedMetrics.homesElectricityPowered)
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tata_Steel_ESG_Sustainability_Report_2026.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. GREEN HEADER BANNER WITH HIGH CONTRAST */}
      <div className="bg-[#020b08] border border-emerald-950 rounded-2xl p-6 relative overflow-hidden shadow-2xl text-left">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 w-full h-[3px]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-950/40 rounded text-emerald-400 border border-emerald-900/40">
                <Leaf className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-sm font-extrabold uppercase font-mono tracking-wider text-emerald-300">
                AI-Driven Industrial ESG & Sustainability Hub
              </h2>
            </div>
            <p className="text-[11.5px] text-slate-405 text-slate-400 max-w-3xl leading-relaxed">
              Dynamic steel ESG analytics console. Quantify how high-performance computer vision pipelines decrease billet rework cycles, compute carbon emission mitigations, evaluate natural gas heat recycle offsets, and measure equivalent environmental stewardship metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase hidden sm:inline">CARBON STRATEGY:</span>
            <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/60 font-mono text-[9.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              TATA ESG AUDIT PASS: LEVEL A+
            </span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC INPUT PARAMETER ADJUSTER & DYNAMIC ESG SCORE GAUGE (Grid layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* PARAMS SLIDERS (7 Columns) */}
        <div className="lg:col-span-7 bg-[#050b0a] border border-slate-900 rounded-xl p-5 space-y-6 text-left font-mono flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase font-extrabold text-emerald-400 border-b border-emerald-950/80 pb-3 flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span>1. Live Factory ESG Modifiers</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-2 font-sans leading-relaxed">
              Adjust your steel mill's operating metrics to model the progressive environmental yield of automated AI inspection gates.
            </p>
          </div>

          <div className="space-y-5">
            {/* Value 1: Annual Mill Production */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">ANNUAL PRODUCTION VOLUME</span>
                <span className="text-emerald-400 font-extrabold">{(productionTonnage / 1000).toLocaleString()}K tons / year</span>
              </div>
              <input
                type="range"
                min="200000"
                max="2500000"
                step="50000"
                value={productionTonnage}
                onChange={(e) => setProductionTonnage(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[7.5px] text-slate-500">
                <span>0.2M TONS</span>
                <span>1.35M TONS</span>
                <span>2.5M TONS</span>
              </div>
            </div>

            {/* Value 2: AI Isolation accuracy rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">AI COMPUTER VISION DEFECT ACCURACY RATE</span>
                <span className="text-cyan-400 font-extrabold">{aiEfficiencyRate}% Accuracy</span>
              </div>
              <input
                type="range"
                min="65"
                max="99.8"
                step="0.2"
                value={aiEfficiencyRate}
                onChange={(e) => setAiEfficiencyRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[7.5px] text-slate-500">
                <span>65% (Legacy CV)</span>
                <span>85% (Typical NN)</span>
                <span>99.8% (Target ResNet)</span>
              </div>
            </div>

            {/* Value 3: Natural Gas Furnace thermal optimization rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">RE-HEATING FURNACE THERMAL OPTIMIZATION</span>
                <span className="text-pink-400 font-extrabold">{gasFurnaceOptimization}% Heat Saved</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={gasFurnaceOptimization}
                onChange={(e) => setGasFurnaceOptimization(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[7.5px] text-slate-500">
                <span>2% (Min recycle)</span>
                <span>12% (Standard)</span>
                <span>25% (Full heat capture)</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-950/50 mt-4">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                <strong>ESG Prediction Model:</strong> Steel scrap rework requires immense energy to melting points of 1370°C. Defeating raw steel defects early blocks hot rolling of flawed sheets, ensuring high-yield continuous casting output loops.
              </p>
            </div>
          </div>
        </div>

        {/* ESG COMPOSITE SCORE GAUGE (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between text-left font-mono relative overflow-hidden">
          
          <div className="space-y-1">
            <span className="text-[8px] uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 font-extrabold px-2 py-0.5 rounded inline-block">
              ESG CERTIFICATE VALUE
            </span>
            <h3 className="text-xs font-bold text-slate-100 mt-1.5">Composite ESG Scoring Index</h3>
          </div>

          {/* Gorgeous SVG Gauge */}
          <div className="flex flex-col items-center justify-center py-6 relative">
            <svg className="w-44 h-44" viewBox="0 0 100 100">
              {/* Outer track circular indicator */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(16, 185, 129, 0.08)"
                strokeWidth="8"
              />
              {/* Semi arc representation of current ESG value */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#esg-green-gradient)"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * optimizedMetrics.esgScore) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-700 ease-out"
              />
              
              <defs>
                <linearGradient id="esg-green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Core absolute absolute values inside circular track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-3xl font-extrabold text-white tracking-tighter">
                {optimizedMetrics.esgScore}
              </span>
              <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider">
                ESG POINTS
              </span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-900 pt-4 text-[10px]">
            <div className="flex justify-between items-center text-slate-450 text-slate-400">
              <span>Facility Rating:</span>
              <strong className="text-emerald-400 font-bold">Class-1 Green Eco-Hub</strong>
            </div>
            <div className="flex justify-between items-center text-slate-450 text-slate-400">
              <span>Carbon Tax Retained:</span>
              <strong className="text-white font-bold">${Math.round(optimizedMetrics.tonsCo2Saved * 45).toLocaleString()} / yr</strong>
            </div>
          </div>

        </div>

      </div>

      {/* 3. CORE SUSTAINABILITY ESG METRIC CARDS GRID (4 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        
        {/* Card 1: Carbon Footprint Avoided */}
        <div className="bg-[#04090b] border border-slate-900 p-4 rounded-xl space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-950/40 border border-emerald-900/40 rounded text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
              CARBON MITIGATED
            </span>
          </div>

          <div className="space-y-0.5 font-mono">
            <h4 className="text-2xl font-black text-white">
              {optimizedMetrics.tonsCo2Saved.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </h4>
            <p className="text-[9.5px] text-slate-400 uppercase font-bold">Tons CO₂ / year</p>
          </div>

          <div className="text-[8.5px] text-slate-500 font-mono">
            Carbon reduction rate has dropped emissions by <strong className="text-emerald-400">18.4%</strong>.
          </div>
        </div>

        {/* Card 2: Scrap Material Recovered */}
        <div className="bg-[#05060f] border border-slate-900 p-4 rounded-xl space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-950/40 border border-purple-900/40 rounded text-purple-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold text-purple-400 uppercase">
              WASTE SALVAGED
            </span>
          </div>

          <div className="space-y-0.5 font-mono">
            <h4 className="text-2xl font-black text-white">
              {optimizedMetrics.tonsScrapSaved.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </h4>
            <p className="text-[9.5px] text-slate-400 uppercase font-bold">Tons Scrap Metal / year</p>
          </div>

          <div className="text-[8.5px] text-slate-500 font-mono">
            AI localized cropping avoids re-smelting rolled-in scale.
          </div>
        </div>

        {/* Card 3: Energy Savings */}
        <div className="bg-[#0b0805] border border-slate-900 p-4 rounded-xl space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-amber-950/40 border border-amber-900/40 rounded text-amber-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">
              ENERGY CONSERVED
            </span>
          </div>

          <div className="space-y-0.5 font-mono">
            <h4 className="text-2xl font-black text-white">
              {optimizedMetrics.totalEnergySavedMwh.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </h4>
            <p className="text-[9.5px] text-slate-400 uppercase font-bold">Megawatt-hours (MWh)</p>
          </div>

          <div className="text-[8.5px] text-slate-500 font-mono">
            Decreases high-voltage grid draw under severe peak thermal hours.
          </div>
        </div>

        {/* Card 4: Financial Yield */}
        <div className="bg-[#03090a] border border-slate-900 p-4 rounded-xl space-y-3 relative group">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-cyan-950/40 border border-cyan-900/40 rounded text-cyan-400">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
              ESG VALUE YIELD
            </span>
          </div>

          <div className="space-y-0.5 font-mono">
            <h4 className="text-2xl font-black text-white">
              ${optimizedMetrics.totalFinancialEsgSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h4>
            <p className="text-[9.5px] text-slate-400 uppercase font-bold">Annual Offset Savings</p>
          </div>

          <div className="text-[8.5px] text-slate-500 font-mono">
            Combines global carbon tax credits and metal yield profit offsets.
          </div>
        </div>

      </div>

      {/* 4. ESG GRAPH & EQUIVALENTS SECTION (Grid layout: 8 Cols & 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ESG PROJECTION TIMELINE (8 Columns) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-900 p-5 rounded-xl space-y-4 font-mono text-left">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div>
              <span className="text-[8px] uppercase font-bold text-slate-500 block">Carbon Emission Index Curves</span>
              <h3 className="text-xs font-bold text-slate-100">Annual Co2 Emission Outlook vs Targets (Tons x 1,000)</h3>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-500 inline-block" /> Baseline Out</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Optimized Out</span>
            </div>
          </div>

          {/* Dynamically calculated projection chart based on slider values and production metrics */}
          <div className="h-48 w-full bg-slate-950/60 rounded border border-slate-900/80 relative p-2 flex items-end justify-between select-none">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              {/* grid lines */}
              <line x1="0" y1="37" x2="400" y2="37" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="112" x2="400" y2="112" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />

              {/* Baseline curve (flat carbon slope) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                points={[0, 1, 2, 3, 4].map((yr) => {
                  const x = (yr / 4) * 380 + 10;
                  const value = (productionTonnage * CO2_COEFFICIENT_PER_TON_STEEL) / 1000; // Total baseline carbon
                  // scale to graph: max value represents 5,000 (tons x 1000)
                  const y = 140 - (value / 5000) * 120;
                  return `${x},${y}`;
                }).join(" ")}
              />

              {/* Optimized Curve (sloping downward as AI accuracy rate and improvements scale) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={[0, 1, 2, 3, 4].map((yr) => {
                  const x = (yr / 4) * 380 + 10;
                  const baseVal = (productionTonnage * CO2_COEFFICIENT_PER_TON_STEEL) / 1000;
                  // carbon reduction increases year over year as AI settles in
                  const yearFactor = 1 - (yr * 0.05 * (aiEfficiencyRate / 90));
                  const value = baseVal * yearFactor - (optimizedMetrics.tonsCo2Saved / 1000);
                  const y = 140 - (value / 5000) * 120;
                  return `${x},${y}`;
                }).join(" ")}
              />

              {/* Draw node indicators represent year projection points */}
              {[0, 1, 2, 3, 4].map((yr, idx) => {
                const x = (yr / 4) * 380 + 10;
                const baseVal = (productionTonnage * CO2_COEFFICIENT_PER_TON_STEEL) / 1000;
                const yearFactor = 1 - (yr * 0.05 * (aiEfficiencyRate / 90));
                const value = baseVal * yearFactor - (optimizedMetrics.tonsCo2Saved / 1000);
                const y = 140 - (value / 5000) * 120;

                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#022c22"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                );
              })}
            </svg>

            {/* Absolute Left Y labels */}
            <div className="absolute top-2 left-2 text-[8px] text-slate-500 uppercase flex flex-col space-y-[26px]">
              <span>Tons: 5,000K</span>
              <span>Tons: 2,500K</span>
              <span>Tons: 0K</span>
            </div>
          </div>

          <div className="flex justify-between text-[9px] text-slate-500">
            <span>Year 2026 (Launch)</span>
            <span>Year 2027</span>
            <span>Year 2028 (Audit)</span>
            <span>Year 2029</span>
            <span>Year 2030 (ESG Goal)</span>
          </div>
        </div>

        {/* EQUIVALENT ENVIRONMENTAL IMPACT SUMMARIES (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-4 font-mono text-left">
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Environmental Equivalency</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-sans mt-1 leading-relaxed">
              Real-world equivalence models tracking how AI efficiency shifts local conservation benchmarks.
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Tree Equivalency */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/35 rounded-lg shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-500 uppercase block font-bold leading-none">Carbon Sink Equivalent</span>
                <strong className="text-sm text-white block">
                  {Math.round(optimizedMetrics.treeSeedlingsGrown).toLocaleString()} seedlings
                </strong>
                <span className="text-[8.5px] text-slate-400 block font-sans leading-none">grown for 10 years in Indian reserves</span>
              </div>
            </div>

            {/* Water Cooling Converted */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-950/40 text-blue-400 border border-blue-900/35 rounded-lg shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-500 uppercase block font-bold leading-none">Industrial Cooling Saved</span>
                <strong className="text-sm text-white block">
                  {Math.round(optimizedMetrics.waterGallonsConserved).toLocaleString()} gallons
                </strong>
                <span className="text-[8.5px] text-slate-400 block font-sans leading-none">cooling flow recycled from local basins</span>
              </div>
            </div>

            {/* Electricity Homes Equivalent */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-950/40 text-amber-400 border border-amber-900/35 rounded-lg shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] text-slate-500 uppercase block font-bold leading-none">Grid Energy Offset</span>
                <strong className="text-sm text-white block">
                  {Math.round(optimizedMetrics.homesElectricityPowered).toLocaleString()} homes
                </strong>
                <span className="text-[8.5px] text-slate-400 block font-sans leading-none">annual electrical energy equivalent</span>
              </div>
            </div>
          </div>

          <button
            onClick={exportSustainReportJSON}
            className="w-full mt-2.5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export ESG Impact Report</span>
          </button>
        </div>

      </div>

    </div>
  );
}
