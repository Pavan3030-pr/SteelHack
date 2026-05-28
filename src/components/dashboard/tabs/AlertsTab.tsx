import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";

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
      id: "ALT-001",
      title: "High Defect Rate on Line 02",
      description: "Scratches detected at 96.4% confidence. Immediate inspection recommended.",
      severity: "CRITICAL",
      time: "2 min ago",
      status: "active",
      component: "Hot Rolling Mill - Line 02",
    },
    {
      id: "ALT-002",
      title: "Maintenance Overdue",
      description: "Scheduled maintenance for bearing assembly is 4 hours overdue.",
      severity: "HIGH",
      time: "15 min ago",
      status: "active",
      component: "Bearing Assembly - Stand 4",
    },
    {
      id: "ALT-003",
      title: "Temperature Anomaly",
      description: "Roll temperature exceeds safe threshold by 15°C.",
      severity: "HIGH",
      time: "32 min ago",
      status: "active",
      component: "Cooling System - Line 04",
    },
    {
      id: "ALT-004",
      title: "Pressure Drop Detected",
      description: "Hydraulic pressure in descaling system dropped 12%.",
      severity: "MEDIUM",
      time: "1 hour ago",
      status: "active",
      component: "Descaling System",
    },
    {
      id: "ALT-005",
      title: "AI Model Update",
      description: "New defect detection model deployed successfully.",
      severity: "LOW",
      time: "3 hours ago",
      status: "resolved",
      component: "AI Engine",
    },
  ]);

  const filteredAlerts = alerts.filter(
    (alert) => filterSeverity === "ALL" || alert.severity === filterSeverity
  );

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "bg-[#FF4D4D]/10", border: "border-[#FF4D4D]/50", text: "text-[#FF4D4D]" };
      case "HIGH":
        return { bg: "bg-[#FF7A00]/10", border: "border-[#FF7A00]/50", text: "text-[#FF7A00]" };
      case "MEDIUM":
        return { bg: "bg-[#FFB800]/10", border: "border-[#FFB800]/50", text: "text-[#FFB800]" };
      case "LOW":
        return { bg: "bg-[#BFC7D5]/5", border: "border-[#BFC7D5]/20", text: "text-[#BFC7D5]" };
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "CRITICAL":
      case "HIGH":
        return AlertTriangle;
      case "MEDIUM":
        return AlertCircle;
      case "LOW":
        return CheckCircle;
    }
  };

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
          SYSTEM ALERTS
        </h1>
        <p className="text-[#BFC7D5]/60 font-mono">
          Monitor and manage critical system notifications
        </p>
      </motion.div>

      {/* Alert Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: "Critical", value: "1", color: "text-[#FF4D4D]" },
          { label: "High", value: "2", color: "text-[#FF7A00]" },
          { label: "Medium", value: "1", color: "text-[#FFB800]" },
          { label: "Low", value: "1", color: "text-[#BFC7D5]" },
        ].map((summary, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="p-4 rounded-lg border border-[#FF7A00]/20 bg-[#1A1D24]/50"
          >
            <p className="text-xs text-[#BFC7D5]/60 font-mono mb-1">{summary.label}</p>
            <p className={`text-2xl font-bold font-orbitron ${summary.color}`}>
              {summary.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 flex-wrap"
      >
        <Filter className="w-5 h-5 text-[#BFC7D5]/50" />
        <div className="flex gap-2 flex-wrap">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity as AlertSeverity | "ALL")}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all ${
                filterSeverity === severity
                  ? "bg-[#FF7A00] text-white"
                  : "bg-[#1A1D24] text-[#BFC7D5]/70 border border-[#FF7A00]/20 hover:border-[#FF7A00]/50"
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredAlerts.map((alert, i) => {
          const Icon = getSeverityIcon(alert.severity);
          const colors = getSeverityColor(alert.severity);

          return (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className={`p-6 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all cursor-pointer ${
                alert.status === "resolved" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-mono font-bold ${colors.text}`}>
                          {alert.id}
                        </span>
                        <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
                          {alert.severity}
                        </span>
                        {alert.status === "resolved" && (
                          <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-[#00D26A]/20 text-[#00D26A]">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#BFC7D5]">
                        {alert.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#BFC7D5]/50 font-mono flex-shrink-0">
                      <Clock className="w-4 h-4" />
                      {alert.time}
                    </div>
                  </div>

                  <p className="text-sm text-[#BFC7D5]/70 mb-3">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#BFC7D5]/50 font-mono">
                      {alert.component}
                    </span>
                    {alert.status === "active" && (
                      <button className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-all ${
                        alert.severity === "CRITICAL" || alert.severity === "HIGH"
                          ? "bg-[#FF4D4D]/20 text-[#FF4D4D] hover:bg-[#FF4D4D]/30"
                          : "bg-[#FF7A00]/20 text-[#FF7A00] hover:bg-[#FF7A00]/30"
                      }`}>
                        ACKNOWLEDGE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <CheckCircle className="w-12 h-12 text-[#00D26A]/50 mx-auto mb-4" />
            <p className="text-[#BFC7D5]/60">No alerts matching the selected filter</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AlertsTab;
