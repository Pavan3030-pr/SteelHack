import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Activity,
  User,
  Shield,
} from "lucide-react";

interface TopNavbarProps {
  onMenuClick: () => void;
  notifications: number;
  onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  onMenuClick,
  notifications,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-16 border-b border-industrial-steel/5 bg-industrial-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-industrial-steel/40 hover:text-industrial-steel hover:bg-industrial-steel/5 rounded-lg transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Location/Breadcrumb */}
          <div className="hidden sm:flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-industrial-success animate-pulse" />
             <div className="text-[10px] font-bold text-industrial-steel/40 uppercase tracking-[0.2em]">Factory-ID: <span className="text-industrial-steel/80">TH-2026-B1</span></div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar - Stylized */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-lg bg-industrial-950/50 border border-industrial-steel/10 focus-within:border-industrial-accent/50 transition-all duration-300">
            <Search className="w-4 h-4 text-industrial-steel/20" />
            <input
              type="text"
              placeholder="Search assets..."
              className="bg-transparent text-xs text-industrial-steel placeholder:text-industrial-steel/20 focus:outline-none w-48 font-medium"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-industrial-steel/40 hover:text-industrial-steel hover:bg-industrial-steel/5 rounded-lg transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-industrial-accent rounded-full ring-2 ring-industrial-900" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 metallic-surface rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  <div className="p-4 border-b border-industrial-steel/5 flex justify-between items-center">
                    <h3 className="text-xs font-bold font-orbitron text-industrial-steel uppercase tracking-widest">Notifications</h3>
                    <span className="text-[10px] font-bold text-industrial-accent bg-industrial-accent/10 px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: "Anomaly Detected", desc: "Surface crazing exceeds threshold on Line 4", time: "12m ago", type: "error" },
                      { title: "Model Optimized", desc: "Edge inference reduced to 42ms", time: "1h ago", type: "success" },
                      { title: "Shift Start", desc: "Operations supervisor: Jane Smith", time: "2h ago", type: "info" },
                    ].map((n, i) => (
                      <div key={i} className="p-4 border-b border-industrial-steel/5 hover:bg-industrial-steel/5 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-industrial-steel group-hover:text-industrial-accent transition-colors">{n.title}</span>
                          <span className="text-[10px] text-industrial-steel/20 font-medium">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-industrial-steel/40 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-3 pr-1 py-1.5 rounded-full hover:bg-industrial-steel/5 transition-all group border border-transparent hover:border-industrial-steel/10"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-industrial-steel leading-none">J. DOE</div>
                <div className="text-[9px] font-bold text-industrial-steel/30 uppercase tracking-tighter">Ops Commander</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-industrial-800 border border-industrial-steel/10 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-industrial-accent/20 to-industrial-blue/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-industrial-steel/40" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 metallic-surface rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  <div className="p-4 bg-industrial-800/50 border-b border-industrial-steel/5">
                    <div className="text-xs font-bold text-industrial-steel">Johnathan Doe</div>
                    <div className="text-[10px] text-industrial-steel/30 font-mono">ID: SEC-8842-11</div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-industrial-steel/60 hover:text-industrial-steel hover:bg-industrial-steel/5 rounded-lg transition-all">
                      <Shield className="w-4 h-4" /> Security Logs
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-industrial-steel/60 hover:text-industrial-steel hover:bg-industrial-steel/5 rounded-lg transition-all">
                      <Settings className="w-4 h-4" /> System Preferences
                    </button>
                    <div className="my-1 border-t border-industrial-steel/5" />
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Terminate Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
