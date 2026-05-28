import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Play, ArrowRight, Zap, Shield, Cpu, Activity, Database, CheckCircle, BarChart3, ChevronDown } from "lucide-react";

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-x-hidden bg-industrial-950 font-sans selection:bg-industrial-accent selection:text-white">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Deep Industrial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1A1D24_0%,_#08090B_100%)]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 industrial-grid opacity-20" />

        {/* Top-down Lighting */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(191,199,213,0.05)_0%,transparent_50%)]" />

        {/* Dynamic Spotlight */}
        <motion.div
          className="absolute w-[800px] h-[800px] bg-industrial-accent/5 rounded-full blur-[120px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />

        {/* Floating Dust Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-industrial-steel/30 rounded-full"
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-industrial-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-orbitron font-black text-2xl tracking-tighter">
            STEEL<span className="text-industrial-accent">HACK</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-8"
        >
          {["System", "Analytics", "Security", "Company"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-industrial-steel/60 hover:text-industrial-accent transition-colors">
              {link}
            </a>
          ))}
          <button
            onClick={onLaunchDashboard}
            className="px-6 py-2.5 bg-industrial-accent text-white text-sm font-bold rounded-lg hover:shadow-[0_0_25px_rgba(255,122,0,0.4)] transition-all duration-300"
          >
            Launch System
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
        <motion.div
          style={{ opacity, scale, y }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-industrial-accent/30 bg-industrial-accent/5 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-industrial-accent uppercase">
              <Activity className="w-3 h-3" /> Industry 4.0 Standard
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black font-orbitron mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-gradient-steel">AUTONOMOUS STEEL</span>
            <br />
            <span className="text-gradient-accent">INTELLIGENCE</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-industrial-steel/50 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Deploy high-throughput edge AI for real-time defect detection and predictive severity analysis. Precision engineering meets deep learning.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <button
              onClick={onLaunchDashboard}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-xl font-orbitron text-sm uppercase tracking-widest overflow-hidden transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-industrial-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                Initialize System <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            <button className="px-10 py-5 border border-industrial-steel/20 hover:border-industrial-accent/50 text-industrial-steel font-bold rounded-xl font-orbitron text-sm uppercase tracking-widest transition-all duration-500 bg-industrial-steel/5 backdrop-blur-sm">
              View Architecture
            </button>
          </motion.div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-24 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-industrial-steel/30 uppercase">Scroll to Explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-industrial-accent to-transparent" />
        </motion.div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative z-10 px-4 pb-40">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative group">
            {/* Glow Effect behind preview */}
            <div className="absolute -inset-4 bg-industrial-accent/20 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Mockup Container */}
            <div className="relative metallic-surface rounded-2xl overflow-hidden border border-industrial-steel/10 shadow-2xl">
              {/* Browser Header */}
              <div className="h-10 bg-industrial-900 border-b border-industrial-steel/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
                <div className="mx-auto bg-industrial-800 px-4 py-1 rounded text-[10px] text-industrial-steel/30 font-mono">
                  system.steelhack.ai/dashboard/overview
                </div>
              </div>

              {/* Preview Content (Abstracted Dashboard) */}
              <div className="aspect-video bg-industrial-950 p-6 flex gap-6">
                {/* Sidebar Mock */}
                <div className="w-48 h-full flex flex-col gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-8 rounded-lg ${i === 0 ? "bg-industrial-accent/20" : "bg-industrial-steel/5"}`} />
                  ))}
                </div>

                {/* Main Content Mock */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 metallic-surface rounded-xl p-4 flex flex-col justify-between">
                         <div className="w-1/2 h-2 bg-industrial-steel/10 rounded" />
                         <div className="w-3/4 h-4 bg-industrial-accent/20 rounded" />
                      </div>
                    ))}
                  </div>

                  {/* Large Chart Area Mock */}
                  <div className="flex-1 metallic-surface rounded-xl relative overflow-hidden p-6">
                    <div className="scanline" />
                    <div className="flex items-end justify-between h-full gap-2">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-industrial-accent/10 rounded-t-sm"
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Info Cards around preview */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -left-12 top-1/4 hidden xl:block p-6 industrial-glass rounded-2xl border border-industrial-accent/20 shadow-xl"
            >
              <Activity className="w-8 h-8 text-industrial-accent mb-4" />
              <div className="text-2xl font-black font-orbitron mb-1">99.2%</div>
              <div className="text-xs text-industrial-steel/40 font-bold uppercase tracking-widest">Model Accuracy</div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -right-12 bottom-1/4 hidden xl:block p-6 industrial-glass rounded-2xl border border-industrial-blue/20 shadow-xl"
            >
              <Database className="w-8 h-8 text-industrial-blue mb-4" />
              <div className="text-2xl font-black font-orbitron mb-1">48ms</div>
              <div className="text-xs text-industrial-steel/40 font-bold uppercase tracking-widest">Inference Latency</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* KPI Section */}
      <section className="relative z-10 py-20 bg-industrial-900/50 border-y border-industrial-steel/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Surface Scanned", value: "12M+", sub: "Square Meters" },
              { label: "Defects Found", value: "840K", sub: "Categorized" },
              { label: "Uptime", value: "99.9%", sub: "Enterprise Grade" },
              { label: "Response Time", value: "<1s", sub: "Real-time Alerts" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-black font-orbitron mb-2 text-gradient-steel group-hover:text-industrial-accent transition-all duration-500">{stat.value}</div>
                <div className="text-sm font-bold text-industrial-steel/60 tracking-widest uppercase mb-1">{stat.label}</div>
                <div className="text-[10px] text-industrial-steel/20 uppercase font-mono tracking-tighter">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black font-orbitron text-gradient-steel mb-6">ENGINEERED FOR EXCELLENCE</h2>
              <p className="text-lg text-industrial-steel/40 font-light">
                Our platform integrates directly with industrial hardware, providing a seamless bridge between heavy machinery and advanced artificial intelligence.
              </p>
            </div>
            <button className="px-8 py-4 metallic-surface text-xs font-bold font-orbitron uppercase tracking-widest rounded-lg hover:border-industrial-accent/50 transition-all">
              Explore All Features
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Edge Resilience",
                desc: "Designed to operate in harsh industrial environments with 100% local processing for maximum security.",
              },
              {
                icon: BarChart3,
                title: "Deep Analytics",
                desc: "Advanced multi-task networks provide not just labels, but precise severity metrics for every defect.",
              },
              {
                icon: CheckCircle,
                title: "Zero-Latency",
                desc: "Optimized ONNX runtimes ensure real-time feedback for high-speed rolling mill operations.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 metallic-surface rounded-2xl border border-industrial-steel/5 hover:border-industrial-accent/20 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-xl bg-industrial-800 flex items-center justify-center mb-8 group-hover:bg-industrial-accent/10 transition-colors duration-500">
                  <f.icon className="w-8 h-8 text-industrial-steel/40 group-hover:text-industrial-accent transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold font-orbitron mb-4 text-industrial-steel group-hover:text-industrial-accent transition-colors duration-500">{f.title}</h3>
                <p className="text-sm text-industrial-steel/40 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-20 pb-10 border-t border-industrial-steel/5 px-4 bg-industrial-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-industrial-accent" />
            <span className="font-orbitron font-black text-xl tracking-tighter">
              STEEL<span className="text-industrial-accent">HACK</span>
            </span>
          </div>

          <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-industrial-steel/30">
            <a href="#" className="hover:text-industrial-accent transition-colors">Documentation</a>
            <a href="#" className="hover:text-industrial-accent transition-colors">Safety Protocols</a>
            <a href="#" className="hover:text-industrial-accent transition-colors">Enterprise</a>
          </div>

          <div className="text-[10px] font-mono text-industrial-steel/20 uppercase">
            © 2024 Industrial Intelligence Systems • v2.4.0-stable
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
