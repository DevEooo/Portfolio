import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeroContent } from "../../types/site.ts";
import "../../styles/Hero.css";

gsap.registerPlugin(useGSAP);

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const SCROLL_CUE = {
  max: 1,
  duration: 1.1,
  hold: 0.15,
  origin: "50% 0%",
  ease: "sine.inOut",
} as const;

interface HeroProps {
  content: HeroContent;
}

export default function Hero({ content }: HeroProps) {
  const { meta, name, statement, visual, scrollCue } = content;
  const titleId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef<HTMLSpanElement>(null);

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
        <span className="hero__name-line">{name.first}</span>{" "}
        <span className="hero__name-line hero__name-line--offset">{name.last}</span>
      </h1>

      <p className="hero__statement">{statement}</p>

      <div className="hero__visual" aria-hidden="true">
        <span className="hero__visual-placeholder">{visual.placeholder}</span>
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
