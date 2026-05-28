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
    <div className="border-b border-[#FF7A00]/10 bg-[#1A1D24]/80 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[#0F1115] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-[#BFC7D5]" />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/10 hover:border-[#FF7A00]/30 transition-colors">
            <Search className="w-4 h-4 text-[#BFC7D5]/50" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#BFC7D5] placeholder:text-[#BFC7D5]/30 focus:outline-none w-40"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1115]/50 border border-[#00D26A]/20">
            <Activity className="w-4 h-4 text-[#00D26A]" />
            <span className="text-xs font-mono text-[#00D26A]">SYSTEM OK</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-[#0F1115] rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-[#BFC7D5]" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D4D] rounded-full"
                />
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 rounded-lg border border-[#FF7A00]/20 bg-[#1A1D24] shadow-xl z-50"
                >
                  <div className="p-4 border-b border-[#FF7A00]/10">
                    <h3 className="font-bold font-orbitron text-[#BFC7D5]">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        title: "High Defect Rate",
                        desc: "Scratches detected on Line 04",
                        time: "2 min ago",
                      },
                      {
                        title: "Maintenance Alert",
                        desc: "Scheduled maintenance in 4 hours",
                        time: "1 hour ago",
                      },
                      {
                        title: "System Update",
                        desc: "New AI model deployed successfully",
                        time: "3 hours ago",
                      },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className="p-4 border-b border-[#FF7A00]/5 hover:bg-[#0F1115]/50 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-bold text-[#BFC7D5]">
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#BFC7D5]/60 mt-1">
                          {notif.desc}
                        </p>
                        <p className="text-xs text-[#BFC7D5]/40 mt-2">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-[#0F1115] rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-[#BFC7D5]" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[#0F1115] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/20 border border-[#FF7A00]/50 flex items-center justify-center">
                <span className="text-xs font-bold text-[#FF7A00]">JD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#BFC7D5]/50" />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-[#FF7A00]/20 bg-[#1A1D24] shadow-xl z-50"
                >
                  <div className="p-4 border-b border-[#FF7A00]/10">
                    <p className="text-sm font-bold text-[#BFC7D5]">
                      John Doe
                    </p>
                    <p className="text-xs text-[#BFC7D5]/60">
                      john@company.com
                    </p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#FF4D4D] hover:bg-[#0F1115]/50 transition-colors flex items-center gap-2 border-t border-[#FF7A00]/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
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
