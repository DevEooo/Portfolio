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

const HERO_INTRO = {
  name: { at: 0, from: 110, duration: 1.1, stagger: 0.1, ease: "expo.out" },
  fade: { y: 16, duration: 0.8, ease: "power3.out" },
  metaAt: 0.2,
  metaStagger: 0.06,
  statementAt: 0.3,
  shutter: { at: 0.25, duration: 0.9, ease: "power3.inOut" },
  cueAt: 0.7,
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
  revealed?: boolean;
}

export default function Hero({ content, revealed = true }: HeroProps) {
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
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const nameText = q(".hero__name-text");
        const metaItems = q(".hero__meta-item");
        const statement = q(".hero__statement");
        const visualBox = q(".hero__visual");
        const shutterStart = q(".hero__visual-shutter--start");
        const shutterEnd = q(".hero__visual-shutter--end");
        const cue = q(".hero__scroll");

        if (!revealed) {
          gsap.set(nameText, { yPercent: HERO_INTRO.name.from });
          gsap.set([...metaItems, ...statement, ...cue], { opacity: 0 });
          gsap.set([...shutterStart, ...shutterEnd], { x: 0, xPercent: 0 });
          gsap.set(visualBox, { visibility: "hidden" });
          return;
        }

        const { name: nameIntro, fade, shutter } = HERO_INTRO;
        gsap
          .timeline()
          .set(visualBox, { visibility: "visible" }, 0)
          .fromTo(
            nameText,
            { yPercent: nameIntro.from },
            { yPercent: 0, duration: nameIntro.duration, stagger: nameIntro.stagger, ease: nameIntro.ease },
            nameIntro.at,
          )
          .fromTo(
            metaItems,
            { opacity: 0, y: fade.y },
            { opacity: 1, y: 0, duration: fade.duration, stagger: HERO_INTRO.metaStagger, ease: fade.ease },
            HERO_INTRO.metaAt,
          )
          .fromTo(
            statement,
            { opacity: 0, y: fade.y },
            { opacity: 1, y: 0, duration: fade.duration, ease: fade.ease },
            HERO_INTRO.statementAt,
          )
          .fromTo(
            shutterStart,
            { x: 0, xPercent: 0 },
            { xPercent: -100, duration: shutter.duration, ease: shutter.ease },
            shutter.at,
          )
          .fromTo(
            shutterEnd,
            { x: 0, xPercent: 0 },
            { xPercent: 100, duration: shutter.duration, ease: shutter.ease },
            shutter.at,
          )
          .fromTo(cue, { opacity: 0 }, { opacity: 1, duration: fade.duration, ease: fade.ease }, HERO_INTRO.cueAt);
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [revealed] },
  );

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
        <span className="hero__name-line">
          <TechText {...NAME_TEXT} className="hero__name-text" text={name.first.toUpperCase()} />
        </span>{" "}
        <span className="hero__name-line hero__name-line--offset">
          <TechText {...NAME_TEXT} className="hero__name-text" text={name.last.toUpperCase()} />
        </span>
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
        <span className="hero__visual-shutter hero__visual-shutter--start" aria-hidden="true" />
        <span className="hero__visual-shutter hero__visual-shutter--end" aria-hidden="true" />
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
