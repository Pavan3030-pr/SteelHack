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
} from "lucide-react";

const OverviewTab: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalInspections: 12847,
    activeAlerts: 3,
    aiAccuracy: 99.2,
    defectRate: 2.4,
    downtimeReduction: 34.5,
    monthlySavings: 245000,
  });

  const kpiCards = [
    {
      title: "Total Inspections",
      value: metrics.totalInspections.toLocaleString(),
      icon: Activity,
      color: "text-[#00D26A]",
      bgColor: "bg-[#00D26A]/10",
      borderColor: "border-[#00D26A]/30",
      trend: "+12.5%",
    },
    {
      title: "Active Alerts",
      value: metrics.activeAlerts,
      icon: AlertCircle,
      color: "text-[#FF4D4D]",
      bgColor: "bg-[#FF4D4D]/10",
      borderColor: "border-[#FF4D4D]/30",
      trend: "-8.2%",
    },
    {
      title: "AI Accuracy",
      value: `${metrics.aiAccuracy}%`,
      icon: Target,
      color: "text-[#FF7A00]",
      bgColor: "bg-[#FF7A00]/10",
      borderColor: "border-[#FF7A00]/30",
      trend: "+0.3%",
    },
    {
      title: "Defect Rate",
      value: `${metrics.defectRate}%`,
      icon: Gauge,
      color: "text-[#BFC7D5]",
      bgColor: "bg-[#BFC7D5]/5",
      borderColor: "border-[#BFC7D5]/20",
      trend: "-1.8%",
    },
  ];

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
          FACTORY INTELLIGENCE
        </h1>
        <p className="text-[#BFC7D5]/60 font-mono">
          Real-time operational metrics and AI-powered insights
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor} border ${card.borderColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className="text-xs font-bold font-mono text-[#00D26A]">
                  {card.trend}
                </span>
              </div>
              <p className="text-[#BFC7D5]/70 text-sm font-mono mb-1">
                {card.title}
              </p>
              <p className={`text-3xl font-bold font-orbitron ${card.color}`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Defect Distribution */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 p-6 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold font-orbitron text-[#BFC7D5] mb-6">
            DEFECT DISTRIBUTION
          </h3>
          <div className="space-y-4">
            {[
              { name: "Scratches", value: 34, color: "bg-[#FF7A00]" },
              { name: "Patches", value: 28, color: "bg-[#FF4D4D]" },
              { name: "Crazing", value: 18, color: "bg-[#BFC7D5]" },
              { name: "Pitted Surface", value: 12, color: "bg-[#00D26A]" },
              { name: "Inclusions", value: 8, color: "bg-[#00D26A]/50" },
            ].map((defect, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-[#BFC7D5]/70">
                    {defect.name}
                  </span>
                  <span className="text-sm font-bold text-[#BFC7D5]">
                    {defect.value}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0F1115]/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${defect.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${defect.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl border border-[#00D26A]/20 bg-[#1A1D24]/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold font-orbitron text-[#BFC7D5] mb-6">
            SYSTEM STATUS
          </h3>
          <div className="space-y-4">
            {[
              { label: "CPU Usage", value: 34, color: "text-[#FF7A00]" },
              { label: "GPU Usage", value: 28, color: "text-[#BFC7D5]" },
              { label: "Memory", value: 52, color: "text-[#00D26A]" },
              { label: "Network", value: 18, color: "text-[#00D26A]" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#BFC7D5]/70">
                    {stat.label}
                  </span>
                  <span className={`text-sm font-bold font-mono ${stat.color}`}>
                    {stat.value}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0F1115]/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${stat.color.replace("text", "bg")}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm"
      >
        <h3 className="text-lg font-bold font-orbitron text-[#BFC7D5] mb-6">
          RECENT ACTIVITY
        </h3>
        <div className="space-y-3">
          {[
            {
              time: "14:32",
              event: "Scratches detected on Coil #4521",
              severity: "HIGH",
            },
            {
              time: "14:18",
              event: "Maintenance completed on Line 04",
              severity: "INFO",
            },
            {
              time: "13:45",
              event: "AI model accuracy improved to 99.2%",
              severity: "SUCCESS",
            },
            {
              time: "13:22",
              event: "Predictive alert: Bearing wear detected",
              severity: "WARNING",
            },
          ].map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#0F1115]/50 transition-colors"
            >
              <span className="text-xs font-mono text-[#BFC7D5]/50 w-12">
                {activity.time}
              </span>
              <span className="text-sm text-[#BFC7D5]/70 flex-1">
                {activity.event}
              </span>
              <span
                className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                  activity.severity === "HIGH"
                    ? "bg-[#FF4D4D]/20 text-[#FF4D4D]"
                    : activity.severity === "WARNING"
                    ? "bg-[#FF7A00]/20 text-[#FF7A00]"
                    : activity.severity === "SUCCESS"
                    ? "bg-[#00D26A]/20 text-[#00D26A]"
                    : "bg-[#BFC7D5]/10 text-[#BFC7D5]"
                }`}
              >
                {activity.severity}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;
