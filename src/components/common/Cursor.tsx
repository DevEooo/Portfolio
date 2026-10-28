import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
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
  press: { dot: 0.7, ring: 0.85, duration: 0.18, ease: "power2.out" },
} as const;

type Setter = (value: number) => void;

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!root || !dot || !ring) return;

      const mm = gsap.matchMedia();

      mm.add({ fine: MEDIA.finePointer, reduce: MEDIA.reducedMotion }, (context) => {
        const fine = context.conditions?.fine === true;
        const reduce = context.conditions?.reduce === true;
        if (!fine) return;

        const html = document.documentElement;
        html.classList.add(CURSOR_HTML_CLASS);

        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
        gsap.set(root, { autoAlpha: 0 });

        const dotX: Setter = gsap.quickSetter(dot, "x", "px") as Setter;
        const dotY: Setter = gsap.quickSetter(dot, "y", "px") as Setter;
        const ringX: Setter = reduce
          ? (gsap.quickSetter(ring, "x", "px") as Setter)
          : gsap.quickTo(ring, "x", { duration: CURSOR_MOTION.follow, ease: CURSOR_MOTION.followEase });
        const ringY: Setter = reduce
          ? (gsap.quickSetter(ring, "y", "px") as Setter)
          : gsap.quickTo(ring, "y", { duration: CURSOR_MOTION.follow, ease: CURSOR_MOTION.followEase });
        const tweenTime = (seconds: number): number => (reduce ? 0 : seconds);

        let hasPosition = false;
        let isShown = false;

        const show = (visible: boolean): void => {
          if (visible === isShown) return;
          isShown = visible;
          gsap.to(root, { autoAlpha: visible ? 1 : 0, duration: tweenTime(CURSOR_MOTION.fade), overwrite: true });
        };

        const onMove = (event: PointerEvent): void => {
          if (event.pointerType === "touch") return;
          const { clientX: x, clientY: y } = event;

          dotX(x);
          dotY(y);
          if (!hasPosition) {
            gsap.set(ring, { x, y });
            hasPosition = true;
          }
          ringX(x);
          ringY(y);

          const overField = event.target instanceof Element && event.target.closest(NATIVE_CURSOR_TARGETS) !== null;
          show(!overField);
        };

        const press = (isDown: boolean): void => {
          const { dot: dotScale, ring: ringScale, duration, ease } = CURSOR_MOTION.press;
          gsap.to(dot, { scale: isDown ? dotScale : 1, duration: tweenTime(duration), ease, overwrite: "auto" });
          gsap.to(ring, { scale: isDown ? ringScale : 1, duration: tweenTime(duration), ease, overwrite: "auto" });
        };
        const onDown = (event: PointerEvent): void => {
          if (event.pointerType !== "touch") press(true);
        };
        const onUp = (): void => press(false);
        const onLeave = (): void => show(false);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("blur", onLeave);
        html.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("blur", onLeave);
          html.removeEventListener("pointerleave", onLeave);
          html.classList.remove(CURSOR_HTML_CLASS);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <span ref={ringRef} className="cursor__ring" />
      <span ref={dotRef} className="cursor__dot" />
    </div>
  );
}
