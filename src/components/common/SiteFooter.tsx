import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { SiteFooterContent } from "../../types/site.ts";
import { WORDMARK } from "./wordmark.ts";
import "../../styles/SiteFooter.css";

gsap.registerPlugin(useGSAP);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const COPY_RESET_MS = 2000;

const FOOTER_REVEAL = {
  start: "top 90%",
  letter: { from: 100, duration: 0.9, stagger: 0.08, ease: "expo.out" },
  dot: { from: 0, duration: 0.5, ease: "back.out(1.6)", overlap: 0.25 },
} as const;

const GLYPHS = [
  { key: "h", x: 0, width: 79.8 },
  { key: "r", x: 95.8, width: 75.7 },
  { key: "l", x: 182.8, width: 67.5 },
  { key: "d", x: 261.2, width: 81.9 },
] as const;
const WORDMARK_HEIGHT = Number(WORDMARK.viewBox.split(" ")[3] ?? "75");

type CopyState = "idle" | "copied" | "failed";

let scrollTriggerPromise: Promise<void> | undefined;

function loadScrollTrigger(): Promise<void> {
  scrollTriggerPromise ??= import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
  return scrollTriggerPromise;
}

interface SiteFooterProps {
  content: SiteFooterContent;
  inert?: boolean;
}

export default function SiteFooter({ content, inert = false }: SiteFooterProps) {
  const titleId = useId();
  const markRef = useRef<HTMLDivElement>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const { headline, email, cta, backToTop } = content;

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), COPY_RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  useGSAP(
    () => {
      let cancelled = false;
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;

      void loadScrollTrigger().then(() => {
        const mark = markRef.current;
        if (cancelled || !mark) return;

        mm = gsap.matchMedia();
        mm.add(FULL_MOTION, () => {
          const letters = gsap.utils.toArray<HTMLElement>(".site-footer__glyph-inner", mark);
          const dot = mark.querySelector<HTMLElement>(".site-footer__dot");
          const { letter, dot: dotStep } = FOOTER_REVEAL;

          const timeline = gsap.timeline({ scrollTrigger: { trigger: mark, start: FOOTER_REVEAL.start, once: true } });
          timeline.from(letters, { yPercent: letter.from, duration: letter.duration, stagger: letter.stagger, ease: letter.ease });
          if (dot) {
            timeline.from(dot, { scale: dotStep.from, duration: dotStep.duration, ease: dotStep.ease }, `-=${dotStep.overlap}`);
          }
        });
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: markRef },
  );

  const copyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email.address);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const scrollToTop = (): void => {
    const reduce = window.matchMedia(REDUCED_MOTION).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById(backToTop.targetId)?.focus({ preventScroll: true });
  };

  const copyStatus =
    copyState === "copied" ? email.copiedLabel : copyState === "failed" ? email.failedLabel : "";

  return (
    <footer className="site-footer" aria-labelledby={titleId} inert={inert}>
      <div className="site-footer__top">
        <div className="site-footer__intro">
          <h2 id={titleId} className="site-footer__title">
            <span className="site-footer__title-line">{headline.lead}</span>{" "}
            <span className="site-footer__title-line site-footer__title-line--accent">{headline.accent}</span>
          </h2>
          <p className="site-footer__body">{content.body}</p>
        </div>

        <div className="site-footer__aside">
          <nav className="site-footer__links" aria-label={content.linksLabel}>
            {content.groups.map((group) => (
              <div key={group.label} className="site-footer__group">
                <h3 className="site-footer__group-label">{group.label}</h3>
                <ul className="site-footer__list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          className="site-footer__link site-footer__link--external"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label} <span className="site-footer__sr-only">{content.newTabLabel}</span>
                        </a>
                      ) : (
                        <a className="site-footer__link" href={link.href}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="site-footer__contact">
            <button
              type="button"
              className="site-footer__email"
              title={email.copyLabel}
              onClick={() => void copyEmail()}
            >
              {email.address}
              <span className="site-footer__sr-only"> {email.copyLabel}</span>
            </button>
            <span className="site-footer__copy-status" role="status">
              {copyStatus}
            </span>
            <a className="site-footer__cta" href={cta.href}>
              {cta.label}
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copyright">{content.copyright}</p>
      </div>

      <div ref={markRef} className="site-footer__mark">
        {GLYPHS.map((glyph) => (
          <span key={glyph.key} className={`site-footer__glyph site-footer__glyph--${glyph.key}`} aria-hidden="true">
            <span className="site-footer__glyph-inner">
              <svg
                className="site-footer__glyph-svg"
                viewBox={`${glyph.x} 0 ${glyph.width} ${WORDMARK_HEIGHT}`}
                focusable="false"
              >
                <path d={WORDMARK.letters} />
              </svg>
            </span>
          </span>
        ))}
        <button type="button" className="site-footer__dot" aria-label={backToTop.label} onClick={scrollToTop}>
          <svg className="site-footer__dot-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 20V5M5.5 11.5 12 5l6.5 6.5" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
