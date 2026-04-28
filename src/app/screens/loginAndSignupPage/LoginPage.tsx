import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [memberNick, setMemberNick] = useState("");       // backend: memberNick
  const [memberPassword, setMemberPassword] = useState(""); // backend: memberPassword
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login(memberNick, memberPassword); // Redux thunk chaqirish
      navigate("/");                            // Muvaffaqiyatli login => home
    } catch (err) {
      // error Redux state da saqlanadi, quyida ko'rsatiladi
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Gadjets
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-8 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Nick Input (backend memberNick ishlatadi) */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Username (Nick)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="your_username"
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>

          {/* Sign In Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 mt-6"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-border">
              Google
            </Button>
            <Button variant="outline" className="border-border">
              GitHub
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-accent hover:underline font-medium">
              Sign Up
            </a>
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-card rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Your login information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
