import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/app/components/headers/Header";
import Footer from "@/app/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Smartphone, Laptop, Watch, Tablet, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "@/app/screens/productsPage/sectionalComponents/ProductGrid";
import StatisticsSection from "@/app/screens/homePage/sectionalComponents/StatisticsSection";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchProducts } from "@/store/slices/productsSlice";

const categories = [
  { id: 1, name: "PHONE",   label: "Mobile Phones", icon: Smartphone },
  { id: 2, name: "LAPTOP",  label: "Laptops",       icon: Laptop     },
  { id: 3, name: "TABLET",  label: "Tablets",       icon: Tablet     },
  { id: 4, name: "WATCH",   label: "Watch",         icon: Watch      },
  { id: 5, name: "AIRPODS", label: "AirPods",       icon: Headphones },
];

const sortOptions = [
  { id: 1, label: "New", value: "createdAt" },
  { id: 2, label: "Price", value: "productPrice" },
  { id: 3, label: "Views", value: "productViews" },
];

const PRODUCTS_PER_PAGE = 6;

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [currentPage, setCurrentPage] = useState(1);

  const searchFromUrl   = searchParams.get("search")   || "";
  const categoryFromUrl = searchParams.get("category") || "";

  // EventsSection "Shop Now" bosilganda URL category ni filter ga qo'yamiz
  useEffect(() => {
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Backend filter — har bir kategoriya to'g'ridan-to'g'ri backendga yuboriladi
  useEffect(() => {
    dispatch(fetchProducts({
      page: 1,
      limit: 100,
      order: sortBy,
      productCategory: selectedCategory || undefined,
      search: searchFromUrl || undefined,
    }));
    setCurrentPage(1);
  }, [dispatch, sortBy, selectedCategory, searchFromUrl]);

  // Backend product ni ProductGrid formatiga o'tkazish
  const mapped = products.map((p) => ({
    id: p._id,
    name: p.productName,
    price: p.productPrice,
    rating: 4.5,
    reviews: 0,
    image:
      p.productImages?.[0] ||
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-mobile-iEfgQ9ZxTndYjmqT3Mesnn.webp",
    images: p.productImages,
    views: p.productViews,
    category: p.productCategory,
    desc: p.productDesc,
    leftCount: p.productLeftCount,
  }));

  const totalPages = Math.ceil(mapped.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginated = mapped.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(selectedCategory === cat ? null : cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container py-6 border-b border-border">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Products</span>
          </div>
        </div>

        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">Browse our collection of premium gadgets</p>

            {/* Search natijasi ko'rsatish */}
            {searchFromUrl && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm text-blue-400">
                  Search results for: <strong>"{searchFromUrl}"</strong>
                </span>
                <button
                  onClick={handleClearSearch}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              {/* Categories */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border text-sm font-medium ${
                          selectedCategory === cat.name
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent"
                            : "bg-card border-border text-foreground hover:border-accent"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort */}
              <div className="flex-1 lg:text-right">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sort By</h3>
                <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSortChange(opt.value)}
                      className={`px-4 py-2 rounded-lg transition-all border font-medium text-sm ${
                        sortBy === opt.value
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card border-border text-foreground hover:border-accent"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading / Error / Products */}
            {loading && (
              <p className="text-muted-foreground text-center py-12">Loading products...</p>
            )}
            {error && <p className="text-destructive text-center py-12">{error}</p>}

            {!loading && !error && (
              <>
                <div className="text-sm text-muted-foreground">
                  Showing {paginated.length} of {mapped.length} products
                  {selectedCategory && ` in ${selectedCategory}`}
                  {searchFromUrl && ` matching "${searchFromUrl}"`}
                </div>

                {mapped.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg">No products found</p>
                    {searchFromUrl && (
                      <p className="text-sm mt-2">
                        Try a different search term or{" "}
                        <button onClick={handleClearSearch} className="text-blue-400 underline">
                          clear search
                        </button>
                      </p>
                    )}
                  </div>
                ) : (
                  <ProductGrid products={paginated} />
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-card border border-border text-foreground hover:border-accent"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <StatisticsSection />
      </main>
      <Footer />
    </div>
  );
}