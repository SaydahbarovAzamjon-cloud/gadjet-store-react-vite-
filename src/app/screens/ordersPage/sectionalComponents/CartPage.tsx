import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { onAdd, onRemove, onDelete, onDeleteAll, CartItem } from "@/store/slices/basketSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.basket.cartItems); // Redux dan cart

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="container py-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Shopping Cart</span>
          </div>
        </div>

        <div className="container py-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to get started!</p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-foreground mb-6">Shopping Cart</h1>
                <div className="space-y-4">
                  {cartItems.map((item: CartItem) => (
                    <div key={item._id} className="bg-card rounded-lg border border-border p-4 flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-accent mb-3">${item.price}</p>

                        {/* Quantity Controls — Redux dispatch */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => dispatch(onRemove(item))}  // quantity--
                            className="p-1 rounded border border-border hover:bg-card text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(onAdd(item))}     // quantity++
                            className="p-1 rounded border border-border hover:bg-card text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-lg font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => dispatch(onDelete(item))}    // o'chirish
                          className="p-2 rounded hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-foreground font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Link to="/checkout">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white mb-3">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link to="/products">
                    <Button variant="outline" className="w-full border-border">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Promo Code */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <label className="text-sm font-medium text-foreground mb-2 block">Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Button size="sm" variant="outline" className="border-border">Apply</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
