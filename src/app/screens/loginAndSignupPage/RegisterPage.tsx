import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (memberPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError(null);
    try {
      await register(memberNick, memberPhone, memberPassword); // Redux thunk
      navigate("/");  // Muvaffaqiyatli signup => home
    } catch (err) {
      // error Redux state da saqlanadi
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us and start shopping amazing gadgets</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-8 space-y-4">
          {/* Error message */}
          {(error || localError) && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm px-4 py-2 rounded-lg">
              {localError || error}
            </div>
          )}

          {/* Nick Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Username (Nick)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="your_username"
                value={memberNick}
                onChange={(e) => setMemberNick(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                placeholder="+998901234567"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Password</label>
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

          {/* Confirm Password Input */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded mt-1" />
            <span className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="text-accent hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-accent hover:underline">Privacy Policy</a>
            </span>
          </label>

          {/* Sign Up Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 mt-6"
          >
            {loading ? "Creating account..." : "Create Account"}
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

          {/* Login Link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-accent hover:underline font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
