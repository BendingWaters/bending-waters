"use client";

import { memo, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const VIDEOS = [
  "/videos/helping-builders.mp4",
  "/videos/helping-builders-2.mp4",
  "/videos/helping-builders-3.mp4",
  "/videos/helping-builders-4.mp4",
] as const;

const CARD_REPEAT_COUNT = 4;

type ProductCardProps = {
  videoUrl: string;
  setCardRef: (el: HTMLDivElement | null) => void;
  setVideoRef: (el: HTMLVideoElement | null) => void;
  setOverlayRef: (el: HTMLDivElement | null) => void;
};

const ProductCard = memo(function ProductCard({
  videoUrl,
  setCardRef,
  setVideoRef,
  setOverlayRef,
}: ProductCardProps) {
  return (
    <div
      ref={setCardRef}
      className={[
        "absolute left-1/2 top-1/2",
        "h-72 w-65 md:h-96 md:w-[320px]",
        "overflow-hidden rounded-4xl",
        "border border-white/10 bg-black",
        "shadow-[0_30px_90px_rgba(0,0,0,0.75)]",
        "transform-gpu will-change-transform",
        "contain-layout contain-paint",
      ].join(" ")}
      style={{
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      <video
        ref={setVideoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        preload="metadata"
        className="pointer-events-none h-full w-full object-cover"
      />

      <div
        ref={setOverlayRef}
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
      />
    </div>
  );
});

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const overlaysRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeVideosRef = useRef<Set<number>>(new Set());

  const extendedCards = useMemo(() => {
    return Array.from({ length: CARD_REPEAT_COUNT }, () => VIDEOS).flat();
  }, []);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const videos = videosRef.current;
      const overlays = overlaysRef.current;

      if (!cards.length) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let progress = 0;
      let ticker: gsap.TickerCallback | null = null;
      let resizeTimer: ReturnType<typeof setTimeout> | null = null;

      const cardSetters = cards.map((card) => {
        return gsap.quickSetter(card, "css") as (value: gsap.TweenVars) => void;
      });

      const overlaySetters = overlays.map((overlay) => {
        if (!overlay) return null;

        return gsap.quickSetter(overlay, "opacity") as (value: number) => void;
      });

      const syncVideoPlayback = (nextActiveVideos: Set<number>) => {
        const currentActiveVideos = activeVideosRef.current;

        currentActiveVideos.forEach((index) => {
          if (nextActiveVideos.has(index)) return;

          const video = videos[index];

          if (video && !video.paused) {
            video.pause();
          }
        });

        nextActiveVideos.forEach((index) => {
          if (currentActiveVideos.has(index)) return;

          const video = videos[index];

          if (video && video.paused) {
            video.play().catch(() => {
              // Browser autoplay policies can reject play().
              // Since videos are decorative, failing silently is fine.
            });
          }
        });

        activeVideosRef.current = nextActiveVideos;
      };

      const createMarquee = () => {
        if (ticker) {
          gsap.ticker.remove(ticker);
          ticker = null;
        }

        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth < 768;

        const cardWidth = isMobile ? 260 : 320;
        const gap = isMobile ? 12 : 28;
        const itemWidth = cardWidth + gap;
        const totalWidth = itemWidth * cards.length;

        const maxDistance = isMobile
          ? viewportWidth * 0.85
          : viewportWidth * 0.65;

        const wrapX = gsap.utils.wrap(-totalWidth / 2, totalWidth / 2);

        const updateMarquee: gsap.TickerCallback = () => {
          if (!prefersReducedMotion) {
            progress -= 0.00022 * gsap.ticker.deltaRatio(60);

            if (progress < 0) {
              progress += 1;
            }
          }

          const nextActiveVideos = new Set<number>();

          cards.forEach((_, index) => {
            const rawX = index * itemWidth + progress * totalWidth;
            const centeredX = rawX - totalWidth / 2;
            const x = wrapX(centeredX);

            const normalizedDistance = gsap.utils.clamp(-1, 1, x / maxDistance);

            const distanceFromCenter = Math.abs(normalizedDistance);
            const centerStrength = 1 - distanceFromCenter;

            const rotateY = -normalizedDistance * (isMobile ? 30 : 48);

            const z = gsap.utils.interpolate(
              isMobile ? -140 : -280,
              isMobile ? 180 : 420,
              centerStrength
            );

            const scale = gsap.utils.interpolate(
              isMobile ? 0.84 : 0.88,
              isMobile ? 1 : 1.08,
              centerStrength
            );

            const opacity = gsap.utils.interpolate(0.72, 1, centerStrength);

            const overlayOpacity = gsap.utils.interpolate(
              isMobile ? 0.5 : 0.62,
              0.08,
              centerStrength
            );

            const zIndex = Math.round(centerStrength * 100);

            cardSetters[index]({
              xPercent: -50,
              yPercent: -50,
              x,
              z,
              rotateY,
              scale,
              opacity,
              zIndex,
              transformOrigin: "50% 50%",
            });

            overlaySetters[index]?.(overlayOpacity);

            // Only the most visible cards should play.
            // This avoids decoding many videos at the same time.
            if (!prefersReducedMotion && centerStrength > 0.78) {
              nextActiveVideos.add(index);
            }
          });

          syncVideoPlayback(nextActiveVideos);
        };

        if (!prefersReducedMotion) {
          gsap.ticker.add(updateMarquee);
          ticker = updateMarquee;
        }
      };

      const handleResize = () => {
        if (resizeTimer) {
          clearTimeout(resizeTimer);
        }

        resizeTimer = setTimeout(() => {
          createMarquee();
        }, 150);
      };

      createMarquee();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        if (resizeTimer) {
          clearTimeout(resizeTimer);
        }

        if (ticker) {
          gsap.ticker.remove(ticker);
        }

        activeVideosRef.current.forEach((index) => {
          const video = videos[index];

          if (video && !video.paused) {
            video.pause();
          }
        });

        activeVideosRef.current.clear();
      };
    },
    {
      scope: rootRef,
      dependencies: [extendedCards.length],
    }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-black px-4 pt-20 pb-10 text-white md:pt-28 md:pb-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_58%)]" />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <p className="mb-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60 backdrop-blur">
          We build for growth
        </p>

        <h1 className="text-[clamp(2.5rem,7vw,6rem)] leading-9 tracking-tight text-white md:leading-14">
          Impossible is
          <br />
          <span className="font-serif italic tracking-[-0.04em] text-primary">
            nothing
          </span>
        </h1>
      </div>

      <div
        className="relative z-0 mt-8 flex h-107.5 w-full items-center justify-center sm:h-125 md:mt-4 md:h-155"
        style={{
          perspective: "1200px",
          contain: "layout paint size",
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
        aria-hidden="true"
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {extendedCards.map((videoUrl, index) => (
            <ProductCard
              key={`${videoUrl}-${index}`}
              videoUrl={videoUrl}
              setCardRef={(el) => {
                cardsRef.current[index] = el;
              }}
              setVideoRef={(el) => {
                videosRef.current[index] = el;
              }}
              setOverlayRef={(el) => {
                overlaysRef.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
