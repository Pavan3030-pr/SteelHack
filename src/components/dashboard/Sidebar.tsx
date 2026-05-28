import React from "react";
import { motion } from "motion/react";
import { Menu, X, ChevronRight, Settings, User, LogOut } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  items,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-[#1A1D24] border-r border-[#FF7A00]/10 overflow-hidden"
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-[#FF7A00]/10 flex items-center justify-between">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-orbitron font-bold text-[#FF7A00] text-lg"
            >
              STEEL<span className="text-[#BFC7D5]">HACK</span>
            </motion.div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-[#0F1115] rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-[#BFC7D5]" />
            ) : (
              <Menu className="w-5 h-5 text-[#BFC7D5]" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#FF7A00]/20 border border-[#FF7A00]/50 text-[#FF7A00]"
                    : "text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 hover:text-[#BFC7D5]"
                }`}
                whileHover={{ x: 5 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm font-mono font-bold"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#FF7A00]/10 p-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 transition-all">
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-mono font-bold"
              >
                Settings
              </motion.span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 transition-all">
            <User className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-mono font-bold"
              >
                Profile
              </motion.span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-[#1A1D24] border-r border-[#FF7A00]/10 z-50 lg:hidden flex flex-col overflow-hidden"
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-[#FF7A00]/10 flex items-center justify-between">
          <div className="font-orbitron font-bold text-[#FF7A00] text-lg">
            STEEL<span className="text-[#BFC7D5]">HACK</span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-[#0F1115] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#BFC7D5]" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#FF7A00]/20 border border-[#FF7A00]/50 text-[#FF7A00]"
                    : "text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 hover:text-[#BFC7D5]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-mono font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#FF7A00]/10 p-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-mono font-bold">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#BFC7D5]/70 hover:bg-[#0F1115]/50 transition-all">
            <User className="w-5 h-5" />
            <span className="text-sm font-mono font-bold">Profile</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
