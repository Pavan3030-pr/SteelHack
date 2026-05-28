import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, ArrowRight, Zap, TrendingUp, Shield, Cpu } from "lucide-react";

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F1115]">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Industrial Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#1A1D24] to-[#0F1115]" />

        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 122, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 122, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FF7A00] rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Glow Effect Following Mouse */}
        <motion.div
          className="absolute w-96 h-96 bg-[#FF7A00] rounded-full blur-3xl opacity-5 pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF7A00]/30 bg-[#FF7A00]/5 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-[#FF7A00]" />
              <span className="text-sm font-mono text-[#FF7A00]">
                POWERED BY ADVANCED AI
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-8xl font-black font-orbitron mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, #BFC7D5 0%, #FF7A00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AUTONOMOUS STEEL
            <br />
            QUALITY INTELLIGENCE
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#BFC7D5]/70 mb-12 font-light tracking-wide max-w-3xl mx-auto"
          >
            Real-Time AI Detection • Predictive Maintenance • Industrial Analytics
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <button
              onClick={onLaunchDashboard}
              className="group relative px-8 py-4 bg-[#FF7A00] text-white font-bold rounded-lg font-orbitron uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#FF9A2E] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                Launch Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button className="group px-8 py-4 border-2 border-[#FF7A00]/50 text-[#FF7A00] font-bold rounded-lg font-orbitron uppercase tracking-wider hover:border-[#FF7A00] hover:bg-[#FF7A00]/5 transition-all duration-300">
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </span>
            </button>
          </motion.div>

          {/* KPI Counters */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {[
              { label: "Defects Detected", value: "98.7%", icon: Cpu },
              { label: "Uptime", value: "99.9%", icon: Shield },
              { label: "Processing Speed", value: "52ms", icon: Zap },
              { label: "Accuracy", value: "99.2%", icon: TrendingUp },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/50 backdrop-blur-sm hover:border-[#FF7A00]/50 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <Icon className="w-5 h-5 text-[#FF7A00] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#BFC7D5] font-orbitron">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-[#BFC7D5]/50 mt-1">{kpi.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {[
              {
                title: "Live Monitoring",
                desc: "Real-time steel surface inspection with AI-powered defect detection",
              },
              {
                title: "Predictive Analytics",
                desc: "Anticipate equipment failures before they occur with ML models",
              },
              {
                title: "Industrial Insights",
                desc: "Comprehensive dashboards for factory-wide operational intelligence",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl border border-[#FF7A00]/20 bg-[#1A1D24]/30 backdrop-blur-sm hover:border-[#FF7A00]/50 transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg font-bold text-[#BFC7D5] mb-2 font-orbitron">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#BFC7D5]/60">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 border-t border-[#FF7A00]/10 py-8 text-center text-sm text-[#BFC7D5]/50"
      >
        <p>© 2024 SteelHack Industrial AI Platform. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
