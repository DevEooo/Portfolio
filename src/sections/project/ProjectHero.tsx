import { Fragment, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ProjectDetail, ProjectPageContent } from '../../types/site.ts';
import ProjectMedia from '../../components/ProjectMedia.tsx';
import { loadScrollTrigger } from '../../lib/scrollTrigger.ts';
import { fillTemplate, padIndex, titleFit, titleFitByWord } from '../../lib/text.ts';
import '../../styles/project/ProjectHero.css';

gsap.registerPlugin(useGSAP);

const FULL_MOTION = '(prefers-reduced-motion: no-preference)';

const HERO_MOTION = {
  scrub: 0.6,
  coverBleed: 1.02,
  fadeOut: { at: 0, duration: 0.12 },
  caption: { at: 0.08, duration: 0.2, y: 24 },
  grow: { at: 0.12, duration: 0.6, ease: 'power2.inOut' },
  title: { at: 0.25, duration: 0.45, scale: 1.08 },
  land: { at: 0.74, duration: 0.2, y: 32, ease: 'power2.out' },
} as const;

type ProjectHeroProps = {
  project: ProjectDetail;
  position: number;
  total: number;
  content: ProjectPageContent;
};

export default function ProjectHero({ project, position, total, content }: ProjectHeroProps) {
  const trackRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleId = `project-title-${project.slug}`;
  const words = project.name.trim().split(/\s+/);

  useGSAP(
    () => {
      let cancelled = false;
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;

      void loadScrollTrigger().then(() => {
        const track = trackRef.current;
        const photo = photoRef.current;
        if (cancelled || !track || !photo) return;

        mm = gsap.matchMedia();
        mm.add(FULL_MOTION, () => {
          const q = gsap.utils.selector(track);
          const coverScale = (): number =>
            Math.max(window.innerWidth / photo.offsetWidth, window.innerHeight / photo.offsetHeight) * HERO_MOTION.coverBleed;
          const { fadeOut, caption, grow, title, land } = HERO_MOTION;

          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: HERO_MOTION.scrub, invalidateOnRefresh: true },
            })
            .to(q('.project-hero__back, .project-hero__cue'), { opacity: 0, duration: fadeOut.duration }, fadeOut.at)
            .to(q('.project-hero__caption'), { opacity: 0, y: caption.y, duration: caption.duration }, caption.at)
            .to(photo, { scale: coverScale, duration: grow.duration, ease: grow.ease }, grow.at)
            .to(q('.project-media__label'), { scale: () => 1 / coverScale(), duration: grow.duration, ease: grow.ease }, grow.at)
            .to(q('.project-hero__title'), { opacity: 0, scale: title.scale, duration: title.duration }, title.at)
            .fromTo(
              q('.project-hero__end'),
              { opacity: 0, y: land.y },
              { opacity: 1, y: 0, duration: land.duration, ease: land.ease },
              land.at,
            );
        });
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: trackRef, dependencies: [project.slug], revertOnUpdate: true },
  );

  return (
    <section ref={trackRef} className="project-hero" aria-labelledby={titleId}>
      <div className="project-hero__stage">
        <div className="project-hero__top">
          <a className="project-hero__back" href={content.backLink.href}>
            {content.backLink.label}
          </a>
          <p className="project-hero__counter">
            <span aria-hidden="true">
              {padIndex(position)} / {padIndex(total)}
            </span>
            <span className="project-hero__sr-only">{fillTemplate(content.counterLabel, { current: position, total })}</span>
          </p>
        </div>

        <h1 id={titleId} className="project-hero__title" data-fit={titleFit(project.name)} data-fit-narrow={titleFitByWord(project.name)}>
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              {i > 0 ? ' ' : null}
              <span className="project-hero__word">{word}</span>
            </Fragment>
          ))}
        </h1>

        <div ref={photoRef} className="project-hero__photo">
          <ProjectMedia media={project.cover} loading="eager" priority="high" />
        </div>

        <div className="project-hero__bottom">
          <div className="project-hero__caption" aria-hidden="true">
            <p className="project-hero__caption-name">{project.name}</p>
            <p className="project-hero__caption-meta">
              <span>{project.type}</span>
              <span className="project-hero__divider" />
              <span>{project.year}</span>
            </p>
          </div>
          <p className="project-hero__cue">{content.scrollCue}</p>
        </div>

        <div className="project-hero__end">
          <p className="project-hero__end-name" aria-hidden="true">
            {project.name}
          </p>
          <dl className="project-hero__meta">
            <div>
              <dt>{content.meta.type}</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt>{content.meta.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>{content.meta.status}</dt>
              <dd>{project.status}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
