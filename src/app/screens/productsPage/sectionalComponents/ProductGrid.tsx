import { useState } from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useAppDispatch } from "@/hooks/redux";
import { onAdd } from "@/store/slices/basketSlice";
import ProductModal from "@/app/components/ProductModal";

interface Product {
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

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const dispatch = useAppDispatch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    dispatch(
      onAdd({
        _id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      })
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group bg-card rounded-xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
            style={{ cursor: "pointer" }}
          >
            {/* Image container */}
            <div className="relative overflow-hidden bg-slate-900 h-48">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {product.badge && (
                <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {product.badge}
                </div>
              )}

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-accent" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-lg text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  <span>{product.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-lg text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{product.views || 0}</span>
                </div>
              </div>

              {/* "View Details" hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(0,0,0,0.35)" }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "rgba(59,130,246,0.85)",
                    padding: "6px 16px",
                    borderRadius: "999px",
                    backdropFilter: "blur(4px)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  View Details
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-accent">
                  <Heart className="w-3 h-3 fill-accent" />
                  <span className="font-semibold">{product.likes || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{product.views || 0}</span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
