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
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

type AppPage = "landing" | "auth" | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  };

  const handleLaunchDashboard = () => {
    setCurrentPage("auth");
  };

  return (
    <div className="bg-[#0F1115] min-h-screen text-[#BFC7D5]">
      <AnimatePresence mode="wait">
        {currentPage === "landing" && !isAuthenticated && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onLaunchDashboard={handleLaunchDashboard}
            />
          </motion.div>
        )}

        {currentPage === "auth" && !isAuthenticated && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPage
              onAuthSuccess={handleAuthSuccess}
              onBackToLanding={() => setCurrentPage("landing")}
            />
          </motion.div>
        )}

        {currentPage === "dashboard" && isAuthenticated && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
