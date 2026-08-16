"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Storytelling() {
  const container = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".story-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      tl.from(
        ".video-container",
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        },
        "-=0.6"
      );
    },
    { scope: container }
  );

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={container}
      className="w-full relative py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-[#111] via-[#111]/80 to-[#111]"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header Content */}
        <div className="max-w-4xl text-center mb-16 space-y-6">
          <h3 className="story-text text-np-orange font-bold tracking-widest uppercase text-sm">
            Solutions
          </h3>

          <h2 className="story-text text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Content-Led Sales & Pre-Sales Strategy
          </h2>

          <div className="story-text w-24 h-1 bg-np-orange mx-auto rounded-full my-6"></div>

          <p className="story-text text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We help SaaS founders turn founder-led content into a predictable
            sales engine. By aligning positioning, storytelling, and
            distribution, we transform content from brand noise into qualified
            sales conversations.
          </p>
        </div>

        {/* Video Container */}
        <div className="video-container relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
          >
            <source src="/videos/videeo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            {/* Play Button */}
            <button
              onClick={togglePlay}
              className={`
                w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full 
                flex items-center justify-center text-white transition-all duration-300 transform
                hover:scale-110 hover:bg-np-orange hover:border-np-orange
                ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}
              `}
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
            <button
              onClick={toggleMute}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors text-white"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
