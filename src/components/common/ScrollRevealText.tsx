import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { SplitText as SplitTextPlugin } from "gsap/SplitText";
import "../../styles/ScrollRevealText.css";

gsap.registerPlugin(useGSAP);

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const SCROLL_REVEAL = {
  dim: 0.2,
  start: "top 85%",
  end: "clamp(bottom 60%)",
  scrub: 0.6,
  stagger: 0.1,
  ease: "none",
} as const;

type ScrollRevealPlugins = { SplitText: typeof SplitTextPlugin };

let pluginsPromise: Promise<ScrollRevealPlugins> | undefined;

function loadScrollRevealPlugins(): Promise<ScrollRevealPlugins> {
  pluginsPromise ??= Promise.all([import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
    ([{ ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      return { SplitText };
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

      void loadScrollRevealPlugins().then(({ SplitText }) => {
        if (cancelled) return;
        mm = gsap.matchMedia();

        mm.add(FULL_MOTION, () => {
          const split = SplitText.create(visual, {
            type: "words",
            tag: "span",
            aria: "none",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: SCROLL_REVEAL.dim },
                {
                  opacity: 1,
                  ease: SCROLL_REVEAL.ease,
                  stagger: SCROLL_REVEAL.stagger,
                  scrollTrigger: {
                    trigger: visual,
                    start: SCROLL_REVEAL.start,
                    end: SCROLL_REVEAL.end,
                    scrub: SCROLL_REVEAL.scrub,
                  },
                },
              ),
          });

          return () => split.revert();
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
