import { ArrowRight } from "lucide-react";
import ProductGrid from "../../productsPage/sectionalComponents/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";
import { getImageUrl } from "@/lib/getImageUrl";
import { useEffect } from "react";

export default function NewGadgetsSection() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Agar hali yuklanmagan bo'lsa, yuklab olish
    if (products.length === 0) dispatch(fetchProducts({}));
  }, [dispatch, products.length]);

  // Oxirgi 8 ta product — "New" deb belgilash
  const newProducts = [...products]
    .slice(-8)
    .map((p) => ({
      id: p._id,
      name: p.productName,
      price: p.productPrice,
      rating: 4.5,
      reviews: 0,
      image: getImageUrl(p.productImages?.[0]) || "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-mobile-iEfgQ9ZxTndYjmqT3Mesnn.webp",
      images: p.productImages,
      views: p.productViews,
      category: p.productCategory,
      desc: p.productDesc,
      leftCount: p.productLeftCount,
      badge: "New",
    }));

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Best Selling Products</h2>
            <p className="text-muted-foreground">Check out our latest arrivals and best sellers</p>
          </div>
          <a href="/products" className="hidden md:flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : (
          <ProductGrid products={newProducts} />
        )}
      </div>
    </section>
  );
}
