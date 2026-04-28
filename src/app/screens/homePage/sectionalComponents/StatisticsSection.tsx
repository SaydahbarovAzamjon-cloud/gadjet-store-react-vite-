import { TrendingUp, Users, Zap, Award } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    number: "74",
    label: "Products Sold",
    description: "This month"
  },
  {
    icon: Users,
    number: "17",
    label: "Active Users",
    description: "Online now"
  },
  {
    icon: Zap,
    number: "53",
    label: "New Launches",
    description: "This year"
  },
  {
    icon: Award,
    number: "35",
    label: "Awards Won",
    description: "Recognition"
  }
];

export default function StatisticsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Statistics
          </h2>
          <p className="text-muted-foreground">
            Our achievements and key metrics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-xl p-6 md:p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground">
                      {stat.number}
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
