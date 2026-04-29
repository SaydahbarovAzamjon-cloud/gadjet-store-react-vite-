import { TrendingUp, Users, ShoppingBag, Package } from "lucide-react";
import { useEffect, useState } from "react";
import apiService from "@/lib/apiService";

// /stats endpoint dan keladigan real ma'lumot tipi
interface StatsData {
  totalProducts: number;       // barcha active productlar
  totalMembers: number;        // barcha active userlar
  totalFinishedOrders: number; // tugallangan orderlar — BARCHA userlarniki
  newProducts: number;         // so'nggi 30 kun ichida qo'shilgan productlar
}

export default function StatisticsSection() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalMembers: 0,
    totalFinishedOrders: 0,
    newProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  // FIX 1: isAuthenticated tekshiruvi olib tashlandi.
  // /order/all?orderStatus=FINISH — BARCHA userlarning tugallangan orderlari.
  // Login bo'lmasa ham ko'rsatiladi (umumiy statistika).
  useEffect(() => {
    Promise.all([
      // Barcha productlar (PROCESS = active)
      apiService.get("/product/all?page=1&limit=1000"),
      // Registered members
      apiService.get("/member/top-users"),
      // FINISH orderlari — xato bo'lsa [] qaytariladi
      apiService.get("/order/all?page=1&limit=1000&orderStatus=FINISH").catch(() => ({ data: [] })),
    ])
      .then(([productsRes, membersRes, ordersRes]) => {
        const products = productsRes.data ?? [];
        const members  = membersRes.data  ?? [];
        // Response strukturasini normalize qilish
        const rawOrders = ordersRes.data;
        const orders: any[] = Array.isArray(rawOrders)
          ? rawOrders
          : (rawOrders?.data ?? []);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const newThisMonth = products.filter((p: any) => {
          return new Date(p.createdAt) >= thirtyDaysAgo;
        }).length;

        setStats({
          totalProducts:       products.length,
          totalMembers:        members.length,
          totalFinishedOrders: orders.length,
          newProducts:         newThisMonth,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: Package,
      value: stats.totalProducts,
      label: "Total Products",
      description: "In our store",
    },
    {
      icon: Users,
      value: stats.totalMembers,
      label: "Registered Users",
      description: "Active members",
    },
    {
      icon: TrendingUp,
      value: stats.totalFinishedOrders,
      label: "Orders Completed",
      description: "Delivered successfully",
    },
    {
      icon: ShoppingBag,
      value: stats.newProducts,
      label: "New This Month",
      description: "Fresh arrivals",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Statistics</h2>
          <p className="text-muted-foreground">Our achievements and key metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-xl p-6 md:p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  <div>
                    {loading ? (
                      <div className="h-10 w-16 bg-muted animate-pulse rounded mb-1" />
                    ) : (
                      <div className="text-3xl md:text-4xl font-bold text-foreground">
                        {(card.value ?? 0).toLocaleString()}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-muted-foreground mt-1">
                      {card.label}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {card.description}
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