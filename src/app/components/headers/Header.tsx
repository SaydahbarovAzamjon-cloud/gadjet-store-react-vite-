// develop branch bazasida yozilgan
// YANGI: ShoppingCart ikonkasi endi Link emas — bosilganda o'ng tomondan
//        backdrop-blur overlay + drawer ochiladi (ProductModal kabi)
import { Search, ShoppingCart, Menu, X, LogOut, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/components/auth/AuthContext";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { onAdd, onRemove, onDelete, CartItem } from "@/store/slices/basketSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ── YANGI: cart overlay state ────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();

  // Redux'dan cart ma'lumotlari
  const cartItems  = useAppSelector((state) => state.basket.cartItems);
  const cartCount  = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Cart overlay ichida ko'rsatiladigan narxlar
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax      = subtotal * 0.1;
  const shipping = cartItems.length > 0 ? 15 : 0;
  const total    = subtotal + shipping + tax;

  // Overlay ref — tashqariga bosish = yopish
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Search handlers (develop dan saqlab qolindi) ──────────────────────────
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  // ── Cart overlay: ESC bilan yopish + scroll lock ──────────────────────────
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.body.style.overflow = "hidden"; // scroll lock
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [isCartOpen]);

  // Overlay background'ga (qora qismiga) bosish = yopish
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) setIsCartOpen(false);
    },
    []
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Gadjets
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Orders
              </Link>
            )}
            <Link to="/help" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">

            {/* Search (develop dan: handleSearch + handleSearchClick + value) */}
            <div className="hidden sm:flex items-center gap-2 bg-card rounded-lg px-3 py-2">
              <button onClick={handleSearchClick} className="cursor-pointer">
                <Search className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent outline-none text-sm w-32 placeholder:text-muted-foreground"
              />
            </div>

            {/* ── YANGI: Cart — endi Link emas, overlay ochuvchi button ── */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* Cart soni badge — bo'sh bo'lmasa ko'rsatiladi */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth section */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Avatar — memberImage bo'lsa haqiqiy rasm, yo'q bo'lsa gradient harf
                      (develop branch da allaqachon bor edi, saqlab qolindi) */}
                  <Link to="/my-page">
                    <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0">
                      {user?.memberImage ? (
                        <img
                          src={user.memberImage}
                          alt={user.memberNick}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user?.memberNick?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <span className="text-sm text-muted-foreground px-1">{user?.memberNick}</span>
                  <Button size="sm" variant="outline" className="border-border" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-border">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (develop dan: mobile search ham bor) */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border bg-background/80 backdrop-blur-md">
            <div className="container py-4 space-y-2">
              {/* Mobile Search */}
              <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 mb-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchValue.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
                      setSearchValue("");
                      setIsMenuOpen(false);
                    }
                  }}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>

              <Link to="/" onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors">
                Products
              </Link>
              {isAuthenticated && (
                <Link to="/orders" onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors">
                  Orders
                </Link>
              )}
              <Link to="/help" onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors">
                Help
              </Link>

              <div className="pt-4 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">{user?.memberNick}</div>
                    <Button size="sm" variant="outline" className="w-full border-border"
                      onClick={() => { logout(); setIsMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-border">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          CART OVERLAY (YANGI)
          Basket ikonkasiga bosilganda ochiladi.
          - Orqa fon backdrop-blur(10px) bilan xiralashadi
          - O'ng tomondan drawer siljib chiqadi (animation bilan)
          - Tashqariga bosish yoki X → yopiladi
          - ESC tugmasi → yopiladi
         ══════════════════════════════════════════════════════════════════════ */}
      {isCartOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            animation: "cartFadeIn 0.2s ease",
          }}
        >
          <style>{`
            @keyframes cartFadeIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes cartSlideUp {
              from { opacity: 0; transform: translateY(24px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* ── Markaziy modal panel (ProductModal uslubida) ── */}
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight: "88vh",
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              border: "1px solid #334155",
              borderRadius: "20px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.08)",
              display: "flex",
              flexDirection: "column",
              animation: "cartSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              overflow: "hidden",
            }}
          >
            {/* Drawer sarlavhasi */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              borderBottom: "1px solid #334155",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShoppingCart size={20} style={{ color: "#3b82f6" }} />
                <span style={{ fontWeight: 700, fontSize: "18px", color: "#f1f5f9" }}>
                  My Cart
                </span>
                {cartCount > 0 && (
                  <span style={{
                    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
              {/* Yopish (X) tugmasi */}
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid #334155",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: "#94a3b8",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.2)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Cart items ro'yxati — scroll */}
            <div style={{ flex: 1, padding: "16px 24px", overflowY: "auto" }}>
              {cartItems.length === 0 ? (
                /* Bo'sh holat */
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "12px", padding: "60px 0", color: "#64748b",
                }}>
                  <ShoppingCart size={48} style={{ opacity: 0.3 }} />
                  <p style={{ fontSize: "15px", fontWeight: 500 }}>Your cart is empty</p>
                  <p style={{ fontSize: "13px", opacity: 0.7 }}>Add some gadgets!</p>
                  <Link
                    to="/products"
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      marginTop: "8px", padding: "10px 20px",
                      background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                      color: "#fff", borderRadius: "10px",
                      fontSize: "14px", fontWeight: 600, textDecoration: "none",
                    }}
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                /* Item'lar */
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cartItems.map((item: CartItem) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex", gap: "12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid #334155",
                        borderRadius: "12px", padding: "12px",
                      }}
                    >
                      {/* Rasm */}
                      <div style={{
                        width: "64px", height: "64px",
                        borderRadius: "8px", overflow: "hidden",
                        flexShrink: 0, background: "#0f172a",
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      {/* Ma'lumotlar */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Nomi */}
                        <p style={{
                          color: "#f1f5f9", fontWeight: 600, fontSize: "14px",
                          marginBottom: "4px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.name}
                        </p>
                        {/* Narxi */}
                        <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
                          ${item.price.toLocaleString()}
                        </p>

                        {/* Quantity controls + delete */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {/* +/- */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <button
                              onClick={() => dispatch(onRemove(item))}
                              style={{
                                width: "28px", height: "28px", borderRadius: "6px",
                                border: "1px solid #334155", background: "transparent",
                                color: "#94a3b8", display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer",
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "14px", minWidth: "20px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(onAdd(item))}
                              style={{
                                width: "28px", height: "28px", borderRadius: "6px",
                                border: "1px solid #334155", background: "transparent",
                                color: "#94a3b8", display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer",
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Jami + o'chirish */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "14px" }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => dispatch(onDelete(item))}
                              style={{
                                background: "transparent", border: "none",
                                cursor: "pointer", color: "#ef4444",
                                padding: "4px", borderRadius: "4px",
                                display: "flex", alignItems: "center",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pastki qism: narxlar + tugmalar (faqat cart bo'sh bo'lmaganda) */}
            {cartItems.length > 0 && (
              <div style={{
                padding: "20px 24px",
                borderTop: "1px solid #334155",
                background: "rgba(255,255,255,0.03)",
              flexShrink: 0,
              }}>
                {/* Narx summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8" }}>
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8" }}>
                    <span>Shipping</span><span>${shipping.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#94a3b8" }}>
                    <span>Tax (10%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div style={{ height: "1px", background: "#334155", margin: "4px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800 }}>
                    <span style={{ color: "#f1f5f9" }}>Total</span>
                    <span style={{
                      background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout */}
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    display: "block", width: "100%", padding: "14px",
                    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    color: "#fff", borderRadius: "12px", textAlign: "center",
                    fontWeight: 700, fontSize: "15px", textDecoration: "none",
                    marginBottom: "10px",
                  }}
                >
                  Proceed to Checkout
                </Link>

                {/* Full cart */}
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    display: "block", width: "100%", padding: "12px",
                    background: "transparent", border: "1px solid #334155",
                    color: "#94a3b8", borderRadius: "12px", textAlign: "center",
                    fontWeight: 600, fontSize: "14px", textDecoration: "none",
                  }}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}