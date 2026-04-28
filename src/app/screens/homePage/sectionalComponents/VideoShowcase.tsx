import { useRef, useEffect } from "react";
import showcaseVideo from "@/assets/videos/Video_Generation_and_Extension_Request.mp4";

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Komponent yuklanganda video avtomatik play bo'ladi
  // autoPlay + muted — brauzer qoidasi: muted bo'lmasa autoplay bloklanadi
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay bloklangan bo'lsa (ayrim brauzerlar) — jimgina o'tkazib yuborish
      });
    }
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Sarlavha */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover Our Gadgets Collection
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of premium gadgets and tech devices
            designed to enhance your lifestyle and productivity.
          </p>
        </div>

        {/* Video — blur overlay YO'Q, autoplay + muted + loop */}
        <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={showcaseVideo}
            autoPlay      // avtomatik boshlanadi
            muted         // brauzer autoplay uchun muted shart
            loop          // tugagach qayta boshlanadi
            playsInline   // iOS da full-screen chiqmasin
            controls      // foydalanuvchi pause/play/volume boshqarsin
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
}
