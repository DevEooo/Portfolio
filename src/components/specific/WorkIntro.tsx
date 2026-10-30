import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectImage } from "../../types/site.ts";
import "../../styles/WorkIntro.css";

gsap.registerPlugin(useGSAP);

const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const WORK_INTRO = {
  move: { at: 0, duration: 0.6, ease: "power2.inOut" },
  open: { at: 0.05, duration: 0.55 },
  flip: { at: 0.2, duration: 0.8 },
  hold: 0.15,
  scrub: 0.8,
  minScale: 0.01,
} as const;

let scrollTriggerPromise: Promise<void> | undefined;

function loadScrollTrigger(): Promise<void> {
  scrollTriggerPromise ??= import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
  return scrollTriggerPromise;
}

export type WorkIntroPhoto = {
  id: string;
  image: ProjectImage;
};

interface WorkIntroProps {
  titleId: string;
  title: { first: string; last: string };
  photos: readonly WorkIntroPhoto[];
  placeholder: string;
}

export default function WorkIntro({ titleId, title, photos, placeholder }: WorkIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const lastWordRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      let cancelled = false;
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;

      void loadScrollTrigger().then(() => {
        const root = rootRef.current;
        const line = lineRef.current;
        const photo = photoRef.current;
        const inner = innerRef.current;
        const lastWord = lastWordRef.current;
        if (cancelled || !root || !line || !photo || !inner || !lastWord) return;

        mm = gsap.matchMedia();
        mm.add(FULL_MOTION, () => {
          const pictures = gsap.utils.toArray<HTMLElement>(".work-intro__img", inner);
          const flip = { index: 0 };
          const showPicture = (index: number): void => {
            pictures.forEach((picture, i) => gsap.set(picture, { opacity: i === index ? 1 : 0 }));
          };

          const startShift = (): number => -(photo.offsetWidth + parseFloat(getComputedStyle(line).columnGap || "0"));
          const counterScale = (): void => {
            const scale = Number(gsap.getProperty(photo, "scaleX")) || 0;
            gsap.set(inner, { scaleX: 1 / Math.max(scale, WORK_INTRO.minScale) });
          };

          const { move, open, flip: flipStep } = WORK_INTRO;
          const timeline = gsap
            .timeline({
              scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: WORK_INTRO.scrub, invalidateOnRefresh: true },
              onUpdate: counterScale,
            })
            .fromTo(lastWord, { x: () => startShift() }, { x: 0, duration: move.duration, ease: move.ease }, move.at)
            .fromTo(photo, { scaleX: 0 }, { scaleX: 1, duration: open.duration, ease: move.ease }, open.at);

          if (pictures.length > 1) {
            timeline.fromTo(
              flip,
              { index: 0 },
              {
                index: pictures.length - 1,
                duration: flipStep.duration,
                ease: "none",
                onUpdate: () => showPicture(Math.round(flip.index)),
              },
              flipStep.at,
            );
          }
          timeline.to({}, { duration: WORK_INTRO.hold });
          counterScale();
        });
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="work-intro">
      <div className="work-intro__stage">
        <h2 ref={lineRef} id={titleId} className="work-intro__line" aria-label={`${title.first} ${title.last}`}>
          <span className="work-intro__word">{title.first}</span>
          <span ref={photoRef} className="work-intro__photo" aria-hidden="true">
            <span ref={innerRef} className="work-intro__inner">
              {photos.length > 0 ? (
                photos.map(({ id, image }) => (
                  <img
                    key={id}
                    className="work-intro__img"
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                ))
              ) : (
                <span className="work-intro__placeholder">{placeholder}</span>
              )}
            </span>
          </span>
          <span ref={lastWordRef} className="work-intro__word">
            {title.last}
          </span>
        </h2>
      </div>
    </div>
  );
}
