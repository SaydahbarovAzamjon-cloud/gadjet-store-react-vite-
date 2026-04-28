// develop branch bazasida yozilgan
// YANGI 1: User avatar — memberImage bo'lsa haqiqiy rasm ko'rsatiladi
// YANGI 2: "Cart Details" o'rniga "Order Stats" — jami orderlar soni + sarflangan pul
//          fetchOrderStats() dispatch qilinadi, har order statusida yangilanadi
import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle2, AlertCircle, MapPin, ShoppingBag, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/components/auth/AuthContext";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import apiService from "@/lib/apiService";
import { fetchOrders, fetchOrderStats } from "@/store/slices/orderSlice";

// Backend Order tipi (aggregate dan keladi)
interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  productId: string;
}

interface ProductData {
  _id: string;
  productName: string;
  productImages: string[];
}

interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: "PAUSE" | "PROCESS" | "FINISH";
  createdAt: string;
  orderItems: OrderItem[];
  productData: ProductData[];
}

// Backend status enumlari bilan mos
const STATUS_MAP = {
  paused:     "PAUSE",
  processing: "PROCESS",
  finished:   "FINISH",
} as const;

type TabKey = keyof typeof STATUS_MAP;

const FALLBACK_IMAGE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-mobile-iEfgQ9ZxTndYjmqT3Mesnn.webp";

export default function OrdersPage() {
  const { user } = useAuth();
  const dispatch  = useAppDispatch();

  const [activeTab, setActiveTab] = useState<TabKey>("paused");

  // Redux'dan orders + stats
  const { orders, loading, stats } = useAppSelector((state: any) => state.orders);
  const { totalOrders, totalSpent, statsLoading } = stats;

  // Tab o'zgarganda orders yuklanadi
  useEffect(() => {
    dispatch(
      fetchOrders({
        page: 1,
        limit: 20,
        orderStatus: STATUS_MAP[activeTab], // ⚠️ tab key → backend enum
      })
    );
  }, [dispatch, activeTab]);

  // Komponent birinchi ochilganda statistikani yuklaymiz
  useEffect(() => {
    if (user) dispatch(fetchOrderStats());
  }, [dispatch, user]);

  // Order statusini o'zgartirish (develop dan: tab switching logic saqlab qolindi)
  const updateOrderStatus = async (
    orderId: string,
    newStatus: "PAUSE" | "PROCESS" | "FINISH" | "DELETE"
  ) => {
    try {
      await apiService.post("/order/update", { orderId, orderStatus: newStatus });

      // PROCESS ga o'tganda → "processing" tabga o'tish (useEffect avtomatik fetch)
      if (newStatus === "PROCESS") {
        setActiveTab("processing");
        // Statistikani ham yangilash (pul sarflandi hisoblanishi uchun)
        dispatch(fetchOrderStats());
        return;
      }

      // FINISH ga o'tganda → "finished" tabga o'tish
      if (newStatus === "FINISH") {
        setActiveTab("finished");
        dispatch(fetchOrderStats());
        return;
      }

      // DELETE yoki boshqa holatlarda hozirgi tabni refresh
      dispatch(
        fetchOrders({
          page: 1,
          limit: 20,
          orderStatus: STATUS_MAP[activeTab],
        })
      );
      // Statistikani ham yangilash (order o'chirildi)
      dispatch(fetchOrderStats());
    } catch (err) {
      console.error("Order update error:", err);
    }
  };

  // Birinchi product rasmini olish
  const getOrderImage = (order: Order) => {
    const firstItem = order.orderItems?.[0];
    if (!firstItem) return FALLBACK_IMAGE;
    const product = order.productData?.find((p) => p._id === firstItem.productId);
    return product?.productImages?.[0] || FALLBACK_IMAGE;
  };

  // Birinchi product nomini olish (+ qolgan soni)
  const getOrderName = (order: Order) => {
    const firstItem = order.orderItems?.[0];
    if (!firstItem) return "Order";
    const product = order.productData?.find((p) => p._id === firstItem.productId);
    const extra = order.orderItems.length > 1 ? ` +${order.orderItems.length - 1} more` : "";
    return (product?.productName || "Product") + extra;
  };

  const getStatusIcon = (tab: TabKey) => {
    if (tab === "processing") return <Clock className="w-5 h-5 text-blue-500" />;
    if (tab === "finished")   return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">

              {/* ── YANGI: User Card — real memberImage ── */}
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex flex-col items-center text-center mb-4">

                  {/* Avatar: rasm bo'lsa ko'rsat, bo'lmasa gradient fallback */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent shadow-lg mb-4">
                    {user?.memberImage ? (
                      // Haqiqiy profil rasmi (MyPage da upload qilingan)
                      <img
                        src={user.memberImage}
                        alt={user.memberNick}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback: ismi bosh harfi + gradient
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {user?.memberNick?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">{user?.memberNick || "User"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{user?.memberPhone}</p>
                </div>

                {/* Manzil */}
                <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Address</p>
                    <p className="text-foreground font-medium">{user?.memberAddress || "—"}</p>
                  </div>
                </div>
              </div>

              {/* ── YANGI: Order Stats kartasi ──
                  Eski "Cart Details" (subtotal/shipping/tax) o'rnini oldi.
                  fetchOrderStats() → totalOrders + totalSpent Redux'dan olinadi.
                  Har order status o'zgarganda avtomatik yangilanadi.
              ── */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Order Stats
                </h3>

                {statsLoading ? (
                  /* Loading skeletons */
                  <div className="space-y-3">
                    <div className="h-14 rounded-lg bg-background animate-pulse" />
                    <div className="h-14 rounded-lg bg-background animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Jami orderlar soni */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Orders</p>
                          <p className="text-sm font-medium text-foreground">All time</p>
                        </div>
                      </div>
                      {/* Jami son — ko'zga tashlanadigan */}
                      <span className="text-2xl font-bold text-blue-400">
                        {totalOrders}
                      </span>
                    </div>

                    {/* Jami sarflangan pul */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                          <p className="text-sm font-medium text-foreground">All time</p>
                        </div>
                      </div>
                      {/* Pul miqdori — accent rang */}
                      <span className="text-lg font-bold text-accent">
                        ${totalSpent.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>

                    {/* Hali hech buyurtma yo'q */}
                    {totalOrders === 0 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">
                        No orders yet. Start shopping! 🛒
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Orders ro'yxati ── */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto pb-2">
                {([
                  { id: "paused"     as TabKey, label: "Paused Orders",     icon: AlertCircle  },
                  { id: "processing" as TabKey, label: "Processing Orders", icon: Clock        },
                  { id: "finished"   as TabKey, label: "Finished Orders",   icon: CheckCircle2 },
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-accent text-accent"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />{tab.label}
                  </button>
                ))}
              </div>

              {/* Loading */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-6 h-40 animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No orders in this section</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                        {/* Rasm */}
                        <div className="md:col-span-1">
                          <img
                            src={getOrderImage(order)}
                            alt="product"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Ma'lumot */}
                        <div className="md:col-span-2 space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(activeTab)}
                            <h3 className="font-semibold text-foreground">{getOrderName(order)}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Items: {order.orderItems?.length || 0} | Delivery: ${order.orderDelivery}
                          </p>

                          {activeTab === "paused"     && <p className="text-sm text-yellow-500 font-medium">Awaiting confirmation</p>}
                          {activeTab === "processing" && <p className="text-sm text-blue-500 font-medium">In progress...</p>}
                          {activeTab === "finished"   && <p className="text-sm text-green-500 font-medium">Delivered ✓</p>}
                        </div>

                        {/* Amallar */}
                        <div className="md:col-span-1 text-right space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-accent">${order.orderTotal}</p>
                          </div>

                          {/* PAUSE → PROCESS yoki DELETE */}
                          {activeTab === "paused" && (
                            <div className="space-y-2">
                              <Button
                                onClick={() => updateOrderStatus(order._id, "PROCESS")}
                                size="sm"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                              >
                                Pay Now
                              </Button>
                              <Button
                                onClick={() => updateOrderStatus(order._id, "DELETE")}
                                variant="outline"
                                size="sm"
                                className="w-full text-red-500 border-red-500 hover:bg-red-500/20"
                              >
                                Cancel Order
                              </Button>
                            </div>
                          )}

                          {/* PROCESS → FINISH */}
                          {activeTab === "processing" && (
                            <Button
                              onClick={() => updateOrderStatus(order._id, "FINISH")}
                              size="sm"
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                            >
                              Mark as Received
                            </Button>
                          )}

                          {/* FINISH — ko'rish */}
                          {activeTab === "finished" && (
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}