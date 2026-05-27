import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, email: string) => void;
  apiUrl: string;
};

type Tab = "login" | "register" | "verify";

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, apiUrl }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setVerifyCode("");
    setError("");
    setSuccessMsg("");
    setDevCode(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg("Registration successful! Code sent to your email.");
        if (data.code) {
          setDevCode(data.code); // Store for developer testing helper
        }
        setActiveTab("verify");
      } else {
        setError(data.message || "Failed to register.");
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot reach registration server.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code: verifyCode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg("Email verified successfully! You can now log in.");
        setActiveTab("login");
        setVerifyCode("");
        setDevCode(null);
      } else {
        setError(data.message || "Verification failed.");
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot reach verification server.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        onLoginSuccess(data.username, data.email);
        resetForm();
        onClose();
      } else {
        setError(data.message || "Invalid credentials.");
        if (data.unverified) {
          setActiveTab("verify");
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Cannot reach authentication server.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Deep blur backdrop overlay */}
        <motion.div
          className="absolute inset-0 bg-[#06070a]/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            resetForm();
            onClose();
          }}
        />

        {/* Auth Box */}
        <motion.div
          className="relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#0e1017]/85 p-6 shadow-2xl backdrop-blur-xl font-sans"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#9b9ca4] hover:bg-white/5 hover:text-white cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Heading */}
          <div className="mb-6 mt-2 text-center">
            <h2 className="font-display text-2xl font-bold text-white tracking-wide">
              {activeTab === "login"
                ? "Welcome back"
                : activeTab === "register"
                ? "Create Account"
                : "Verify Email"}
            </h2>
            <p className="text-xs text-[#9b9ca4] mt-1 font-sans">
              {activeTab === "login"
                ? "Sign in to access your chat history"
                : activeTab === "register"
                ? "Start your personalized learning assistant experience"
                : `Enter verification code sent to your email`}
            </p>
          </div>

          {/* Tab buttons (Only for login / register) */}
          {activeTab !== "verify" && (
            <div className="mb-6 flex rounded-xl bg-black/35 p-1 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeTab === "login"
                    ? "bg-[#1c1d25] text-white shadow-sm"
                    : "text-[#9b9ca4] hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setError("");
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold tracking-wide transition cursor-pointer ${
                  activeTab === "register"
                    ? "bg-[#1c1d25] text-white shadow-sm"
                    : "text-[#9b9ca4] hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Feedbacks */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400">
              {error}
            </div>
          )}
          {successMsg && !error && (
            <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-xs font-medium text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <User className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-white/20 focus:bg-[#161820]/90 transition"
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <Lock className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-white/20 focus:bg-[#161820]/90 transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#5850ec] py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#6366f1] active:scale-98 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <User className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-white/20 focus:bg-[#161820]/90 transition"
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <Mail className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-white/20 focus:bg-[#161820]/90 transition"
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <Lock className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-white/20 focus:bg-[#161820]/90 transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#5850ec] py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-[#6366f1] active:scale-98 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
              </button>
            </form>
          )}

          {/* Email Verification Form */}
          {activeTab === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-[#9b9ca4]">
                  <ShieldCheck className="h-[18px] w-[18px]" />
                </span>
                <input
                  type="text"
                  placeholder="6-digit Verification Code"
                  value={verifyCode}
                  maxLength={6}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#161820]/40 py-3.5 pl-12 pr-4 text-sm text-white tracking-widest text-center font-bold outline-none focus:border-white/20 focus:bg-[#161820]/90 transition placeholder:font-normal placeholder:tracking-normal"
                  disabled={loading}
                />
              </div>

              {devCode && (
                <div className="mt-1 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10 text-[11px] text-center text-indigo-300 italic select-all">
                  Dev Helper: Your email code is <span className="font-bold underline">{devCode}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:bg-emerald-500 active:scale-98 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setError("");
                }}
                className="w-full text-center text-xs text-[#9b9ca4] hover:text-white transition mt-2 cursor-pointer"
              >
                Back to Registration
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
