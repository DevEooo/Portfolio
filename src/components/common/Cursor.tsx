import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CURSOR_LABEL_ATTRIBUTE, CURSOR_PROJECT_SELECTOR } from "./cursorTarget.ts";
import "../../styles/Cursor.css";

gsap.registerPlugin(useGSAP);

const CURSOR_HTML_CLASS = "has-custom-cursor";

const MEDIA = {
  finePointer: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

const NATIVE_CURSOR_TARGETS = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

const CURSOR_MOTION = {
  follow: 0.35,
  followEase: "power3.out",
  fade: 0.2,
  press: { dot: 0.7, trail: 0.88, duration: 0.18, ease: "power2.out" },
} as const;

const PROJECT_BADGE = {
  size: 116,
  gap: 6,
  fontSize: 9.9,
  separator: "•",
  turn: 12,
  enter: { duration: 0.45, ease: "expo.out" },
  leaveSpeed: 1.5,
  text: { delay: 0.08, from: 0.7 },
  arrowTurn: 45,
} as const;

const BADGE_GEOMETRY = (() => {
  const half = PROJECT_BADGE.size / 2;
  const textRadius = half - PROJECT_BADGE.fontSize * 1.05;
  const discRadius = textRadius - PROJECT_BADGE.gap;
  return {
    half,
    textRadius,
    discRadius,
    circumference: 2 * Math.PI * textRadius,
    path: `M 0 ${-textRadius} A ${textRadius} ${textRadius} 0 1 1 0 ${textRadius} A ${textRadius} ${textRadius} 0 1 1 0 ${-textRadius}`,
  };
})();

const BADGE_SHOW_DURATION = 0.01;

const SVG_NS = "http://www.w3.org/2000/svg";
const FALLBACK_CHAR_WIDTH = 0.62;

function writeRingText(textPath: SVGTextPathElement, measure: SVGTextElement, label: string): void {
  const name = label.trim().toUpperCase();
  const spacer = "  ";
  const unit = `${name}${spacer}${PROJECT_BADGE.separator}${spacer}`;

  measure.textContent = unit;
  const measured = typeof measure.getComputedTextLength === "function" ? measure.getComputedTextLength() : 0;
  const unitLength = measured || unit.length * PROJECT_BADGE.fontSize * FALLBACK_CHAR_WIDTH;
  const repeats = Math.max(1, Math.round(BADGE_GEOMETRY.circumference / unitLength));

  textPath.replaceChildren();
  for (let i = 0; i < repeats; i += 1) {
    const separator = document.createElementNS(SVG_NS, "tspan");
    separator.setAttribute("class", "cursor__badge-separator");
    separator.textContent = PROJECT_BADGE.separator;
    textPath.append(`${name}${spacer}`, separator, spacer);
  }
}

function arrowPath(discRadius: number): string {
  const a = discRadius * 0.36;
  const head = a * 0.9;
  const tip = a.toFixed(2);
  return `M ${(-a).toFixed(2)} ${tip} L ${tip} ${(-a).toFixed(2)} M ${(a - head).toFixed(2)} ${(-a).toFixed(2)} H ${tip} V ${(-a + head).toFixed(2)}`;
}

type Setter = (value: number) => void;

export default function Cursor() {
  const pathId = `cursor-badge-path-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const discRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const dot = dotRef.current;
      const trail = trailRef.current;
      const ring = ringRef.current;
      const badge = badgeRef.current;
      const name = nameRef.current;
      const disc = discRef.current;
      const arrow = arrowRef.current;
      const textPath = textPathRef.current;
      const measure = measureRef.current;
      if (!root || !dot || !trail || !ring || !badge || !name || !disc || !arrow || !textPath || !measure) return;

      const mm = gsap.matchMedia();

      mm.add({ fine: MEDIA.finePointer, reduce: MEDIA.reducedMotion }, (context) => {
        const fine = context.conditions?.fine === true;
        const reduce = context.conditions?.reduce === true;
        if (!fine) return;

        const html = document.documentElement;
        html.classList.add(CURSOR_HTML_CLASS);

        gsap.set([dot, ring, badge], { xPercent: -50, yPercent: -50 });
        gsap.set([root, badge], { autoAlpha: 0 });

        const dotX: Setter = gsap.quickSetter(dot, "x", "px") as Setter;
        const dotY: Setter = gsap.quickSetter(dot, "y", "px") as Setter;
        const trailX: Setter = reduce
          ? (gsap.quickSetter(trail, "x", "px") as Setter)
          : gsap.quickTo(trail, "x", { duration: CURSOR_MOTION.follow, ease: CURSOR_MOTION.followEase });
        const trailY: Setter = reduce
          ? (gsap.quickSetter(trail, "y", "px") as Setter)
          : gsap.quickTo(trail, "y", { duration: CURSOR_MOTION.follow, ease: CURSOR_MOTION.followEase });
        const tweenTime = (seconds: number): number => (reduce ? 0 : seconds);

        const badgeSize = badge.offsetWidth || PROJECT_BADGE.size;
        const unitsToPx = badgeSize / PROJECT_BADGE.size;
        const ringSize = ring.offsetWidth || 1;
        const dotSize = dot.offsetWidth || 1;
        const discSize = BADGE_GEOMETRY.discRadius * 2 * unitsToPx;
        const ringOpenScale = (BADGE_GEOMETRY.textRadius * 2 * unitsToPx) / ringSize;

        const badgeTimeline = gsap
          .timeline({ paused: true, defaults: PROJECT_BADGE.enter })
          .fromTo(badge, { autoAlpha: 0 }, { autoAlpha: 1, duration: BADGE_SHOW_DURATION }, 0)
          .to(dot, { autoAlpha: 0, duration: tweenTime(CURSOR_MOTION.fade) }, 0)
          .to(ring, { scale: ringOpenScale, autoAlpha: 0 }, 0)
          .fromTo(disc, { scale: dotSize / discSize }, { scale: 1 }, 0)
          .fromTo(arrow, { rotation: PROJECT_BADGE.arrowTurn }, { rotation: 0 }, 0)
          .fromTo(
            name,
            { autoAlpha: 0, scale: PROJECT_BADGE.text.from },
            { autoAlpha: 1, scale: 1 },
            PROJECT_BADGE.text.delay,
          );
        const spin = gsap.to(name, { rotation: 360, duration: PROJECT_BADGE.turn, ease: "none", repeat: -1, paused: true });
        badgeTimeline.eventCallback("onReverseComplete", () => spin.pause());

        let activeProject: Element | null = null;
        const setProject = (project: Element | null): void => {
          if (project === activeProject) return;
          activeProject = project;

          if (project) {
            writeRingText(textPath, measure, project.getAttribute(CURSOR_LABEL_ATTRIBUTE) ?? "");
            if (reduce) {
              badgeTimeline.progress(1);
            } else {
              spin.play();
              badgeTimeline.timeScale(1).play();
            }
          } else if (reduce) {
            badgeTimeline.progress(0);
          } else {
            badgeTimeline.timeScale(PROJECT_BADGE.leaveSpeed).reverse();
          }
        };
        const projectAt = (target: EventTarget | null): Element | null =>
          target instanceof Element ? target.closest(CURSOR_PROJECT_SELECTOR) : null;

        let hasPosition = false;
        let isShown = false;
        let lastX = 0;
        let lastY = 0;

        const show = (visible: boolean): void => {
          if (visible === isShown) return;
          isShown = visible;
          gsap.to(root, { autoAlpha: visible ? 1 : 0, duration: tweenTime(CURSOR_MOTION.fade), overwrite: true });
        };

        const onMove = (event: PointerEvent): void => {
          if (event.pointerType === "touch") return;
          const { clientX: x, clientY: y } = event;
          lastX = x;
          lastY = y;

          dotX(x);
          dotY(y);
          if (!hasPosition) {
            gsap.set(trail, { x, y });
            hasPosition = true;
          }
          trailX(x);
          trailY(y);

          const overField = event.target instanceof Element && event.target.closest(NATIVE_CURSOR_TARGETS) !== null;
          show(!overField);
          setProject(overField ? null : projectAt(event.target));
        };

        const onScroll = (): void => {
          if (!hasPosition || typeof document.elementFromPoint !== "function") return;
          setProject(projectAt(document.elementFromPoint(lastX, lastY)));
        };

        const press = (isDown: boolean): void => {
          const { dot: dotScale, trail: trailScale, duration, ease } = CURSOR_MOTION.press;
          gsap.to(dot, { scale: isDown ? dotScale : 1, duration: tweenTime(duration), ease, overwrite: "auto" });
          gsap.to(trail, { scale: isDown ? trailScale : 1, duration: tweenTime(duration), ease, overwrite: "auto" });
        };
        const onDown = (event: PointerEvent): void => {
          if (event.pointerType !== "touch") press(true);
        };
        const onUp = (): void => press(false);
        const onLeave = (): void => show(false);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("blur", onLeave);
        html.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("blur", onLeave);
          html.removeEventListener("pointerleave", onLeave);
          html.classList.remove(CURSOR_HTML_CLASS);
          textPath.replaceChildren();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const { half, discRadius } = BADGE_GEOMETRY;
  const viewBox = `${-half} ${-half} ${PROJECT_BADGE.size} ${PROJECT_BADGE.size}`;

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span ref={trailRef} className="cursor__trail">
        <span ref={ringRef} className="cursor__ring" />
        <span ref={badgeRef} className="cursor__badge">
          <span ref={nameRef} className="cursor__badge-layer">
            <svg className="cursor__badge-svg" viewBox={viewBox} focusable="false">
              <defs>
                <path id={pathId} d={BADGE_GEOMETRY.path} />
              </defs>
              <text className="cursor__badge-name" fontSize={PROJECT_BADGE.fontSize}>
                <textPath
                  ref={textPathRef}
                  href={`#${pathId}`}
                  textLength={BADGE_GEOMETRY.circumference}
                  lengthAdjust="spacing"
                />
              </text>
              <text ref={measureRef} className="cursor__badge-name cursor__badge-measure" fontSize={PROJECT_BADGE.fontSize} />
            </svg>
          </span>
          <span ref={discRef} className="cursor__badge-layer">
            <svg className="cursor__badge-svg" viewBox={viewBox} focusable="false">
              <circle className="cursor__badge-disc" r={discRadius} />
            </svg>
            <span ref={arrowRef} className="cursor__badge-layer">
              <svg className="cursor__badge-svg" viewBox={viewBox} focusable="false">
                <path className="cursor__badge-arrow" d={arrowPath(discRadius)} />
              </svg>
            </span>
          </span>
        </span>
      </span>
      <span ref={dotRef} className="cursor__dot" />
    </div>
  );
}
