import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Clock, Gift, ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  {
    title: "Up to 50% off mega offers",
    subtitle: "Limited time",
    description: "Explore our collection of premium gadgets at unbeatable prices",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-mobile-iEfgQ9ZxTndYjmqT3Mesnn.webp",
    color: "from-blue-600 to-blue-800"
  },
  {
    title: "Unlimited Deals on Electronics",
    subtitle: "Ending soon",
    description: "Get the latest tech gadgets with massive discounts",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-laptop-23S5gon2y8YMkZf7dSudAG.webp",
    color: "from-purple-600 to-purple-800"
  },
  {
    title: "50% off for Laptop",
    subtitle: "Today only",
    description: "Don't miss this incredible opportunity on laptops",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/category-accessories-awkpiV5CdQwk59Appw3t9t.webp",
    color: "from-orange-600 to-orange-800"
  },
  {
    title: "Smart Watch Collection",
    subtitle: "New arrival",
    description: "Discover the latest smartwatch technology",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663464643074/QaGTRRsJqyabPS7Ai9zqHt/hero-smartwatch-m9S5b4DMyyxYQXkrVX87u7.webp",
    color: "from-green-600 to-green-800"
  }
];

export default function EventsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Ongoing Events
          </h2>
          <p className="text-muted-foreground">
            Don't miss our exclusive deals and limited-time offers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {events.map((event, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                >
                  <div
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${event.color} p-12 md:p-16 text-white min-h-96 md:min-h-[500px] flex items-center`}
                  >
                    {/* Background image */}
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
                    />

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl">
                      <div className="flex items-center gap-2 mb-6">
                        <Gift className="w-6 h-6" />
                        <span className="text-lg font-semibold opacity-90">
                          {event.subtitle}
                        </span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        {event.title}
                      </h3>
                      <p className="text-lg opacity-90 mb-8 max-w-xl">
                        {event.description}
                      </p>

                      <Button
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-background hover:border-accent transition-all flex items-center justify-center group"
          >
            <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-accent" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border hover:bg-background hover:border-accent transition-all flex items-center justify-center group"
          >
            <ChevronRight className="w-6 h-6 text-foreground group-hover:text-accent" />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 w-8"
                    : "bg-muted-foreground hover:bg-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
