import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight, Settings, User, LogOut, Zap, Shield, HelpCircle } from "lucide-react";
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (YouTube Style) */}
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 260 : 72,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col bg-industrial-900 border-r border-industrial-steel/5 h-screen sticky top-0 z-50 overflow-hidden"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-industrial-steel/5 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-industrial-accent rounded flex-shrink-0 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-orbitron font-black text-lg tracking-tighter truncate"
                >
                  STEEL<span className="text-industrial-accent">HACK</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full group relative flex items-center h-12 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-industrial-accent/10 text-industrial-accent"
                    : "text-industrial-steel/40 hover:bg-industrial-steel/5 hover:text-industrial-steel"
                }`}
              >
                <div className="w-[72px] flex-shrink-0 flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                </div>

                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-6 bg-industrial-accent rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-industrial-steel/5 space-y-1">
          <button className="w-full h-12 flex items-center rounded-lg text-industrial-steel/40 hover:bg-industrial-steel/5 hover:text-industrial-steel transition-all">
            <div className="w-[72px] flex-shrink-0 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            {isOpen && <span className="text-xs font-bold uppercase tracking-widest">Support</span>}
          </button>
          <button className="w-full h-12 flex items-center rounded-lg text-industrial-steel/40 hover:bg-industrial-steel/5 hover:text-industrial-steel transition-all">
            <div className="w-[72px] flex-shrink-0 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            {isOpen && <span className="text-xs font-bold uppercase tracking-widest">Settings</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 h-full w-[280px] bg-industrial-900 z-50 lg:hidden flex flex-col border-r border-industrial-steel/5 shadow-2xl"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-industrial-steel/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-industrial-accent rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-orbitron font-black text-lg tracking-tighter">
              STEEL<span className="text-industrial-accent">HACK</span>
            </span>
          </div>
          <button onClick={onToggle} className="p-2 text-industrial-steel/40 hover:text-industrial-steel">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-industrial-accent text-white shadow-[0_0_20px_rgba(255,122,0,0.3)]"
                    : "text-industrial-steel/50 hover:bg-industrial-steel/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-industrial-steel/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-industrial-800 border border-industrial-steel/10" />
          <div className="flex-1">
            <div className="text-sm font-bold text-industrial-steel">Admin User</div>
            <div className="text-[10px] text-industrial-steel/30 uppercase font-bold tracking-widest">Operations Manager</div>
          </div>
          <button className="p-2 text-industrial-steel/30 hover:text-industrial-error">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
