import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Filter, ShieldAlert, Zap, Search, BellRing } from "lucide-react";

type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  time: string;
  status: "active" | "resolved";
  component: string;
}

const AlertsTab: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | "ALL">("ALL");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT-8842",
      title: "Anomalous Surface Pattern",
      description: "Neural network identified longitudinal scratches on COIL-B293 exceeding 5% surface area.",
      severity: "CRITICAL",
      time: "2m ago",
      status: "active",
      component: "Rolling Mill Line 02",
    },
    {
      id: "ALT-8841",
      title: "Vibration Threshold Exceeded",
      description: "Sensor node SN-42 reported high-frequency resonance on bearing housing.",
      severity: "HIGH",
      time: "14m ago",
      status: "active",
      component: "Primary Extruder",
    },
    {
      id: "ALT-8839",
      title: "Inference Latency Spike",
      description: "Edge node latency increased from 42ms to 124ms. Potential thermal throttling.",
      severity: "MEDIUM",
      time: "1h ago",
      status: "active",
      component: "AI Processing Node 01",
    },
    {
      id: "ALT-8838",
      title: "Model Retraining Success",
      description: "Version 4.2.1 successfully deployed to all active edge cameras.",
      severity: "LOW",
      time: "4h ago",
      status: "resolved",
      component: "Core AI Engine",
    },
  ]);

  const filteredAlerts = alerts.filter(
    (alert) => filterSeverity === "ALL" || alert.severity === filterSeverity
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-industrial-steel/5 pb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BellRing className="w-4 h-4 text-industrial-accent" />
            <span className="text-[10px] font-bold text-industrial-accent uppercase tracking-[0.3em]">Operational Security Audit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-orbitron text-gradient-steel">
            SYSTEM ALERTS
          </h1>
        </div>

        <div className="flex items-center gap-4">
           <div className="metallic-surface p-1 rounded-lg flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-industrial-steel/20" />
              <input type="text" placeholder="Filter IDs..." className="bg-transparent border-none text-xs font-medium text-industrial-steel focus:outline-none w-32" />
           </div>
        </div>
      </motion.div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Critical", value: "01", color: "text-red-500", bg: "bg-red-500/10" },
          { label: "High Risk", value: "01", color: "text-industrial-accent", bg: "bg-industrial-accent/10" },
          { label: "Warnings", value: "01", color: "text-industrial-blue", bg: "bg-industrial-blue/10" },
          { label: "Resolved", value: "12", color: "text-industrial-success", bg: "bg-industrial-success/10" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="metallic-surface p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 ${s.bg} rounded-bl-[4rem] flex items-center justify-center`}>
               <ShieldAlert className={`w-5 h-5 ${s.color} opacity-40 group-hover:scale-110 transition-transform duration-500`} />
            </div>
            <div className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-4xl font-black font-orbitron ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 p-1 metallic-surface w-fit rounded-xl">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s as AlertSeverity | "ALL")}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold font-orbitron uppercase tracking-widest transition-all ${
              filterSeverity === s
              ? 'bg-industrial-accent text-white shadow-lg'
              : 'text-industrial-steel/40 hover:text-industrial-steel hover:bg-industrial-steel/5'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`metallic-surface rounded-2xl p-6 group relative overflow-hidden ${alert.status === 'resolved' ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Visual Indicator */}
                <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center border transition-colors duration-500 ${
                  alert.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  alert.severity === 'HIGH' ? 'bg-industrial-accent/10 border-industrial-accent/20 text-industrial-accent' :
                  'bg-industrial-blue/10 border-industrial-blue/20 text-industrial-blue'
                }`}>
                  {alert.severity === 'CRITICAL' ? <ShieldAlert className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>

                <div className="flex-1 space-y-4">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black font-mono text-industrial-accent">{alert.id}</span>
                          <span className="w-1 h-1 bg-industrial-steel/20 rounded-full" />
                          <span className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-widest">{alert.component}</span>
                        </div>
                        <h3 className="text-xl font-bold font-orbitron text-industrial-steel group-hover:text-industrial-accent transition-colors">{alert.title}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-right">
                           <div className="text-[10px] font-bold text-industrial-steel/20 uppercase">Occurred</div>
                           <div className="text-xs font-bold text-industrial-steel/60 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {alert.time}</div>
                         </div>
                         <div className="h-8 w-px bg-industrial-steel/10" />
                         <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded border ${
                           alert.severity === 'CRITICAL' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                           'border-industrial-accent/20 text-industrial-accent bg-industrial-accent/5'
                         }`}>{alert.severity}</div>
                      </div>
                   </div>

                   <p className="text-sm text-industrial-steel/40 font-light leading-relaxed max-w-3xl">{alert.description}</p>

                   <div className="flex gap-3 pt-2">
                      <button className="px-6 py-2 bg-industrial-accent/10 hover:bg-industrial-accent text-industrial-accent hover:text-white text-[10px] font-bold font-orbitron uppercase tracking-widest rounded transition-all">Protocol Response</button>
                      <button className="px-6 py-2 border border-industrial-steel/10 hover:border-industrial-steel/30 text-industrial-steel/40 hover:text-industrial-steel text-[10px] font-bold font-orbitron uppercase tracking-widest rounded transition-all">View Analytics</button>
                   </div>
                </div>
              </div>

              {/* Abstract background graphics */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <Zap className="w-40 h-40" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsTab;
