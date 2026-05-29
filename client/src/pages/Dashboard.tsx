import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Home,
  Eye,
  Zap,
  TrendingUp,
  AlertCircle,
  Video,
  BarChart3,
  Leaf,
  User,
  ChevronDown,
  Search,
  Activity,
  Gauge,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import OverviewTab from "../components/dashboard/tabs/OverviewTab";
import MonitoringTab from "../components/dashboard/tabs/MonitoringTab";
import AlertsTab from "../components/dashboard/tabs/AlertsTab";

interface DashboardProps {
  onLogout: () => void;
}

type DashboardTab = "overview" | "monitoring" | "alerts" | "analytics" | "settings";

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [notifications, setNotifications] = useState(3);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "monitoring", label: "Live Monitoring", icon: Eye },
    { id: "detection", label: "AI Detection", icon: Zap },
    { id: "analytics", label: "Predictive Analytics", icon: TrendingUp },
    { id: "alerts", label: "Alerts", icon: AlertCircle },
    { id: "cameras", label: "Factory Cameras", icon: Video },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "sustainability", label: "Sustainability", icon: Leaf },
  ];

  return (
    <div className="flex h-screen bg-[#0F1115]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as DashboardTab)}
        items={sidebarItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          notifications={notifications}
          onLogout={onLogout}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewTab />
              </motion.div>
            )}

            {activeTab === "monitoring" && (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MonitoringTab />
              </motion.div>
            )}

            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AlertsTab />
              </motion.div>
            )}

            {(activeTab === "detection" ||
              activeTab === "analytics" ||
              activeTab === "cameras" ||
              activeTab === "reports" ||
              activeTab === "sustainability" ||
              activeTab === "settings") && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="p-12 rounded-2xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm text-center">
                    <Zap className="w-16 h-16 text-[#FF7A00]/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold font-orbitron text-[#BFC7D5] mb-2">
                      {sidebarItems.find((item) => item.id === activeTab)?.label}
                    </h2>
                    <p className="text-[#BFC7D5]/60">
                      This section is ready for your custom implementation
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
