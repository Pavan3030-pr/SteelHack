import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  Send,
  Check,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Clock,
  User,
  Calendar,
  Layers,
  Wrench,
  TrendingUp,
  Coins,
  RefreshCw,
  Database,
  BarChart2,
  Sliders,
  Award,
  Grid,
  Shield,
  Volume2,
  Flame,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Helper function to format currency concisely
function formatCurrency(num: number): string {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}k`;
  }
  return `$${num.toFixed(0)}`;
}

// Simulated automated counter for stats
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}
function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
}

export default function IndustrialReportGenerator() {
  // 1. CONFIGURATION STATES
  const [reportType, setReportType] = useState<
    "quality" | "defects" | "shift" | "machine" | "roi"
  >("quality");
  const [targetDate, setTargetDate] = useState("2026-05-28");
  const [targetLine, setTargetLine] = useState("Line A - Hot Strip Mill");
  const [supervisor, setSupervisor] = useState("OP-44 (Senior Metallurgy Advisor)");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStep, setCompileStep] = useState(0);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionLog, setTransmissionLog] = useState<string[]>([]);
  const [includeHeatmap, setIncludeHeatmap] = useState(true);
  const [signaturesRequired, setSignaturesRequired] = useState(true);
  const [documentTheme, setDocumentTheme] = useState<"light" | "dark">("light");

  // Selection interactive states inside preview template
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>({ x: 3, y: 2 });
  const [acknowledgedRecommends, setAcknowledgedRecommends] = useState<string[]>([]);

  // 2. STATIC/DYNAMIC MOCK DATA FOR THE ACTIVE SHEET
  // Custom interactive coordinate map counts (12 columns x 6 rows)
  const [heatmapMatrix, setHeatmapMatrix] = useState<number[][]>([
    [0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3, 0],
    [1, 0, 0, 8, 2, 0, 0, 1, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 5, 0, 0, 2, 0, 1],
    [0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0]
  ]);

  // Handle cell click in coordinate heatmap to simulate minor/major defects manual override
  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ x: c, y: r });
    setHeatmapMatrix((prev) => {
      const copy = prev.map((row) => [...row]);
      // Cycle weight between 0, 2, 5, 10, 0
      const currentVal = copy[r][c];
      let newVal = 0;
      if (currentVal === 0) newVal = 2;
      else if (currentVal === 2) newVal = 5;
      else if (currentVal === 5) newVal = 10;
      else newVal = 0;
      copy[r][c] = newVal;
      return copy;
    });
  };

  // Derived metrics from coordinate heatmap matrix for live feedback
  const heatmapTotalDefects = useMemo(() => {
    return heatmapMatrix.reduce((acc, row) => acc + row.reduce((sum, val) => sum + val, 0), 0);
  }, [heatmapMatrix]);

  // Simulated machine performance indexes
  const machineStates = [
    { name: "Stand 1 - Squeeze & Scaling", efficiency: 98.4, vibration: "1.2 mm/s", heat: "52°C", status: "NOMINAL" },
    { name: "Stand 2 - Roughing Slabs", efficiency: 97.2, vibration: "2.4 mm/s", heat: "64°C", status: "CALIBRATED" },
    { name: "Stand 3 - Friction Reduction Core", efficiency: 91.8, vibration: "4.8 mm/s", heat: "79°C", status: "STRESS LIMIT" },
    { name: "Stand 4 - High-Res Shearing Belt", efficiency: 99.1, vibration: "0.8 mm/s", heat: "44°C", status: "NOMINAL" },
    { name: "Stand 5 - Air Cooldown Reel", efficiency: 96.5, vibration: "1.9 mm/s", heat: "41°C", status: "NOMINAL" },
    { name: "Stand 6 - Sort Diverter Sorting Gate", efficiency: 94.2, vibration: "3.2 mm/s", heat: "55°C", status: "SLOW COIL" }
  ];

  // AI Recommendations array
  const recommendations = [
    {
      id: "REC-A1",
      topic: "Recalibrate Stand 3 Tension Screw Blocks",
      category: "Defect Mitigation",
      priority: "CRITICAL",
      reason: "High scratch weight clusters isolated around columns 4 and 7 on physical width alignment.",
      mitigationTime: "20 min downtime required"
    },
    {
      id: "REC-A2",
      topic: "Flush High-Pressure Air Descaler Nozzles",
      category: "Material Cleansing",
      priority: "HIGH",
      reason: "Residual oxide scales pitting raw billet surface before reduction entry pass.",
      mitigationTime: "Schedule next shift transition"
    },
    {
      id: "REC-A3",
      topic: "Solenoid Valve Lubrication & Cleanse",
      category: "Pneumatics/PLC",
      priority: "WARNING",
      reason: "Sort Gate Actuator signal response lags behind 120ms standard threshold parameter.",
      mitigationTime: "Unattended scheduled check"
    }
  ];

  // Compilation loader trigger simulating real compilation processes
  const compileCompilationSteps = [
    "Contacting Factory Core Edge database...",
    "Retrieving OpenCV raw billet contrast buffers...",
    "Computing ASTM D-31 severity weights...",
    "Aggregating looper strain telemetry logs...",
    "Synthesizing corporate Executive ROI summaries...",
    "Compiling print-ready vector layout structures..."
  ];

  const handleCompile = () => {
    setIsCompiling(true);
    setCompileStep(0);
    const interval = setInterval(() => {
      setCompileStep((prev) => {
        if (prev >= compileCompilationSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsCompiling(false), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  // CSV Exporter NATIVE FILE DOWNLOAD function
  const handleExportCSV = () => {
    const csvContent = 
`Metadata Area, Tata Jamshedpur Mill Report
Serial Number, QA-REP-2026-${reportType.toUpperCase()}-09
Supervisor, ${supervisor}
Date, ${targetDate}
Target Line, ${targetLine}
Report Style, ${reportType}

Defect Type, Count, Severity Index, Action Requirements
Scratches, 142, 4.2mm, Vertical roll stand strain load realignment
Pitted Surface, 31, 2.1mm, Descaler sprays oxides flushing
Slag Inclusions, 12, 11%, Immediate induction hearth hot cycle audit
Buckles, 4, 32.5mm, Looper motor synchronization

Cell Grid Coordinate Weights (12x6 grid)
${heatmapMatrix.map((row, i) => `Row ${i + 1}, ${row.join(", ")}`).join("\n")}

System Performance
Stand 1, 98.4%, 1.2 mm/s vibration, 52C temp
Stand 3, 91.8%, 4.8 mm/s vibration, 79C temp
Stand 6, 94.2%, 3.2 mm/s vibration, 55C temp`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tata_Steel_Quality_Report_${reportType}_${targetDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate Cloud Transmitting system
  const handleTransmitReport = () => {
    setIsTransmitting(true);
    setTransmissionLog(["Initializing secure socket transmission...", "Contacting secure gateway: https://sap-mes-hub.jamshedpur.tatasteel.internal..."]);
    
    setTimeout(() => {
      setTransmissionLog((p) => [...p, "Verifying operator credentials OP-44...", "Generating compliance certificate hash..."]);
    }, 800);

    setTimeout(() => {
      setTransmissionLog((p) => [...p, "Packaging XML payload & spatial coordinate bitmaps...", "Injecting ASTM validation compliance tag..."]);
    }, 1600);

    setTimeout(() => {
      setTransmissionLog((p) => [...p, "SUCCESS: Compliance report submitted directly to TATA MES Server.", "Transaction ID: TXN-TATA-80492-QA."]);
    }, 2400);

    setTimeout(() => {
      setIsTransmitting(false);
    }, 3205);
  };

  // Toggle acknowledge recommendation
  const toggleAcknowledgeRecommend = (id: string) => {
    setAcknowledgedRecommends((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // PDF Trigger layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="industrial_report_generation_module" className="space-y-6">
      
      {/* HEADER BAR AND BANNER */}
      <div className="bg-[#050814] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 w-full h-[3px]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-cyan-950/40 rounded text-cyan-400 border border-cyan-900/30">
                <FileText className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-100 font-mono">
                Automated Industrial Report Compiler & QA Seal Station
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed font-sans">
              Compile and generate enterprise-ready, print-grade PDF Quality Inspection Sheets, Shift Summaries, Machine Drift Warnings, and Executive Carbon-ROI Statements instantly from the edge camera arrays.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase hidden sm:inline">REPORT THEMING:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-900 flex items-center gap-1">
              <button
                onClick={() => setDocumentTheme("light")}
                className={`px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase rounded-lg transition ${
                  documentTheme === "light"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Carbon Solid (Light)
              </button>
              <button
                onClick={() => setDocumentTheme("dark")}
                className={`px-2.5 py-1 text-[9.5px] font-mono font-bold uppercase rounded-lg transition ${
                  documentTheme === "dark"
                    ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Cyber Digital (Dark)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL SPLIT VIEW: PARAMETERS ON LEFT, DIGITAL PRINT PREVIEW ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: COMPILING CONFIGURATOR (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between space-y-6 shadow-xl text-left">
          
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Sliders className="w-4 h-4 text-cyan-455 text-cyan-400" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-100 font-mono">
                Report Setup Matrix
              </h3>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              
              {/* REPORT COMPOSITION SELECTION */}
              <div className="space-y-1.5">
                <label className="text-slate-450 text-slate-550 text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Report Profile Target</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: "quality", label: "📄 PDF Quality Inspection Sheet" },
                    { id: "defects", label: "📊 Daily Fault Weight Summary" },
                    { id: "shift", label: "⏳ Shift Performance Analytics" },
                    { id: "machine", label: "⚙️ Machine Drift & Wear Audit" },
                    { id: "roi", label: "💰 Executive Savings & CO2 Sheet" }
                  ].map((p) => {
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setReportType(p.id as any);
                          handleCompile();
                        }}
                        className={`w-full py-2 px-3 text-left rounded-lg border transition text-[10px] font-bold ${
                          reportType === p.id
                            ? "bg-cyan-950/60 border-cyan-500 text-cyan-400"
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DATE SELECTION */}
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase text-[9px] font-bold">Target Inspection Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-bold select-none focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* PRODUCTION LINE ROUTE */}
              <div className="space-y-1">
                <label className="text-slate-505 text-slate-500 block uppercase text-[9px] font-bold">Hot Mill Production Route</label>
                <select
                  value={targetLine}
                  onChange={(e) => setTargetLine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Line A - Hot Strip Mill">Line A - Hot Strip Mill</option>
                  <option value="Line B - Cold Reduction Roll">Line B - Cold Reduction Roll</option>
                  <option value="Line C - Specialty Alloy Finishing">Line C - Specialty Alloy Finishing</option>
                </select>
              </div>

              {/* REGISTERED METALLURGIST */}
              <div className="space-y-1">
                <label className="text-slate-505 text-slate-500 block uppercase text-[9px] font-bold">Lead Signatory Supervisor</label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* SWITCH OPTION GATES */}
              <div className="pt-3 border-t border-slate-900 space-y-2 text-[10px]">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeHeatmap}
                    onChange={(e) => setIncludeHeatmap(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-400 focus:ring-0 accent-cyan-400 cursor-pointer"
                  />
                  <span>Render Physical Heatmap Snapshot</span>
                </label>

                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signaturesRequired}
                    onChange={(e) => setSignaturesRequired(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-cyan-400 focus:ring-0 accent-cyan-400 cursor-pointer"
                  />
                  <span>Require Double Metallurgy Seal Stamp</span>
                </label>
              </div>

            </div>
          </div>

          {/* ACTION BUTTON DECK */}
          <div className="space-y-3.5 border-t border-slate-900 pt-5">
            
            {/* 1.COMPILE REPORT ACTION */}
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                isCompiling
                  ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-wait"
                  : "bg-cyan-950/60 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? "animate-spin" : ""}`} />
              <span>{isCompiling ? "Compiling Report..." : "Recompile Live Telemetry"}</span>
            </button>

            {/* 2. TRANSMIT TO SECURE CLOUD GATEWAY */}
            <button
              onClick={handleTransmitReport}
              disabled={isTransmitting}
              className={`w-full py-2.5 rounded-lg border font-mono text-[10.5px] font-bold uppercase transition flex items-center justify-center gap-2 ${
                isTransmitting
                  ? "bg-slate-900 text-slate-650 border-slate-900 cursor-wait"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-600"
              }`}
            >
              <Send className={`w-3 h-3 ${isTransmitting ? "animate-bounce" : ""}`} />
              <span>TRANSMIT TO CLOUD ERP</span>
            </button>

            {/* Simulated Live compilation interface overlay */}
            <AnimatePresence>
              {isCompiling && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#050812] border border-cyan-950 p-3 rounded-lg font-mono text-[10px] text-cyan-400 space-y-2 overflow-hidden"
                >
                  <div className="flex justify-between items-center text-[9px] uppercase text-slate-500">
                    <span>COMPILER QUEUE STATUS</span>
                    <span>{( (compileStep + 1) / compileCompilationSteps.length * 100).toFixed(0)}%</span>
                  </div>
                  
                  {/* Progress sliding line */}
                  <div className="w-full h-[3px] bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-450 bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((compileStep + 1) / compileCompilationSteps.length) * 100}%` }}
                    />
                  </div>

                  {/* Status active code */}
                  <span className="block italic truncate text-slate-350 text-slate-300">
                    » {compileCompilationSteps[compileStep]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {transmissionLog.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#040810] border border-slate-900 p-3 rounded-xl font-mono text-[9.5px] text-slate-455 text-slate-400 space-y-1.5"
                >
                  <div className="flex justify-between items-center border-b border-slate-950 pb-1 uppercase font-bold text-[8.5px] text-slate-500">
                    <span>MES Grid Dispatch Stream</span>
                    <button onClick={() => setTransmissionLog([])} className="hover:text-slate-300">DISMISS</button>
                  </div>
                  <div className="space-y-1 max-h-[120px] overflow-y-auto font-mono text-[9px] leading-relaxed">
                    {transmissionLog.map((log, i) => (
                      <div key={i} className="flex gap-1.5">
                        <span className="text-emerald-400">√</span>
                        <span className="truncate">{log}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* RIGHT COLUMN: REFINEMENT A4 VISUAL DOCUMENT PREVIEW (8 Columns) */}
        <div id="mill-printable-area" className="lg:col-span-8 space-y-4">
          
          {/* Quick Header actions bar */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-900 p-3.5 rounded-2xl flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span>Report Class: <strong>QA-REP-2026-{reportType.toUpperCase()}-09</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {/* CSV raw download trigger */}
              <button
                onClick={handleExportCSV}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition flex items-center gap-2 cursor-pointer"
                title="Download raw report fields as .CSV document"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPORT CSV DATA</span>
              </button>

              {/* Physical Document browser-print module */}
              <button
                onClick={handlePrint}
                className="bg-slate-100 hover:bg-white text-slate-900 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition flex items-center gap-2 cursor-pointer"
                title="Assemble layout blocks and trigger system print dialog as fully styled PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-900" />
                <span>Print PDF Quality report</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT TEMPLATE ENGINE GRID CANVAS (Carbon Solid or Cyber Digital Theme) */}
          <div
            className={`rounded-2xl shadow-3xl p-8 relative overflow-hidden transition-all duration-300 border ${
              documentTheme === "light"
                ? "bg-slate-50 border-slate-300/80 text-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-100"
            }`}
          >
            
            {/* Watermark overlay */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[110px] font-black pointer-events-none select-none tracking-widest uppercase opacity-[0.015] font-mono rotate-[-30deg] z-0 ${
              documentTheme === "light" ? "text-black" : "text-white"
            }`}>
              TATA QUALITY APPROVED
            </div>

            {/* DOCUMENT INNER BODY */}
            <div className="space-y-8 relative z-10 text-left">
              
              {/* HEADER CAPTIONS BLOCK */}
              <div className="flex justify-between items-start border-b border-dashed pb-5 flex-wrap gap-4" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-600 rounded-sm inline-block" />
                    <h1 className="text-sm font-black uppercase font-mono tracking-wider">
                      TATA STEEL METALLURGICAL MILLS
                    </h1>
                  </div>
                  <p className={`text-[10px] font-mono uppercase tracking-wide font-semibold ${documentTheme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                    Jamshedpur Hot Reduction Division · Mill Line-A Core
                  </p>
                </div>

                <div className="text-right font-mono text-[9px] leading-tight space-y-0.5">
                  <div className="font-extrabold text-[10px]">QA LEVEL-5 COMPLIANT</div>
                  <div>Report Date: {targetDate}</div>
                  <div>Shift: A (Day Operations 06:00-14:00)</div>
                  <div className="font-bold text-cyan-500">REF: HSM-QA-CORE-09A</div>
                </div>
              </div>

              {/* BARCODE AND STATE DETAILS DECK */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b" style={{ borderColor: documentTheme === "light" ? "#f1f5f9" : "#111827" }}>
                
                <div className="space-y-1.5">
                  <span className={`text-[8.5px] uppercase font-mono block ${documentTheme === "light" ? "text-slate-500" : "text-slate-500"}`}>REPORT CONFIGURATION</span>
                  <strong className="text-xs font-mono font-black uppercase block">
                    {reportType === "quality" && "QA Inspection"}
                    {reportType === "defects" && "Fault Weight"}
                    {reportType === "shift" && "Shift Analytics"}
                    {reportType === "machine" && "Mill Calibration"}
                    {reportType === "roi" && "C-Suite ROI Summary"}
                  </strong>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[8.5px] uppercase font-mono block ${documentTheme === "light" ? "text-slate-500" : "text-slate-500"}`}>AUDIT STATUS</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <strong className="text-xs font-mono uppercase font-black text-emerald-500 block">RELEASE APPROVED</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[8.5px] uppercase font-mono block ${documentTheme === "light" ? "text-slate-500" : "text-slate-500"}`}>TARGET LINE STANDS</span>
                  <strong className="text-xs font-mono font-bold block truncate" title={targetLine}>
                    {targetLine}
                  </strong>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[8.5px] uppercase font-mono block ${documentTheme === "light" ? "text-slate-500" : "text-slate-500"}`}>SIGNATORY AUDITOR</span>
                  <strong className="text-xs font-mono font-bold block truncate" title={supervisor}>
                    {supervisor}
                  </strong>
                </div>

              </div>

              {/* REPORT CONTENT BODY BASED ON DIFFERENT CONFIGURATION TYPES */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={reportType}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  
                  {/* TYPE A: QUALITY INSPECTION SHEETS */}
                  {reportType === "quality" && (
                    <div className="space-y-5">
                      
                      {/* Summary card highlights */}
                      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] ${
                        documentTheme === "light" ? "bg-slate-100 border-slate-250 border-slate-200" : "bg-[#090d16] border-slate-900"
                      }`}>
                        <div className="space-y-1 text-left">
                          <span className={`text-[9.5px] uppercase tracking-wide block font-extrabold ${documentTheme === "light" ? "text-slate-500" : "text-slate-450"}`}>
                            QA Clearance Pass Factor
                          </span>
                          <strong className="text-xl font-black text-emerald-500 block">
                            99.2% Nominal Sheet Rating
                          </strong>
                        </div>

                        <div className="space-y-1 text-left sm:text-right">
                          <span className="text-[9px] uppercase block text-slate-500">Defect Density Rate:</span>
                          <strong className="text-xs block text-slate-400">
                            0.04 defects/meter continuous
                          </strong>
                        </div>
                      </div>

                      {/* Detailed inspection items log */}
                      <div className="space-y-2.5">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider font-mono">ASTM Dynamic Fault Log & Classifications</h3>
                        <div className="border border-slate-400/20 rounded-xl overflow-hidden font-mono text-[10.5px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className={`border-b ${documentTheme === "light" ? "bg-slate-200 border-slate-300" : "bg-slate-900 border-slate-800"}`}>
                                <th className="p-2.5">Coil ID</th>
                                <th className="p-2.5">Defect Type</th>
                                <th className="p-2.5 font-bold">Severity</th>
                                <th className="p-2.5">Location Strip</th>
                                <th className="p-2.5 text-right">Confidence Match</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { coil: "TC-904-A", defect: "Crazing Minor", severity: "12.4mm depth", loc: "Edge 4", conf: "94%" },
                                { coil: "TC-884-B", defect: "Surface Scratch (Fine)", severity: "7.8mm continuous", loc: "Edge 1", conf: "97%" },
                                { coil: "TC-501-C", defect: "Pitted Roll Surface", severity: "19.1mm depth", loc: "Main center", conf: "93%" },
                                { coil: "TC-102-X", defect: "None (OK Check)", severity: "0.0mm none", loc: "Center", conf: "99%" }
                              ].map((item, idx) => (
                                <tr key={idx} className="border-b last:border-0 border-slate-400/10">
                                  <td className="p-2.5 font-bold">{item.coil}</td>
                                  <td className="p-2.5">{item.defect}</td>
                                  <td className="p-2.5">{item.severity}</td>
                                  <td className="p-2.5">{item.loc}</td>
                                  <td className="p-2.5 text-right text-cyan-405 text-cyan-500 font-bold">{item.conf}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TYPE B: DAILY DEFECT SUMMARIES */}
                  {reportType === "defects" && (
                    <div className="space-y-5">
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Detected Scratches", value: 142, icon: Sliders, color: "text-amber-500" },
                          { label: "Pitted Surfaces", value: 31, icon: AlertTriangle, color: "text-red-500" },
                          { label: "Oxide Inclusions", value: 12, icon: Flame, color: "text-orange-500" },
                          { label: "Nominal Passes", value: 894, icon: CheckCircle, color: "text-emerald-500" }
                        ].map((stat, idx) => {
                          const IconComp = stat.icon;
                          return (
                            <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between h-[80px] font-mono text-[11px] ${
                              documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                            }`}>
                              <span className="text-[8.5px] text-slate-500 block uppercase font-bold leading-tight">{stat.label}</span>
                              <div className="flex items-end justify-between">
                                <strong className="text-xl font-extrabold font-mono tracking-tight text-slate-350 block">
                                  <AnimatedCounter value={stat.value} />
                                </strong>
                                <IconComp className={`w-4 h-4 ${stat.color}`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-1.5 text-left font-mono">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Hot Slab Ingestion Breakdown:</span>
                        <p className={`text-[11px] leading-relaxed font-sans ${documentTheme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                          Continuous rolling speeds of 14.2 m/s combined with minor mill friction anomalies accounted for high repeating line scratches. Stand 3 horizontal load values require compression adjustment.
                        </p>
                      </div>

                    </div>
                  )}

                  {/* TYPE C: SHIFT-WISE PERFORMANCE ANALYTICS */}
                  {reportType === "shift" && (
                    <div className="space-y-5">
                      <div className="border border-slate-400/20 rounded-xl overflow-hidden font-mono text-[10.5px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className={`border-b ${documentTheme === "light" ? "bg-slate-200 border-slate-300" : "bg-slate-900 border-slate-800"}`}>
                              <th className="p-2.5">Active Shift</th>
                              <th className="p-2.5">Team Leader</th>
                              <th className="p-2.5">Scantime Load</th>
                              <th className="p-2.5">Speed Median</th>
                              <th className="p-2.5 text-right font-bold">Defect Ratio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { shift: "Shift A (Day)", leader: "Supervisor OP-44", scan: "8 hrs complete", speed: "14.2 m/s", ratio: "0.04 defects/m" },
                              { shift: "Shift B (Swing)", leader: "Supervisor OP-12", scan: "8 hrs complete", speed: "14.1 m/s", ratio: "0.06 defects/m" },
                              { shift: "Shift C (Night)", leader: "Supervisor OP-08", scan: "8 hrs complete", speed: "12.8 m/s", ratio: "0.14 defects/m" }
                            ].map((s, idx) => (
                              <tr key={idx} className="border-b last:border-0 border-slate-400/10">
                                <td className="p-2.5 font-bold">{s.shift}</td>
                                <td className="p-2.5 text-slate-400">{s.leader}</td>
                                <td className="p-2.5">{s.scan}</td>
                                <td className="p-2.5">{s.speed}</td>
                                <td className="p-2.5 text-right text-amber-500 font-extrabold">{s.ratio}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TYPE D: MACHINE PERFORMANCE REPORTS */}
                  {reportType === "machine" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {machineStates.map((machine, idx) => {
                          const limitStress = machine.status === "STRESS LIMIT";
                          return (
                            <div key={idx} className={`p-3 rounded-xl border space-y-2 font-mono text-[10px] ${
                              documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                            }`}>
                              <div className="flex justify-between items-center">
                                <strong className="text-slate-300 font-black truncate max-w-[120px] font-mono leading-tight">{machine.name}</strong>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                  limitStress ? "bg-red-950 text-red-500 animate-pulse border border-red-900" : "bg-emerald-950 text-emerald-450 border border-emerald-900"
                                }`}>
                                  {machine.status}
                                </span>
                              </div>

                              <div className="text-[10px] space-y-1 border-t border-slate-800/10 pt-2 text-slate-400">
                                <div className="flex justify-between">
                                  <span>Efficiency Level:</span>
                                  <strong className={limitStress ? "text-red-400" : "text-emerald-500"}>{machine.efficiency}%</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Vibration Offset:</span>
                                  <strong>{machine.vibration}</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Thermodynamics:</span>
                                  <strong>{machine.heat}</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TYPE E: EXECUTIVE SAVINGS & ROI */}
                  {reportType === "roi" && (
                    <div className="space-y-5">
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                          documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                        }`}>
                          <span className="text-[8.5px] text-slate-500 block uppercase font-black leading-tight">Yearly Savings</span>
                          <strong className="text-lg font-mono text-emerald-500 block">
                            <AnimatedCounter value={984000} prefix="$" />
                          </strong>
                        </div>

                        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                          documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                        }`}>
                          <span className="text-[8.5px] text-slate-500 block uppercase font-black leading-tight">Scrap Mitigated</span>
                          <strong className="text-lg font-mono text-cyan-400 block">
                            <AnimatedCounter value={1380} suffix=" t" />
                          </strong>
                        </div>

                        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                          documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                        }`}>
                          <span className="text-[8.5px] text-slate-500 block uppercase font-black leading-tight">CO2 Offset Metric</span>
                          <strong className="text-lg font-mono text-emerald-500 block font-black">
                            <AnimatedCounter value={524.4} suffix=" t" decimals={1} />
                          </strong>
                        </div>

                        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                          documentTheme === "light" ? "bg-slate-100 border-slate-200" : "bg-[#090d16] border-slate-900"
                        }`}>
                          <span className="text-[8.5px] text-slate-500 block uppercase font-black leading-tight">Payback Target</span>
                          <strong className="text-lg font-mono text-purple-400 block font-black">
                            3.8 Months
                          </strong>
                        </div>
                      </div>

                      <p className={`text-[11px] font-sans leading-relaxed ${documentTheme === "light" ? "text-slate-650" : "text-slate-300"}`}>
                        🌿 Prevents scrap material from recycling back into high-pressure Electric Arc Furnaces (EAF). This directly saves approximately <strong>580 kWh of electricity power consumption</strong> per ton of steel manufactured.
                      </p>

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* REPORT GRAPHIC COORDINATES HEATMAP SNAPSHOT CONTAINER */}
              {includeHeatmap && (
                <div className="space-y-3.5 border-t border-dashed pt-6" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <Grid className="w-3.5 h-3.5 text-cyan-400" />
                      <strong>Dynamic Defect Coordinate Heatmap Snapshot (12 x 6 Slab Grid)</strong>
                    </div>

                    <span className="text-[8.5px] font-mono text-slate-500">
                      Weighted Fault Sum: <strong className="text-cyan-400 font-bold">{heatmapTotalDefects} micro units</strong>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* The Visual Grid Array */}
                    <div className="grid grid-cols-12 gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-900 shadow-inner">
                      {heatmapMatrix.map((row, rIdx) => {
                        return row.map((weight, cIdx) => {
                          const isSelected = selectedCell?.x === cIdx && selectedCell?.y === rIdx;
                          
                          let bgCol = "bg-[#02050c]/60";
                          if (weight > 0 && weight <= 2) bgCol = "bg-cyan-950/40 text-cyan-400 border border-cyan-900/40";
                          else if (weight > 2 && weight <= 5) bgCol = "bg-amber-950/40 text-amber-500 border border-amber-900/40";
                          else if (weight > 5) bgCol = "bg-red-950 text-red-500 border border-red-900 animate-pulse";

                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              onClick={() => handleCellClick(rIdx, cIdx)}
                              className={`h-7 rounded flex items-center justify-center font-mono text-[9px] cursor-pointer transition select-none ${bgCol} ${
                                isSelected ? "ring-2 ring-cyan-400 font-bold scale-[1.05]" : "hover:border-slate-700"
                              }`}
                              title={`Coordinate [Row ${rIdx + 1}, Col ${cIdx + 1}], Weight: ${weight}`}
                            >
                              {weight > 0 ? weight : ""}
                            </div>
                          );
                        });
                      })}
                    </div>

                    {/* Heatmap interactive key controller details */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-950 border border-slate-900 rounded" /> Nominal</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-950 border border-cyan-800 rounded" /> Minor Fault</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-950 border border-amber-800 rounded" /> Elevated Fault</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-950 border border-red-800 rounded" /> Critical Severity</span>
                      </div>

                      <div className="text-slate-400 font-sans italic">
                        {selectedCell ? (
                          <span>📌 Focus Active Coordinate: [Row {selectedCell.y + 1}, Col {selectedCell.x + 1}], Fault: {heatmapMatrix[selectedCell.y][selectedCell.x]}</span>
                        ) : (
                          <span>💡 Tap any grid cell above to cycle simulated fault severity weights instantly</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* MACHINE MAINTENANCE MITIGATION RECOMMENDATIONS */}
              <div className="space-y-3 border-t border-dashed pt-6" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <strong>Automated AI Preventive Maintenance Protocols</strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendations.map((rec) => {
                    const isCrit = rec.priority === "CRITICAL";
                    const isHigh = rec.priority === "HIGH";
                    const isAcked = acknowledgedRecommends.includes(rec.id);

                    const badgeCol = isCrit
                      ? "bg-red-950 text-red-400 border border-red-900"
                      : isHigh
                      ? "bg-amber-950 text-amber-500 border border-amber-900/30"
                      : "bg-slate-900 text-slate-400 border border-slate-800";

                    return (
                      <div
                        key={rec.id}
                        onClick={() => toggleAcknowledgeRecommend(rec.id)}
                        className={`p-3.5 rounded-xl border text-left font-mono text-[10px] space-y-2 cursor-pointer transition ${
                          isAcked 
                            ? "opacity-40 border-slate-900" 
                            : "border-slate-400/10 hover:border-slate-400/30"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] text-slate-500 font-bold">{rec.id}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase leading-none ${badgeCol}`}>
                            {rec.priority}
                          </span>
                        </div>

                        <strong className="block text-[11px] leading-tight text-slate-300 font-extrabold">{rec.topic}</strong>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans">{rec.reason}</p>
                        
                        <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-800/20 text-slate-400 leading-none">
                          <span className="italic">{rec.mitigationTime}</span>
                          <span className="text-cyan-400 font-bold">{isAcked ? "ACKED" : "TAP TO ACK"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EXECUTIVE-LEVEL DEEP METRIC SAVINGS OVERVIEW SUMMARY */}
              <div className="space-y-2 border-t border-dashed pt-6" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                <span className="text-[9px] uppercase font-mono block text-slate-500 font-bold tracking-wider">C-Suite Executive Valuation Statement</span>
                <p className={`text-[11px] font-sans leading-relaxed text-justify ${documentTheme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                  Deployment of our Continuous Computer Vision hot rolling diagnostic system prevents approximately <strong className="text-emerald-500 font-bold">1,380 metric tons</strong> of defect-riddled scrap steel from recycling. This directly offsets carbon footprint emissions by nearly <strong className="text-emerald-500 font-bold">524.4 metric tons of CO₂ equivalent</strong> while recapturing <strong className="text-emerald-500 font-extrabold">$984,000</strong> in raw plant material yield yearly, yielding an amortized payback period of <strong className="text-cyan-400 font-bold">3.8 Months</strong>.
                </p>
              </div>

              {/* SIGNATURE SECTION / METALLURGICAL SEAL STAMP */}
              {signaturesRequired && (
                <div className="pt-6 border-t border-dashed flex justify-between items-end flex-wrap gap-4 text-left font-mono" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                  <div className="space-y-4">
                    <span className="text-[8.5px] uppercase text-slate-500 block font-bold">PRIMARY MILL OPERATOR</span>
                    <div className="space-y-1">
                      <div className="h-6 flex items-center border-b border-slate-400/40 w-44">
                        <span className="italic text-cyan-600 text-xs font-bold font-sans">OP-44 Digital Seal</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block font-bold uppercase">{supervisor}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[8.5px] uppercase text-slate-500 block font-bold">CHIEF METALLURGIST APPROVAL</span>
                    <div className="space-y-1">
                      <div className="h-6 flex items-center border-b border-slate-400/40 w-44 relative">
                        <div className="absolute right-0 top-[-25px] w-14 h-14 border border-dashed border-emerald-600 rounded-full flex flex-col items-center justify-center text-[7px] text-emerald-600 font-bold leading-normal font-mono scale-[0.85] rotate-[15deg]">
                          <span>TATA QA</span>
                          <span className="font-extrabold">QA-PASS</span>
                          <span>LEVEL-5</span>
                        </div>
                        <span className="italic text-emerald-600 text-[10.5px] font-sans font-extrabold tracking-widest uppercase">DR. ARNAV GUPTA</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block font-bold uppercase">VP METALLURGY DIVISION</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCUMENT FOOTER */}
              <div className="text-center font-mono text-[8px] text-slate-500 pt-3 border-t" style={{ borderColor: documentTheme === "light" ? "#cbd5e1" : "#1e293b" }}>
                ISO-9001 QUALIFY CERTIFICATE NO: 1042-HSM-JSR. ALL PARAMETERS REGISTERED IN RAW PLC BLOCK STORAGE CORE COGNITIVE DECK.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
