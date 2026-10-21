import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeroContent } from "../../types/site.ts";
import "../../styles/Hero.css";

gsap.registerPlugin(useGSAP);

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Scroll-cue loop: a short pulse, then a long draw. Each one draws down from the top
 * and retracts downward, so the line keeps pointing the way to scroll.
 * Durations in seconds; `short` is a fraction of the track length.
 */
const SCROLL_CUE = {
  short: 0.35,
  drawShort: 0.45,
  retractShort: 0.4,
  beat: 0.2,
  drawLong: 0.8,
  retractLong: 0.6,
  rest: 0.7,
  origin: "50% 0%",
  ease: {
    drawShort: "power2.out",
    drawLong: "power3.inOut",
    retract: "power2.in",
  },
} as const;

interface HeroProps {
  content: HeroContent;
}

export default function Hero({ content }: HeroProps) {
  const { meta, name, statement, cta, visual, scrollCue } = content;
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

      // Reduced motion: no loop. The CSS rest pose (a short static line) stays.
      mm.add(FULL_MOTION, () => {
        const loop = gsap
          .timeline({ repeat: -1, repeatDelay: SCROLL_CUE.rest, defaults: { transformOrigin: SCROLL_CUE.origin } })
          .set(segment, { yPercent: 0, scaleY: 0 })
          .to(segment, { scaleY: SCROLL_CUE.short, duration: SCROLL_CUE.drawShort, ease: SCROLL_CUE.ease.drawShort })
          .to(segment, { yPercent: 100, scaleY: 0, duration: SCROLL_CUE.retractShort, ease: SCROLL_CUE.ease.retract })
          .set(segment, { yPercent: 0, scaleY: 0 }, `+=${SCROLL_CUE.beat}`)
          .to(segment, { scaleY: 1, duration: SCROLL_CUE.drawLong, ease: SCROLL_CUE.ease.drawLong })
          .to(segment, { yPercent: 100, scaleY: 0, duration: SCROLL_CUE.retractLong, ease: SCROLL_CUE.ease.retract });

        // Only loop while the cue is on screen (it is also display:none on small screens).
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

      <div className="hero__intro">
        <p className="hero__statement">{statement}</p>
        <a className="hero__cta" href={cta.href}>
          <span>{cta.label}</span>
          <svg className="hero__cta-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>

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
