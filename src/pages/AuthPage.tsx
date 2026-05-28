import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

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
    if (mode === "login" || mode === "signup") {
      onAuthSuccess();
    } else {
      setMode("login");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F1115]">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#1A1D24] to-[#0F1115]" />
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FF7A00] rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.3, 0],
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
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-[#BFC7D5]/60 hover:text-[#FF7A00] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-mono">Back to Home</span>
          </motion.button>

          {/* Glass Card */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-2xl border border-[#FF7A00]/20 bg-[#1A1D24]/60 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-3xl font-bold font-orbitron text-[#BFC7D5] mb-2">
                {mode === "login"
                  ? "Access Dashboard"
                  : mode === "signup"
                  ? "Create Account"
                  : "Reset Password"}
              </h2>
              <p className="text-sm text-[#BFC7D5]/50">
                {mode === "login"
                  ? "Enter your credentials to continue"
                  : mode === "signup"
                  ? "Join the industrial AI revolution"
                  : "Enter your email to reset password"}
              </p>
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Name Field (Signup only) */}
                {mode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-mono text-[#BFC7D5]/70 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]/50" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/20 text-[#BFC7D5] placeholder:text-[#BFC7D5]/30 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-[#BFC7D5]/70 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/20 text-[#BFC7D5] placeholder:text-[#BFC7D5]/30 focus:outline-none focus:border-[#FF7A00] transition-colors"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                {mode !== "forgot" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-mono text-[#BFC7D5]/70 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]/50" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/20 text-[#BFC7D5] placeholder:text-[#BFC7D5]/30 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-[#BFC7D5]/50 hover:text-[#FF7A00] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Confirm Password Field (Signup only) */}
                {mode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-mono text-[#BFC7D5]/70 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-[#FF7A00]/50" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0F1115]/50 border border-[#FF7A00]/20 text-[#BFC7D5] placeholder:text-[#BFC7D5]/30 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  variants={itemVariants}
                  type="submit"
                  className="w-full mt-6 py-3 bg-[#FF7A00] text-white font-bold rounded-lg font-orbitron uppercase tracking-wider hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {mode === "login"
                      ? "Sign In"
                      : mode === "signup"
                      ? "Create Account"
                      : "Send Reset Link"}
                  </span>
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Links */}
            <motion.div
              variants={itemVariants}
              className="mt-6 text-center space-y-3 text-sm"
            >
              {mode === "login" && (
                <>
                  <button
                    onClick={() => setMode("forgot")}
                    className="block w-full text-[#BFC7D5]/60 hover:text-[#FF7A00] transition-colors"
                  >
                    Forgot password?
                  </button>
                  <div className="text-[#BFC7D5]/50">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-[#FF7A00] hover:underline font-bold"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}

              {mode === "signup" && (
                <div className="text-[#BFC7D5]/50">
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-[#FF7A00] hover:underline font-bold"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {mode === "forgot" && (
                <button
                  onClick={() => setMode("login")}
                  className="block w-full text-[#BFC7D5]/60 hover:text-[#FF7A00] transition-colors"
                >
                  Back to login
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-xs text-[#BFC7D5]/40 font-mono"
          >
            This is a demonstration of the premium SteelHack platform UI
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
