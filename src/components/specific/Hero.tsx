import { lazy, Suspense, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeroContent } from "../../types/site.ts";
import ErrorBoundary from "../common/ErrorBoundary.tsx";
import TechText from "../common/TechText.tsx";
import "../../styles/Hero.css";

gsap.registerPlugin(useGSAP);

const DitherVeil = lazy(() => import("../common/Dither.tsx"));

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const SCROLL_CUE = {
  max: 1,
  duration: 1.1,
  hold: 0.15,
  origin: "50% 0%",
  ease: "sine.inOut",
} as const;

const NAME_TEXT = {
  fontWeight: 300,
  fontSize: 160,
  letterSpacing: -0.03,
  align: "left",
} as const;

const VISUAL_DITHER = {
  fit: "cover",
  pattern: "floyd",
  pixelSize: 2,
  levels: 2,
  contrast: 1.15,
  revealRadius: 160,
  softness: 0.6,
  linger: 1,
  rim: 0.12,
} as const;

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function readColorToken(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return HEX_COLOR.test(value) ? value : fallback;
}

interface HeroProps {
  content: HeroContent;
}

export default function Hero({ content }: HeroProps) {
  const { meta, name, statement, visual, scrollCue } = content;
  const titleId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLSpanElement>(null);
  const [visualColors] = useState(() => ({
    ink: readColorToken("--void", "#141616"),
    paper: readColorToken("--text", "#f0f0f0"),
    rim: readColorToken("--azure-light", "#4da3ff"),
  }));

  useGSAP(
    () => {
      const cue = cueRef.current;
      const segment = segmentRef.current;
      if (!cue || !segment) return;

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const loop = gsap.fromTo(
          segment,
          { scaleY: gsap.getProperty(segment, "scaleY"), transformOrigin: SCROLL_CUE.origin },
          {
            scaleY: SCROLL_CUE.max,
            duration: SCROLL_CUE.duration,
            ease: SCROLL_CUE.ease,
            repeat: -1,
            yoyo: true,
            repeatDelay: SCROLL_CUE.hold,
          },
        );

        if (!("IntersectionObserver" in window)) return;
        const observer = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) loop.play();
          else loop.pause();
        });
        observer.observe(cue);
        return () => observer.disconnect();
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const availabilityClass = meta.availability.isAvailable
    ? "hero__availability hero__availability--on"
    : "hero__availability";

  return (
    <section ref={rootRef} className="hero" aria-labelledby={titleId}>
      <div className="hero__meta">
        <p className="hero__meta-item hero__meta-item--index">{meta.index}</p>
        <p className="hero__meta-item hero__meta-item--role">{meta.role}</p>
        <p className={`hero__meta-item ${availabilityClass}`}>
          {meta.availability.label}
          <span className="hero__availability-dot" aria-hidden="true" />
        </p>
      </div>

      <h1 id={titleId} className="hero__name">
        <TechText {...NAME_TEXT} className="hero__name-line" text={name.first.toUpperCase()} />{" "}
        <TechText
          {...NAME_TEXT}
          className="hero__name-line hero__name-line--offset"
          text={name.last.toUpperCase()}
        />
      </h1>

      <p className="hero__statement">{statement}</p>

      <div className="hero__visual" role="img" aria-label={visual.alt}>
        <ErrorBoundary
          fallback={<img className="hero__visual-fallback" src={visual.src} alt="" decoding="async" />}
        >
          <Suspense fallback={null}>
            <DitherVeil
              {...VISUAL_DITHER}
              src={visual.src}
              inkColor={visualColors.ink}
              paperColor={visualColors.paper}
              rimColor={visualColors.rim}
              className="hero__visual-canvas"
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div ref={cueRef} className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-label">{scrollCue}</span>
        <span className="hero__scroll-track">
          <span ref={segmentRef} className="hero__scroll-segment" />
        </span>
      </div>
    </section>
  );
}
