import { ArrowRight } from "lucide-react";
import ProductGrid from "../../productsPage/sectionalComponents/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";
import { getImageUrl } from "@/lib/getImageUrl";
import { useEffect } from "react";

export default function PopularGadgetsSection() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts({}));
  }, [dispatch, products.length]);

  // Views bo'yicha top 8 — "Popular"
  const popular = [...products]
    .sort((a, b) => (b.productViews || 0) - (a.productViews || 0))
    .slice(0, 8)
    .map((p) => ({
      id: p._id,
      name: p.productName,
      price: p.productPrice,
      rating: 4.7,
      reviews: p.productViews || 0,
      image: getImageUrl(p.productImages?.[0]) || "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-accessories-awkpiV5CdQwk59Appw3t9t.webp",
      images: p.productImages,
      views: p.productViews,
      category: p.productCategory,
      desc: p.productDesc,
      leftCount: p.productLeftCount,
      badge: "Popular",
    }));

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Highly Recommended</h2>
            <p className="text-muted-foreground">Discover our most popular and highly-rated gadgets</p>
          </div>
          <a href="/products" className="hidden md:flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : (
          <ProductGrid products={popular} />
        )}
      </div>
    </section>
  );
}
