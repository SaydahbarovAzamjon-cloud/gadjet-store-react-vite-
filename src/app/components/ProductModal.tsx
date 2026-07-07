import { useEffect, useRef, useCallback } from "react";
import { X, ShoppingCart, Eye, Heart, Star, Package, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { onAdd } from "@/store/slices/basketSlice";
import { updateProductViews } from "@/store/slices/productsSlice";
import { useAuth } from "@/app/components/auth/AuthContext";
import apiService from "@/lib/apiService";
import { getImageUrl } from "@/lib/getImageUrl";
import { useState } from "react";

interface ModalProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: string;
  views?: number;
  likes?: number;
  category?: string;
  desc?: string;
  leftCount?: number;
}

interface ProductModalProps {
  product: ModalProduct | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [currentImg, setCurrentImg] = useState(0);
  const [localViews, setLocalViews] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // productView API call — faqat authenticated userlarda
  useEffect(() => {
    if (!product) return;
    setCurrentImg(0);
    setLocalViews(product.views ?? 0);

    const trackView = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await apiService.get(`/product/${product.id}`);
        // Backend yangi productViews qaytaradi — uni sync qilamiz
        if (res.data?.productViews !== undefined) {
          setLocalViews(res.data.productViews);
          // Redux store yangilaymiz — card da ham ko'rinsin
          dispatch(updateProductViews({ id: product.id, views: res.data.productViews }));
        }
      } catch (_) {
        // View tracking xatosi UI ni buzmasin
      }
    };

    trackView();
  }, [product?.id, isAuthenticated]);

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    // Scroll lock
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Overlay click — modal tashqarisiga bosish = yopish
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    dispatch(
      onAdd({
        _id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      })
    );
    onClose();
  };

  const prevImg = () => setCurrentImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setCurrentImg((i) => (i + 1) % images.length);

  return (
    /* ── Overlay ── */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      {/* ── Modal Box ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid #334155",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(148,163,184,0.08)",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          <X size={16} />
        </button>

        {/* ── Content grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
          }}
          className="product-modal-grid"
        >
          {/* Left — Image gallery */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: "20px 0 0 20px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "420px",
              position: "relative",
            }}
          >
            {/* Badge */}
            {product.badge && (
              <span
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {product.badge}
              </span>
            )}

            {/* Main image */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", maxHeight: "300px" }}>
              <img
                src={getImageUrl(images[currentImg])}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                  transition: "opacity 0.2s",
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    style={{
                      position: "absolute",
                      left: "4px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImg}
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImg(idx)}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `2px solid ${currentImg === idx ? "#3b82f6" : "transparent"}`,
                      padding: 0,
                      background: "none",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <img src={getImageUrl(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {/* View count — live */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              <Eye size={14} />
              <span>
                {localViews ?? product.views ?? 0} views
                {!isAuthenticated && (
                  <span style={{ color: "#475569", fontSize: "11px", marginLeft: "6px" }}>
                    (login to track)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Right — Details */}
          <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Category chip */}
            {product.category && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Tag size={12} style={{ color: "#ec4899" }} />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#ec4899",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {product.category}
                </span>
              </div>
            )}

            {/* Name */}
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#f1f5f9",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {product.name}
            </h2>

            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    style={{
                      fill: i < Math.floor(product.rating) ? "#facc15" : "transparent",
                      color: i < Math.floor(product.rating) ? "#facc15" : "#475569",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: "16px", color: "#475569", textDecoration: "line-through" }}>
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Desc */}
            {product.desc && (
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                {product.desc}
              </p>
            )}

            {/* Divider */}
            <div style={{ height: "1px", background: "#1e293b" }} />

            {/* Stats row */}
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" }}>
                <Heart size={14} style={{ color: "#ec4899" }} />
                <span>{product.likes ?? 0} likes</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "13px" }}>
                <Eye size={14} />
                <span>{localViews ?? product.views ?? 0} views</span>
              </div>
              {product.leftCount !== undefined && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: (product.leftCount ?? 0) <= 5 ? "#ef4444" : "#22c55e",
                  }}
                >
                  <Package size={14} />
                  <span>{product.leftCount} left</span>
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto" }}>
              <Button
                onClick={handleAddToCart}
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "opacity 0.2s",
                }}
                className="hover:opacity-90"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>

              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#64748b";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#334155";
                  (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                }}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>

        {/* Responsive: mobile da stack */}
        <style>{`
          @media (max-width: 640px) {
            .product-modal-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
