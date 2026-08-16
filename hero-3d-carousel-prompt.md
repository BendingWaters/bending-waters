# Agent Prompt: 3D Fanned Carousel Hero Section

Paste this into Claude Code inside your project.

---

## Context

Build a hero section for the top of the homepage: a headline over a **3D fanned card carousel** — a row of cards arranged like a slightly-opened deck, each one rotated in 3D so the whole row curves away from the viewer on both sides, with the center card facing forward. Reference feel: Bending Spoons' hero ("We acquire and improve iconic products").

## Step 0 — Audit first (do this before writing any code)

1. Read the existing project structure: components, existing Tailwind config/theme tokens, existing GSAP usage patterns if any, and any design tokens file.
2. Check what image/logo assets already exist in the repo (e.g. `/public`, `/assets`). List what's usable for the carousel cards.
3. If there are fewer than 6–8 usable video clips, do NOT invent external URLs. Instead build the component against a `cards` data array of placeholders (solid color block + label, with a `poster`/`video` field left empty), and generate an `ASSETS_NEEDED.md` listing exactly what clips are needed (aspect ratio, count, suggested subject/duration, e.g. "3–6s silent loop") for client handoff.
4. Confirm animation library: use the already-installed GSAP (`@gsap/react`, `useGSAP` hook, `gsap.context()` for cleanup) — do not add a second animation library.
5. Report the audit findings back before writing the component.

## Layout spec

- Full-bleed dark section (near-black background), headline centered at top, carousel beneath it, slightly overflowing/cropped at the section edges left and right (cards partially fall off-screen).
- Headline: two lines, centered.
  - Line 1: **"Impossible is"**
  - Line 2: **"nothing"** — directly beneath line 1, same centered alignment.
  - Style the phrase with a mixed-weight treatment (e.g. "Impossible is" in a heavier/upright weight, "nothing" in an italic or lighter accent weight/color) — don't just render both lines identically; give the line break visual purpose, similar to how the reference alternates roman and italic within a line.
- Carousel: a horizontal row of 6–8 cards (portrait aspect ratio, rounded corners, ~2:3 or 3:4 ratio).
  - Cards are NOT flat in a row — each card is rotated around the Y-axis based on its distance from the center card, so the row reads as a shallow arc/fan in 3D space (like pages fanned open, or a curved wall of screens).
  - Center card(s): little to no rotation, largest apparent size, front-facing.
  - Cards further from center: increasing `rotateY`, increasing horizontal offset, slightly reduced scale and opacity, so they recede.
  - Use CSS 3D transforms (`perspective` on the parent, `transform-style: preserve-3d`, `rotateY`, `translateZ`/`translateX` per card) — this is a CSS/DOM 3D layout, not a WebGL/Three.js scene.
  - Each card shows one looping video (or the placeholder) filling the card, cover-fit.

## Video handling (important — this is the part that differs from a static-image carousel)

- Each `<video>`: `muted`, `autoPlay`, `loop`, `playsInline`, `preload="metadata"`, and a `poster` image (a frame grab or brand-color fallback) so the card isn't blank while the video loads.
- **Only autoplay what's actually visible/near-center.** With 6–8 videos rendered at once, don't let all of them play simultaneously off-screen — use an `IntersectionObserver` (or simple index-distance-from-center check) to `play()` cards within/near the visible arc and `pause()` the ones rotated far to the edges or clipped off-screen. This matters both for performance and for mobile data usage.
- Keep clips short and lightweight (agent should assume ~3–6s loops, silent, compressed/H.264 mp4 or WebM) — note this expectation in `ASSETS_NEEDED.md` rather than trying to transcode anything.
- On mobile, consider not autoplaying every visible card at once if the device is lower-powered — a `matchMedia`/reduced-data check is a reasonable fallback, falling back to the poster frame as a static image.
- Respect `prefers-reduced-motion` for the video layer too: if set, don't autoplay — show the poster frame only.

## Animation spec (GSAP)

Use `useGSAP` + `gsap.context()` scoped to the section ref for automatic cleanup.

1. **Entrance sequence (on mount / on scroll into view via ScrollTrigger)**:
   - Headline: split into the two lines, fade + slight y-offset in, staggered (line 1 then line 2, ~0.1s stagger).
   - Cards: animate in from a flattened/collapsed state (e.g. all starting near `rotateY: 0`, `scale: 0.8`, stacked closer together) into their final fanned resting rotation/position, staggered outward from the center card to the edges (`stagger: { each: 0.06, from: "center" }`). Use an `power3.out` or similar ease, duration ~0.9–1.2s.
2. **Ambient/idle micro-motion (optional, subtle)**: a very slow continuous drift — e.g. the whole carousel group gently rotating a couple degrees back and forth on a long `yoyo` timeline — to keep the hero feeling alive without being distracting. Keep amplitude small.
3. **Mouse-parallax (optional but recommended)**: on mousemove over the section, nudge the carousel's overall rotation/perspective slightly toward the cursor position (a few degrees max), using `gsap.quickTo` for performant tracking. Reset smoothly on mouse leave.
4. Respect `prefers-reduced-motion`: if set, skip the entrance stagger (just fade in) and disable ambient/parallax motion entirely.

## Technical requirements

- Component should be self-contained (e.g. `HeroCarousel.tsx`), typed props for the `cards` data array (`{ id, videoSrc, poster, label }`) so real clips can be swapped in later without touching animation logic.
- Fully responsive: on mobile, reduce visible card count (e.g. show 4–5 instead of 8) and reduce the rotation spread so cards don't clip off-screen awkwardly; headline scales down proportionally.
- No layout shift — reserve carousel height before animation runs.
- Clean up all GSAP animations/ScrollTriggers on unmount.

## Deliverable

- The component wired into the page where the hero currently lives.
- If placeholders were used for cards, also output `ASSETS_NEEDED.md` in the project root describing exactly what real video clips are needed (count, aspect ratio, rough duration, format).
