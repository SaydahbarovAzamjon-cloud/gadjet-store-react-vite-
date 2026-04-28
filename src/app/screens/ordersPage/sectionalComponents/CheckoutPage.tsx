import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package } from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { onDeleteAll } from "@/store/slices/basketSlice";
import apiService from "@/lib/apiService";
import { fetchOrders, fetchOrderStats } from "@/store/slices/orderSlice";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/app/components/auth/AuthContext";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useAppSelector((state) => state.basket.cartItems);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 2000 ? 0 : 100; // matches backend logic
  const total = subtotal + delivery;

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      setPlacing(true);
      setError(null);

      const orderItems = cartItems.map((item) => ({
        productId: item._id,
        itemQuantity: item.quantity,
        itemPrice: item.price,
      }));

      await apiService.post("/order/create", orderItems);

      dispatch(onDeleteAll());
      // Fetch paused orders so they appear immediately
      dispatch(fetchOrders({ page: 1, limit: 20, orderStatus: "PAUSE" }));
      // YANGI: order statistikani yangilash (sidebar Total Orders/Spent yangilansin)
      dispatch(fetchOrderStats());
      navigate("/orders");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container py-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <a href="/cart" className="text-muted-foreground hover:text-foreground">Cart</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Checkout</span>
          </div>
        </div>

        <div className="container py-12 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-accent" />
            Order Confirmation
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-lg border border-border">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add items before checking out.</p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-6 space-y-6">

              {/* Delivery info */}
              {user?.memberAddress && (
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Delivery to</p>
                  <p className="text-foreground font-medium">{user.memberNick}</p>
                  <p className="text-sm text-muted-foreground">{user.memberAddress}</p>
                </div>
              )}

              {/* Cart items */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Items ({cartItems.length})</h2>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-background flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-foreground font-semibold flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span>{delivery === 0 ? <span className="text-green-500">Free</span> : `$${delivery.toFixed(2)}`}</span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-muted-foreground">
                    Free delivery on orders over $2000
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-sm text-red-500 text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 text-lg font-semibold"
              >
                {placing ? "Placing order..." : "Place Order"}
              </Button>

              <Link to="/cart">
                <Button variant="outline" className="w-full border-border">
                  Back to Cart
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}