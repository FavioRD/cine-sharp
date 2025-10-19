import { useEffect, useState } from "react";

export interface BannerImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface BannerSliderProps {
  images: BannerImage[];
  interval?: number; 
  height?: string;  
}

export default function BannerSlider({
  images,
  interval = 4000,
  height = "h-64",
}: BannerSliderProps) {
  const [index, setIndex] = useState(0);

  // Avanza automáticamente
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${height}`}>

      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <figure key={i} className="flex-shrink-0 w-full h-full relative">
            <img
              src={img.src}
              alt={img.alt ?? `slide-${i}`}
              className="w-full h-full object-cover"
            />
            {img.caption && (
              <figcaption className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-md">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <button
        onClick={() =>
          setIndex((i) => (i - 1 + images.length) % images.length)
        }
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full bg-white transition-all ${
              i === index ? "opacity-100 scale-110" : "opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
