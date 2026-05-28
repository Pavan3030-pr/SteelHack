import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Activity,
  AlertCircle,
  Zap,
  CheckCircle,
  Gauge,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Cpu,
} from "lucide-react";

const OverviewTab: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalInspections: 12847,
    activeAlerts: 3,
    aiAccuracy: 99.2,
    defectRate: 2.4,
  });

  // Simulated real-time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalInspections: prev.totalInspections + Math.floor(Math.random() * 2)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      title: "Throughput",
      value: metrics.totalInspections.toLocaleString(),
      label: "UNITS SCANNED",
      icon: Activity,
      trend: "+5.2%",
      trendUp: true,
      accent: "text-industrial-accent",
    },
    {
      title: "Active Risk",
      value: metrics.activeAlerts.toString(),
      label: "LIVE ANOMALIES",
      icon: AlertCircle,
      trend: "-12%",
      trendUp: false,
      accent: "text-red-500",
    },
    {
      title: "Model Perf",
      value: `${metrics.aiAccuracy}%`,
      label: "INFERENCE ACCURACY",
      icon: Target,
      trend: "+0.1%",
      trendUp: true,
      accent: "text-industrial-blue",
    },
    {
      title: "Defect Ratio",
      value: `${metrics.defectRate}%`,
      label: "SURFACE INTEGRITY",
      icon: Gauge,
      trend: "-0.4%",
      trendUp: false,
      accent: "text-industrial-success",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header with Glass Effect */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-industrial-steel/5 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-industrial-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-industrial-accent uppercase tracking-[0.3em]">Operational Live Stream</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-orbitron text-gradient-steel">
            FACTORY OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-4 text-right">
           <div className="hidden sm:block">
              <div className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-widest">System Latency</div>
              <div className="text-xl font-black font-orbitron text-industrial-steel/80">42ms</div>
           </div>
           <div className="h-10 w-px bg-industrial-steel/10" />
           <button className="px-6 py-2.5 bg-industrial-accent text-white text-[10px] font-bold font-orbitron uppercase tracking-widest rounded shadow-[0_0_20px_rgba(255,122,0,0.2)] hover:scale-105 transition-all">
              Generate Report
           </button>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="metallic-surface p-6 rounded-2xl group relative overflow-hidden"
          >
            <div className="scanline opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-2.5 rounded-xl bg-industrial-950 border border-industrial-steel/5 text-industrial-steel/40 group-hover:${card.accent} transition-colors duration-500`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${card.trendUp ? 'text-industrial-success' : 'text-red-500'}`}>
                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-industrial-steel/30 tracking-widest uppercase">{card.label}</div>
              <div className="text-3xl font-black font-orbitron text-industrial-steel group-hover:text-industrial-accent transition-colors duration-500">{card.value}</div>
            </div>

            {/* Micro Chart Mockup */}
            <div className="mt-6 h-1 w-full bg-industrial-steel/5 rounded-full overflow-hidden">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: card.trendUp ? "70%" : "30%" }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className={`h-full bg-gradient-to-r from-transparent to-industrial-steel/20`}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Defect Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 metallic-surface rounded-2xl p-8 overflow-hidden relative"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold font-orbitron text-industrial-steel tracking-tight">DEFECT ANALYSIS</h3>
              <p className="text-xs text-industrial-steel/30 font-bold uppercase tracking-widest mt-1">Multi-Task Model Classification</p>
            </div>
            <div className="flex gap-2">
              {['24h', '7d', '30d'].map((t) => (
                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded ${t === '24h' ? 'bg-industrial-accent text-white' : 'text-industrial-steel/40 hover:bg-industrial-steel/5'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Visual Bars */}
            <div className="space-y-6">
              {[
                { name: "Scratches", value: 34, color: "bg-industrial-accent" },
                { name: "Patches", value: 28, color: "bg-industrial-blue" },
                { name: "Crazing", value: 18, color: "bg-industrial-steel" },
                { name: "Pitted Surface", value: 12, color: "bg-industrial-success" },
                { name: "Inclusions", value: 8, color: "bg-industrial-warning" },
              ].map((defect, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-industrial-steel/40">{defect.name}</span>
                    <span className="text-industrial-steel">{defect.value}%</span>
                  </div>
                  <div className="h-2 bg-industrial-950 rounded-full overflow-hidden border border-industrial-steel/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${defect.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                      className={`h-full ${defect.color} opacity-80`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Abstract Graphic */}
            <div className="relative flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-industrial-accent/5 to-transparent rounded-full blur-3xl" />
               <div className="relative w-48 h-48 border-8 border-industrial-steel/5 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-black font-orbitron text-industrial-steel">98.4</div>
                    <div className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-widest">Confidence</div>
                  </div>
                  {/* Decorative orbital dots */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-industrial-accent rounded-full"
                      style={{
                        transform: `rotate(${i * 45}deg) translateY(-100px)`,
                        opacity: i % 2 === 0 ? 1 : 0.2
                      }}
                    />
                  ))}
               </div>
            </div>
          </div>
        </motion.div>

        {/* System Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 metallic-surface rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold font-orbitron text-industrial-steel tracking-tight mb-8">SYSTEM HEALTH</h3>

          <div className="space-y-8">
            {[
              { label: "AI Engine", value: 88, icon: Zap, status: "Optimal" },
              { label: "Edge Node 01", value: 42, icon: Cpu, status: "Active" },
              { label: "Data Pipeline", value: 94, icon: Shield, status: "Secure" },
            ].map((node, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-industrial-950 border border-industrial-steel/10 flex items-center justify-center text-industrial-steel/20 group-hover:text-industrial-accent transition-colors duration-500">
                  <node.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-industrial-steel/80">{node.label}</span>
                    <span className="text-industrial-accent">{node.status}</span>
                  </div>
                  <div className="h-1 bg-industrial-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${node.value}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 + 0.8 }}
                      className="h-full bg-industrial-steel/20"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-industrial-steel/5 mt-4">
               <div className="p-4 rounded-xl bg-industrial-accent/5 border border-industrial-accent/10">
                  <p className="text-[10px] text-industrial-accent font-bold uppercase tracking-widest mb-1">Predictive Maintenance</p>
                  <p className="text-xs text-industrial-steel/60 leading-relaxed font-light">Next scheduled calibration in 48 operational hours.</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Feed / Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="metallic-surface rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-industrial-steel/5 flex justify-between items-center">
          <h3 className="text-lg font-bold font-orbitron text-industrial-steel uppercase tracking-widest">Live Security Audit</h3>
          <span className="flex items-center gap-2 text-[10px] font-bold text-industrial-success uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-industrial-success rounded-full animate-pulse" /> Encrypted Connection
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-industrial-steel/5 text-[10px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Asset ID</th>
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4">Confidence</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-steel/5">
              {[
                { time: "14:32:01", id: "COIL-B293", action: "Surface Classification", conf: "99.8%", status: "CLEAR", color: "text-industrial-success" },
                { time: "14:31:55", id: "COIL-B292", action: "Anomaly Detected: Scratch", conf: "88.2%", status: "REJECT", color: "text-red-500" },
                { time: "14:31:42", id: "COIL-B291", action: "Surface Classification", conf: "99.2%", status: "CLEAR", color: "text-industrial-success" },
                { time: "14:31:28", id: "COIL-B290", action: "Surface Classification", conf: "98.9%", status: "CLEAR", color: "text-industrial-success" },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-industrial-steel/5 transition-colors">
                  <td className="px-8 py-4 text-xs font-mono text-industrial-steel/40">{row.time}</td>
                  <td className="px-8 py-4 text-xs font-bold text-industrial-steel">{row.id}</td>
                  <td className="px-8 py-4 text-xs text-industrial-steel/60">{row.action}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-industrial-950 rounded-full overflow-hidden">
                        <div className="h-full bg-industrial-accent/50" style={{ width: row.conf }} />
                      </div>
                      <span className="text-[10px] font-bold text-industrial-steel/40">{row.conf}</span>
                    </div>
                  </td>
                  <td className={`px-8 py-4 text-right text-[10px] font-black tracking-widest ${row.color}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;
