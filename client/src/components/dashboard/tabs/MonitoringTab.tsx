import React from "react";
import { motion } from "motion/react";
import { Eye, AlertTriangle, CheckCircle, Clock, Maximize2, Settings, Zap, Shield } from "lucide-react";

const MonitoringTab: React.FC = () => {
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
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-1.5 bg-red-500/30 rounded-full" />
              <span className="w-1.5 h-1.5 bg-red-500/10 rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Live Feed Aggregator</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-orbitron text-gradient-steel">
            SYSTEM MONITORING
          </h1>
        </div>

        <div className="flex items-center gap-2 metallic-surface p-1 rounded-lg">
           <button className="px-4 py-1.5 text-[10px] font-bold font-orbitron uppercase tracking-widest bg-industrial-accent text-white rounded">Grid View</button>
           <button className="px-4 py-1.5 text-[10px] font-bold font-orbitron uppercase tracking-widest text-industrial-steel/40 hover:text-industrial-steel transition-colors">Single Stream</button>
        </div>
      </motion.div>

      {/* Live Streams Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[
          { id: "NODE-A1", label: "Line 04 - Primary Rolling", status: "STABLE", fps: 60, temp: "42°C" },
          { id: "NODE-A2", label: "Line 02 - Surface Inspection", status: "ANOMALY", fps: 58, temp: "45°C" },
          { id: "NODE-B1", label: "Line 01 - Secondary Finish", status: "STABLE", fps: 60, temp: "38°C" },
          { id: "NODE-B2", label: "Line 03 - Quality Assurance", status: "STABLE", fps: 60, temp: "40°C" },
        ].map((stream, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="metallic-surface rounded-2xl overflow-hidden group border border-industrial-steel/5 hover:border-industrial-accent/20 transition-all duration-500"
          >
            {/* Stream Header */}
            <div className="p-4 bg-industrial-900 border-b border-industrial-steel/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-industrial-success" />
                 <span className="text-[10px] font-bold text-industrial-steel/60 uppercase tracking-widest">{stream.label}</span>
              </div>
              <div className="flex gap-2">
                 <button className="p-1.5 text-industrial-steel/20 hover:text-industrial-steel transition-colors"><Settings className="w-3.5 h-3.5" /></button>
                 <button className="p-1.5 text-industrial-steel/20 hover:text-industrial-steel transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Video Feed Area */}
            <div className="aspect-video bg-industrial-950 relative flex items-center justify-center overflow-hidden">
               {/* Grid Overlay */}
               <div className="absolute inset-0 industrial-grid opacity-10 pointer-events-none" />

               {/* Scanning Line */}
               <div className="scanline" />

               {/* Central Icon / Abstract UI */}
               <div className="relative">
                  <Eye className="w-16 h-16 text-industrial-steel/5 group-hover:text-industrial-accent/10 transition-colors duration-1000" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-1 h-1 bg-industrial-accent rounded-full animate-ping" />
                  </div>
               </div>

               {/* On-screen Data Overlay */}
               <div className="absolute top-4 left-4 font-mono text-[9px] text-industrial-success/50 space-y-1">
                  <div>LATENCY: 12ms</div>
                  <div>PACKETS: OK</div>
                  <div>BITRATE: 8.2 Mbps</div>
               </div>

               <div className="absolute bottom-4 right-4 flex gap-4">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-industrial-steel/20 uppercase">Core Temp</div>
                    <div className="text-sm font-bold text-industrial-steel/60">{stream.temp}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-industrial-steel/20 uppercase">Capture</div>
                    <div className="text-sm font-bold text-industrial-steel/60">{stream.fps} FPS</div>
                  </div>
               </div>

               {/* Bounding Box Mock (only for the anomaly one) */}
               {stream.status === "ANOMALY" && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="absolute top-1/3 left-1/4 w-32 h-20 border-2 border-red-500 rounded-sm"
                 >
                    <span className="absolute -top-5 left-0 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase">Defect Detected: Scratch</span>
                 </motion.div>
               )}
            </div>

            {/* AI Analysis Footer */}
            <div className="p-6 bg-industrial-900/50 grid grid-cols-3 gap-6">
               <div className="space-y-1">
                  <div className="text-[9px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">Model Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-industrial-950 rounded-full overflow-hidden">
                       <div className="h-full bg-industrial-accent" style={{ width: '94%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-industrial-steel/80">94.2%</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-[9px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">Inference Depth</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-industrial-950 rounded-full overflow-hidden">
                       <div className="h-full bg-industrial-blue" style={{ width: '72%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-industrial-steel/80">8.2 Layer</span>
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-[9px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">Session Health</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-industrial-950 rounded-full overflow-hidden">
                       <div className="h-full bg-industrial-success" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-industrial-steel/80">OPTIMAL</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="metallic-surface rounded-2xl p-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-industrial-950 flex items-center justify-center border border-industrial-steel/5">
                 <Zap className="w-8 h-8 text-industrial-accent" />
              </div>
              <div>
                 <h3 className="text-xl font-bold font-orbitron text-industrial-steel tracking-tight">AI EDGE COMMAND</h3>
                 <p className="text-xs text-industrial-steel/30 font-bold uppercase tracking-widest mt-1">Manual Overrides & Configuration</p>
              </div>
           </div>

           <div className="flex flex-wrap gap-4">
              {[
                { label: "Contrast Boost", active: true },
                { label: "Bilateral Filter", active: false },
                { label: "CLAHE Enhancement", active: true },
                { label: "Edge Detection", active: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  className={`px-6 py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                    opt.active
                    ? 'bg-industrial-accent/10 border-industrial-accent text-industrial-accent'
                    : 'bg-industrial-950 border-industrial-steel/5 text-industrial-steel/30 hover:text-industrial-steel'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MonitoringTab;
