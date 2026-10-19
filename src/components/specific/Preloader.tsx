import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "../../styles/Preloader.css";

gsap.registerPlugin(useGSAP);

export type PreloaderContent = {
  identity: readonly string[];
  status: { loading: string; ready: string };
  srLabel: string;
};

interface PreloaderProps {
  content: PreloaderContent;
  onComplete: () => void;
  ready?: boolean;
  storageKey?: string;
}

export const PRELOADER_STORAGE_KEY = "hp:preloader-seen";
export const PRELOADER_HTML_CLASS = "is-preloading";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const MOTION = {
  dotIn: 0.15,
  minLoad: 0.5,
  maxLoad: 1.2,
  softCap: 0.9,
  pollInterval: 0.1,
  settle: 0.25,
  readyHold: 0.15,
  exit: 0.3,
  exitStagger: 0.05,
  exitShift: 12,
  rotate: 0.45,
  rotateOverlap: 0.15,
  wipe: 0.5,
  wipeOverlap: 0.1,
  overscan: 1.05,
  skipTimeScale: 4,
  ease: {
    creep: "power2.out",
    settle: "power2.out",
    exit: "power2.out",
    transition: "power4.inOut",
  },
} as const;

function hasSeen(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markSeen(key: string): void {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {}
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches;
}

function formatPercent(fraction: number): string {
  return String(Math.round(fraction * 100)).padStart(3, "0");
}

export default function Preloader({
  content,
  onComplete,
  ready = true,
  storageKey = PRELOADER_STORAGE_KEY,
}: PreloaderProps) {
  const [shouldShow] = useState(() => !hasSeen(storageKey) && !prefersReducedMotion());
  const [isLoaded, setIsLoaded] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const identityRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const readyRef = useRef(ready);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    readyRef.current = ready;
    onCompleteRef.current = onComplete;
  }, [ready, onComplete]);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    markSeen(storageKey);
    document.documentElement.classList.remove(PRELOADER_HTML_CLASS);
    onCompleteRef.current();
  }, [storageKey]);

  useEffect(() => {
    if (!shouldShow) complete();
  }, [shouldShow, complete]);

  useEffect(() => {
    if (!shouldShow) return;
    const html = document.documentElement;
    html.classList.add(PRELOADER_HTML_CLASS);
    return () => html.classList.remove(PRELOADER_HTML_CLASS);
  }, [shouldShow]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = lineRef.current;
      const counter = counterRef.current;
      const identity = identityRef.current;
      const status = statusRef.current;
      if (!shouldShow || !root || !line || !counter || !identity || !status) return;

      const mm = gsap.matchMedia();

      mm.add(REDUCED_MOTION, () => {
        complete();
      });

      mm.add(FULL_MOTION, () => {
        const fontSet: FontFaceSet | undefined = document.fonts;
        let fontsReady = !fontSet;
        void fontSet?.ready.then(() => {
          fontsReady = true;
        });

        const thickness = line.offsetHeight || 1;
        const startScale = thickness / (line.offsetWidth || thickness);
        const progress = { value: 0 };
        const setLineScale = gsap.quickSetter(line, "scaleX");
        let speed = 1;
        let settled = false;
        let exitTimeline: ReturnType<typeof gsap.timeline> | undefined;

        const render = (): void => {
          setLineScale(startScale + (1 - startScale) * progress.value);
          counter.textContent = formatPercent(progress.value);
        };

        gsap.set(line, { scaleX: startScale, scaleY: 1, rotation: 0, transformOrigin: "50% 50%" });
        render();
        gsap.from(line, { opacity: 0, duration: MOTION.dotIn, ease: MOTION.ease.exit });

        const creep = gsap.to(progress, {
          value: MOTION.softCap,
          duration: MOTION.maxLoad,
          delay: MOTION.dotIn,
          ease: MOTION.ease.creep,
          onUpdate: render,
        });

        const isReady = (): boolean => readyRef.current && fontsReady;

        const check = (): void => {
          if (isReady()) settle();
          else poll = gsap.delayedCall(MOTION.pollInterval, check);
        };

        const settle = (): void => {
          if (settled) return;
          settled = true;
          creep.kill();
          poll.kill();
          cap.kill();
          gsap
            .to(progress, {
              value: 1,
              duration: MOTION.settle,
              ease: MOTION.ease.settle,
              onUpdate: render,
              onComplete: () => {
                setIsLoaded(true);
                playExit();
              },
            })
            .timeScale(speed);
        };

        const playExit = (): void => {
          const coverScale = Math.max(1, root.clientHeight / (line.offsetWidth || 1)) * MOTION.overscan;
          const wipeScale = (root.clientWidth / thickness) * MOTION.overscan;

          exitTimeline = gsap
            .timeline({ delay: MOTION.readyHold, onComplete: () => complete() })
            .to(counter, {
              y: -MOTION.exitShift,
              opacity: 0,
              duration: MOTION.exit,
              ease: MOTION.ease.exit,
            })
            .to(
              [identity, status],
              {
                y: MOTION.exitShift,
                opacity: 0,
                duration: MOTION.exit,
                stagger: MOTION.exitStagger,
                ease: MOTION.ease.exit,
              },
              `<${MOTION.exitStagger}`,
            )
            .to(
              line,
              { rotation: 90, scaleX: coverScale, duration: MOTION.rotate, ease: MOTION.ease.transition },
              `-=${MOTION.rotateOverlap}`,
            )
            .to(
              line,
              { scaleY: wipeScale, duration: MOTION.wipe, ease: MOTION.ease.transition },
              `-=${MOTION.wipeOverlap}`,
            )
            .timeScale(speed);
        };

        let poll = gsap.delayedCall(MOTION.dotIn + MOTION.minLoad, check);
        const cap = gsap.delayedCall(MOTION.dotIn + MOTION.maxLoad, settle);

        const skip = (): void => {
          speed = MOTION.skipTimeScale;
          settle();
          gsap.getTweensOf(progress).forEach((tween) => tween.timeScale(speed));
          exitTimeline?.timeScale(speed);
        };

        window.addEventListener("keydown", skip, { once: true });
        root.addEventListener("pointerdown", skip, { once: true });

        return () => {
          window.removeEventListener("keydown", skip);
          root.removeEventListener("pointerdown", skip);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [shouldShow, complete] },
  );

  if (!shouldShow) return null;

  return (
    <div ref={rootRef} className="preloader">
      <p role="status" className="preloader-sr-only">
        {content.srLabel}
      </p>
      <div aria-hidden="true" className="preloader-stage">
        <div className="preloader-counter-wrap">
          <span ref={counterRef} className="preloader-counter" />
        </div>
        <div ref={lineRef} className="preloader-line" />
        <div className="preloader-footer">
          <p ref={identityRef} className="preloader-identity">
            {content.identity.map((line) => (
              <span key={line} className="preloader-identity-line">
                {line}
              </span>
            ))}
          </p>
          <p ref={statusRef} className="preloader-status">
            {isLoaded ? content.status.ready : content.status.loading}
          </p>
        </div>
      </div>
    </div>
  );
}
