"use client"

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  const container = useRef(null);
  const badgeRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Initial fade-in of images
    tl.from('.image-item', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
    });

    // 2. Text Reveal
    tl.from(
      '.content-reveal',
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      },
      '-=0.5' // Overlap with image animation
    );

    // 3. Rotate the "25 Years" badge continuously
    gsap.to(badgeRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'linear',
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      className="w-full min-h-screen bg-[#050505] text-white py-20 px-6 md:px-12 lg:px-24 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT: Image Grid & Badge */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {/* Tall Left Image */}
            <div className="image-item row-span-2 relative overflow-hidden rounded-2xl h-[400px] lg:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=1974&auto=format&fit=crop"
                alt="Man working"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Top Right Image */}
            <div className="image-item relative overflow-hidden rounded-2xl h-[190px] lg:h-[240px]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Team meeting"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Bottom Right Image */}
            <div className="image-item relative overflow-hidden rounded-2xl h-[190px] lg:h-[240px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Colleagues discussing"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Floating Badge (25 Years) */}
          <div className="absolute -bottom-10 -left-10 md:bottom-10 md:-left-12 z-20 content-reveal">
            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-[#1a1a1a] rounded-full border-4 border-[#050505] flex items-center justify-center shadow-2xl">
              {/* Rotating Text Ring */}
              <div ref={badgeRef} className="absolute inset-0 w-full h-full animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <path
                    id="textPath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text fontSize="11.5" fontWeight="bold" letterSpacing="2px">
                    <textPath href="#textPath" startOffset="0%">
                      • 25 YEARS OF EXPERIENCE •
                    </textPath>
                  </text>
                </svg>
              </div>
              {/* Center Number */}
              <div className="bg-np-orange w-16 h-16 rounded-full flex items-center justify-center text-[#050505] font-black text-2xl z-10">
                25
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="space-y-8">

          {/* Label */}
          <div className="content-reveal flex items-center gap-2 text-np-orange font-bold tracking-widest text-sm uppercase">
            <span className="w-2 h-2 rounded-full bg-np-orange"></span>
            Who We Are
          </div>

          {/* Headline */}
          <h2 className="content-reveal text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Redefining The World For <span className="italic text-np-orange font-serif pr-2">A</span> <br />
            Better Tomorrow
          </h2>

          {/* Description */}
          <p className="content-reveal text-gray-400 text-lg leading-relaxed max-w-lg">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
          </p>

          {/* Feature Box */}
          <div className="content-reveal relative bg-[#121212] p-6 rounded-r-xl border-l-4 border-np-orange">
            <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed">
              We combine cutting-edge AI with simple design to help businesses of <span className="text-white font-bold underline decoration-np-orange underline-offset-4">all sizes</span>. The result? Smarter conversations, happier customers, and opportunities for growth.
            </p>
          </div>

          {/* CTA Button */}
          <div className="content-reveal pt-4">
            <button className="group relative px-8 py-4 bg-np-orange text-white font-bold flex items-center gap-3 overflow-hidden transition-all hover:bg-black hover:shadow-[0_0_20px_rgba(180,255,57,0.4)]">
              <span className="relative z-10">Discover More</span>
              <div className="relative z-10 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </div>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}