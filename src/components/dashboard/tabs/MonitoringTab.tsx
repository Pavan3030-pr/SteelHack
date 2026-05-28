import React from "react";
import { motion } from "motion/react";
import { Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const MonitoringTab: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold font-orbitron text-[#BFC7D5] mb-2">
          LIVE MONITORING
        </h1>
        <p className="text-[#BFC7D5]/60 font-mono">
          Real-time steel surface inspection and defect detection
        </p>
      </motion.div>

      {/* Live Streams */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[1, 2, 3, 4].map((stream) => (
          <motion.div
            key={stream}
            variants={itemVariants}
            className="rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm overflow-hidden"
          >
            {/* Video Placeholder */}
            <div className="aspect-video bg-[#0F1115] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent" />
              <Eye className="w-12 h-12 text-[#FF7A00]/30" />
              <motion.div
                className="absolute top-2 right-2 w-3 h-3 bg-[#FF4D4D] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Stream Info */}
            <div className="p-4 border-t border-[#FF7A00]/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold font-orbitron text-[#BFC7D5]">
                  Line {stream} - Hot Rolling Mill
                </h3>
                <span className="text-xs font-mono px-2 py-1 rounded bg-[#00D26A]/20 text-[#00D26A]">
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#BFC7D5]/50">FPS</p>
                  <p className="text-[#BFC7D5] font-bold">30</p>
                </div>
                <div>
                  <p className="text-[#BFC7D5]/50">Resolution</p>
                  <p className="text-[#BFC7D5] font-bold">1920x1080</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detection Statistics */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold font-orbitron text-[#BFC7D5] mb-6">
          TODAY'S DETECTION SUMMARY
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Scans", value: "2,847", icon: Eye, color: "text-[#BFC7D5]" },
            { label: "Defects Found", value: "68", icon: AlertTriangle, color: "text-[#FF4D4D]" },
            { label: "Quality Pass", value: "2,779", icon: CheckCircle, color: "text-[#00D26A]" },
            { label: "Avg Detection Time", value: "52ms", icon: Clock, color: "text-[#FF7A00]" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <p className="text-xs text-[#BFC7D5]/60 font-mono">
                    {stat.label}
                  </p>
                </div>
                <p className={`text-2xl font-bold font-orbitron ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Active Detections */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold font-orbitron text-[#BFC7D5] mb-6">
          ACTIVE DETECTIONS
        </h3>
        <div className="space-y-3">
          {[
            {
              id: "DET-2847",
              defect: "Scratches",
              confidence: 96.4,
              line: "Line 02",
              time: "Just now",
              severity: "HIGH",
            },
            {
              id: "DET-2846",
              defect: "Patches",
              confidence: 87.2,
              line: "Line 04",
              time: "2 min ago",
              severity: "MEDIUM",
            },
            {
              id: "DET-2845",
              defect: "Pitted Surface",
              confidence: 78.9,
              line: "Line 01",
              time: "5 min ago",
              severity: "LOW",
            },
          ].map((detection, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                detection.severity === "HIGH"
                  ? "bg-[#FF4D4D]/10 border-[#FF4D4D]/30"
                  : detection.severity === "MEDIUM"
                  ? "bg-[#FF7A00]/10 border-[#FF7A00]/30"
                  : "bg-[#BFC7D5]/5 border-[#BFC7D5]/20"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-bold text-[#FF7A00]">
                    {detection.id}
                  </span>
                  <span className="text-sm font-bold text-[#BFC7D5]">
                    {detection.defect}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#BFC7D5]/60">
                  <span>{detection.line}</span>
                  <span>{detection.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#BFC7D5]">
                  {detection.confidence}%
                </p>
                <p className={`text-xs font-mono font-bold ${
                  detection.severity === "HIGH"
                    ? "text-[#FF4D4D]"
                    : detection.severity === "MEDIUM"
                    ? "text-[#FF7A00]"
                    : "text-[#BFC7D5]"
                }`}>
                  {detection.severity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MonitoringTab;
