import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ProjectDetail, WorkPageContent } from '../../types/site.ts';
import ProjectMedia from '../../components/ProjectMedia.tsx';
import { cursorProjectTarget } from '../../lib/cursorTarget.ts';
import { loadScrollTrigger } from '../../lib/scrollTrigger.ts';
import { padIndex } from '../../lib/text.ts';
import { createPreviewStack, WORK_MEDIA, WORK_MOTION, WORK_READING } from '../../lib/workMotion.ts';
import '../../styles/work/WorkList.css';

gsap.registerPlugin(useGSAP);

type WorkListProps = {
  projects: readonly ProjectDetail[];
  content: WorkPageContent;
};

export default function WorkList({ projects, content }: WorkListProps) {
  const rootRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      let cancelled = false;
      let mm: ReturnType<typeof gsap.matchMedia> | undefined;

      const intro = gsap.matchMedia();
      intro.add(WORK_MEDIA.fullMotion, () => {
        const { introLine, introStagger, introRowDelay, introRowY, introEase } = WORK_MOTION;
        gsap.from('.work-list__line', { scaleX: 0, duration: introLine, ease: introEase, stagger: introStagger });
        gsap.from('.work-list__link', { opacity: 0, y: introRowY, duration: introLine, ease: introEase, stagger: introStagger, delay: introRowDelay });
      });

      void loadScrollTrigger().then(() => {
        const root = rootRef.current;
        if (cancelled || !root) return;

        mm = gsap.matchMedia();
        mm.add({ wide: WORK_MEDIA.wide, reduce: WORK_MEDIA.reduce }, (context) => {
          if (!context.conditions?.wide) return undefined;
          const reduced = Boolean(context.conditions.reduce);
          const q = gsap.utils.selector(root);
          const list = q('.work-list__rows')[0];
          if (!list) return undefined;
          const stack = createPreviewStack(q('.work-preview__slide'), q('.work-preview__image'));

          q('.work-list__row').forEach((row, i) => {
            gsap.timeline({
              scrollTrigger: {
                trigger: row,
                start: WORK_READING.start,
                end: WORK_READING.end,
                onToggle: (self) => {
                  if (!self.isActive || i === activeRef.current) return;
                  stack.show(activeRef.current, i, self.direction, reduced);
                  activeRef.current = i;
                  setActive(i);
                },
              },
            });
          });

          gsap.fromTo(
            q('.work-preview__fill'),
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', scrollTrigger: { trigger: list, start: WORK_READING.start, end: WORK_READING.end, scrub: true } },
          );

          return () => {
            stack.reset();
            activeRef.current = 0;
            setActive(0);
          };
        });
      });

      return () => {
        cancelled = true;
        mm?.revert();
      };
    },
    { scope: rootRef, dependencies: [projects], revertOnUpdate: true },
  );

  const total = padIndex(projects.length);

  return (
    <section ref={rootRef} className="work-list" aria-label={content.listLabel}>
      <div className="work-list__rows-wrap">
        <ol className="work-list__rows">
          {projects.map((project, i) => (
            <li key={project.slug} className="work-list__row" data-active={i === active ? '' : undefined}>
              <span className="work-list__line" aria-hidden="true" />
              <a className="work-list__link" href={`/work/${project.slug}`} {...cursorProjectTarget(content.cursorLabel)}>
                <span className="work-list__index" aria-hidden="true">
                  {padIndex(i + 1)}
                </span>
                <span className="work-list__name">{project.name}</span>
                <span className="work-list__type">{project.type}</span>
              </a>
            </li>
          ))}
        </ol>
        <span className="work-list__line work-list__line--end" aria-hidden="true" />
      </div>

      <div className="work-preview" aria-hidden="true">
        <div className="work-preview__sticky">
          <div className="work-preview__frame">
            {projects.map((project, i) => (
              <div key={project.slug} className="work-preview__slide">
                <div className="work-preview__image">
                  <ProjectMedia media={project.cover} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              </div>
            ))}
            <span className="work-preview__counter">
              {padIndex(active + 1)} / {total}
            </span>
          </div>
          <span className="work-preview__progress">
            <span className="work-preview__fill" />
          </span>
        </div>
      </div>
    </section>
  );
}
