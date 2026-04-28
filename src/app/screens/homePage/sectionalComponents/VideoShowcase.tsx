import { Play } from "lucide-react";
import { useRef, useState } from "react";
import showcaseVideo from "@/assets/videos/Video_Generation_and_Extension_Request.mp4";

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start video only after the user clicks the play button
  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Discover Our Gadgets Collection
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of premium gadgets and tech devices
            designed to enhance your lifestyle and productivity.
          </p>
        </div>

        {/* Full-width video container */}
        <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden border border-border shadow-xl">
          {/* Main showcase video */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={showcaseVideo}
            controls
            playsInline
            preload="metadata"
          />

          {/* Show overlay play button until the video starts */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group bg-gradient-to-br from-blue-900/80 to-purple-900/80"
            >
              <div className="w-24 h-24 rounded-full bg-white/15 group-hover:bg-white/25 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
