import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to buyer marketplace
      navigate("/buyer/marketplace");
    }, 500);
  };

  return (
    <section className="bg-vista-bg relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 md:px-6">
      {/* Decorative Background Elements */}
      <div className="bg-vista-accent/5 absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="bg-vista-primary/5 absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />

      <div className="z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/get-started")}
          className="text-vista-text/60 hover:text-vista-primary mb-8 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Role Selection</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <div className="mb-4 text-2xl font-bold">
            <span className="text-vista-primary">Vista</span>
            <span className="text-vista-accent">.Buyer</span>
          </div>
          <h1 className="text-vista-primary mb-2 text-3xl font-bold md:text-4xl">
            Welcome Back
          </h1>
          <p className="text-vista-text/70 text-sm">
            Demo Mode • Use any email and password to continue
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          onSubmit={handleLogin}
          className="shadow-soft border-vista-surface/50 space-y-5 rounded-3xl border bg-white p-8"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-vista-primary text-sm font-semibold">
              Email Address
            </label>
            <div className="border-vista-surface/30 hover:border-vista-surface focus-within:border-vista-accent bg-vista-bg/30 relative flex items-center rounded-xl border transition-colors">
              <Mail className="text-vista-text/40 ml-3 h-4 w-4" />
              <input
                type="email"
                placeholder="buyer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-vista-bg/30 text-vista-primary placeholder-vista-text/40 w-full px-3 py-2.5 outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-vista-primary text-sm font-semibold">
              Password
            </label>
            <div className="border-vista-surface/30 hover:border-vista-surface focus-within:border-vista-accent bg-vista-bg/30 relative flex items-center rounded-xl border transition-colors">
              <Lock className="text-vista-text/40 ml-3 h-4 w-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-vista-bg/30 text-vista-primary placeholder-vista-text/40 w-full px-3 py-2.5 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-vista-text/40 hover:text-vista-primary mr-3 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-vista-accent hover:text-vista-primary text-xs font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-vista-primary hover:bg-vista-primary/90 w-full rounded-xl py-3 font-semibold text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Sign Up Link */}
          <div className="text-vista-text/70 text-center text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-vista-accent hover:text-vista-primary font-semibold transition-colors"
            >
              Create one
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
