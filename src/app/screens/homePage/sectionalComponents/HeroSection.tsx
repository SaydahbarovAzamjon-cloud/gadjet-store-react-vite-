import { Button } from "../../../../components/ui/button";
import { useAuth } from "@/app/components/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/gadgets-hero-bg-fgkafZuYKB6N3sxJ2Y8tar.webp"
          alt="Premium Gadgets"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                ✨ Premium Gadgets Collection
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {isAuthenticated ? (
                  <>
                    Welcome back,
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {user?.memberNick}!
                    </span>
                  </>
                ) : (
                  <>
                    Discover the Latest
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Tech Gadgets...
                    </span>
                  </>
                )}
              </h1>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-md">
              Explore our curated collection of cutting-edge gadgets and smart devices. Find the
              perfect tech for your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-card"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
