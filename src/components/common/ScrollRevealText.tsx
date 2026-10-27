import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ScrollTrigger as ScrollTriggerPlugin } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextPlugin } from "gsap/SplitText";
import "../../styles/ScrollRevealText.css";

gsap.registerPlugin(useGSAP);

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const SCROLL_REVEAL = {
  dim: 0.2,
  start: "top 85%",
  end: "clamp(bottom 60%)",
  catchUp: 0.6,
  stagger: 0.1,
  ease: "none",
  catchUpEase: "power1.out",
} as const;

type ScrollRevealPlugins = {
  ScrollTrigger: typeof ScrollTriggerPlugin;
  SplitText: typeof SplitTextPlugin;
};

let pluginsPromise: Promise<ScrollRevealPlugins> | undefined;

function loadScrollRevealPlugins(): Promise<ScrollRevealPlugins> {
  pluginsPromise ??= Promise.all([import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
    ([{ ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      return { ScrollTrigger, SplitText };
    },
  );
  return pluginsPromise;
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className }: ScrollRevealTextProps) {
  const visualRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const visual = visualRef.current;
      if (!visual) return;

      let cancelled = false;
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;

      void loadScrollRevealPlugins().then(({ ScrollTrigger, SplitText }) => {
        if (cancelled) return;
        mm = gsap.matchMedia();

        mm.add(FULL_MOTION, () => {
          let reached = 0;
          let reveal: ReturnType<typeof gsap.fromTo> | undefined;

          const split = SplitText.create(visual, {
            type: "words",
            tag: "span",
            aria: "none",
            autoSplit: true,
            onSplit: (self) => {
              reveal = gsap.fromTo(
                self.words,
                { opacity: SCROLL_REVEAL.dim },
                { opacity: 1, ease: SCROLL_REVEAL.ease, stagger: SCROLL_REVEAL.stagger, paused: true },
              );
              reveal.progress(reached);
              return reveal;
            },
          });

          const advance = (trigger: ScrollTrigger) => {
            if (trigger.progress <= reached) return;
            reached = trigger.progress;
            if (reveal) {
              gsap.to(reveal, {
                progress: reached,
                duration: SCROLL_REVEAL.catchUp,
                ease: SCROLL_REVEAL.catchUpEase,
                overwrite: true,
              });
            }
            if (reached >= 1) trigger.kill();
          };

          const trigger = ScrollTrigger.create({
            trigger: visual,
            start: SCROLL_REVEAL.start,
            end: SCROLL_REVEAL.end,
            onUpdate: advance,
            onRefresh: advance,
          });
          advance(trigger);

          return () => {
            trigger.kill();
            split.revert();
          };
        });
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: visualRef, dependencies: [text] },
  );

  return (
    <p key={text} className={className}>
      <span className="scroll-reveal-text__sr-only">{text}</span>
      <span ref={visualRef} aria-hidden="true">
        {text}
      </span>
    </p>
  );
}
