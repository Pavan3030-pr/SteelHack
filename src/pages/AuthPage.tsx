import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Zap, Shield, Key } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: () => void;
  onBackToLanding: () => void;
}

type AuthMode = "login" | "signup" | "forgot";

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-industrial-950 flex flex-col items-center justify-center p-4">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 industrial-grid opacity-10" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-industrial-accent/5 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Back Button */}
        <button
          onClick={onBackToLanding}
          className="mb-8 flex items-center gap-2 text-industrial-steel/40 hover:text-industrial-steel transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-orbitron">Return to Operations</span>
        </button>

        {/* Auth Card */}
        <div className="metallic-surface p-1 rounded-2xl">
          <div className="bg-industrial-900 rounded-[0.9rem] p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-12 h-12 bg-industrial-accent rounded-xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.3)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-orbitron text-gradient-steel mb-2">
                {mode === "login" ? "IDENTITY VERIFICATION" : "ACCOUNT INITIALIZATION"}
              </h2>
              <p className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">
                {mode === "login" ? "Enter protocol credentials" : "Set up secure operator access"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-industrial-steel/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-steel/20 group-focus-within:text-industrial-accent transition-colors" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="OPERATOR NAME"
                      className="w-full bg-industrial-950 border border-industrial-steel/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-industrial-accent/50 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-industrial-steel/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-steel/20 group-focus-within:text-industrial-accent transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@steelhack.ai"
                    className="w-full bg-industrial-950 border border-industrial-steel/10 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-industrial-accent/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-bold text-industrial-steel/40 uppercase tracking-widest">Access Key</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="text-[9px] font-bold text-industrial-accent/60 hover:text-industrial-accent uppercase tracking-widest">Lost Key?</button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-steel/20 group-focus-within:text-industrial-accent transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-industrial-950 border border-industrial-steel/10 rounded-xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-industrial-accent/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-industrial-steel/20 hover:text-industrial-steel transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-industrial-accent hover:bg-industrial-accent/90 text-white font-black font-orbitron py-4 rounded-xl shadow-[0_0_30px_rgba(255,122,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
              >
                {mode === "login" ? "Initialize Session" : "Deploy Account"}
                <Zap className="w-4 h-4 fill-white" />
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-industrial-steel/5">
              <p className="text-[10px] font-bold text-industrial-steel/30 uppercase tracking-[0.2em]">
                {mode === "login" ? "Don't have access?" : "Already have access?"}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="ml-2 text-industrial-accent hover:text-industrial-accent/80 transition-colors underline underline-offset-4"
                >
                  {mode === "login" ? "Request Entry" : "Verification"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-10 flex items-center justify-center gap-6 opacity-20">
           <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span className="text-[8px] font-bold uppercase tracking-widest font-mono">TLS 1.3 Active</span>
           </div>
           <div className="flex items-center gap-2">
              <Key className="w-3 h-3" />
              <span className="text-[8px] font-bold uppercase tracking-widest font-mono">256-Bit Encrypted</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
