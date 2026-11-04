import { useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ProjectPageContent, ProjectStage, ProjectStageId } from '../../types/site.ts';
import { loadScrollTrigger } from '../../lib/scrollTrigger.ts';
import '../../styles/project/ProjectProcess.css';

gsap.registerPlugin(useGSAP);

const READING_LINE = 'top 50%';
const READING_END = 'bottom 50%';

type ProjectProcessProps = {
  stages: readonly ProjectStage[];
  content: ProjectPageContent['process'];
};

const stageAnchor = (id: ProjectStageId): string => `stage-${id}`;

export default function ProjectProcess({ stages, content }: ProjectProcessProps) {
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<ProjectStageId | undefined>(stages[0]?.id);

  useGSAP(
    () => {
      let cancelled = false;
      void loadScrollTrigger().then(() => {
        const root = rootRef.current;
        if (cancelled || !root) return;
        const q = gsap.utils.selector(root);
        const list = q('.project-process__stage');
        const stageList = q('.project-process__stages')[0];
        if (!stageList) return;

        gsap.to(q('.project-process__rail-fill'), {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: stageList, start: READING_LINE, end: READING_END, scrub: true },
        });

        list.forEach((stage, i) => {
          const following = list[i + 1];
          gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: READING_LINE,
              endTrigger: following ?? stageList,
              end: following ? READING_LINE : READING_END,
              onToggle: (self) => {
                if (self.isActive) setCurrent(stages[i]?.id);
              },
            },
          });
        });
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: rootRef, dependencies: [stages], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className="project-process" aria-labelledby={headingId}>
      <h2 id={headingId} className="project-process__sr-only">
        {content.heading}
      </h2>

      <nav className="project-process__index" aria-label={content.navLabel}>
        <span className="project-process__rail" aria-hidden="true">
          <span className="project-process__rail-fill" />
        </span>
        <ol className="project-process__links">
          {stages.map((stage) => (
            <li key={stage.id}>
              <a
                className="project-process__link"
                href={`#${stageAnchor(stage.id)}`}
                aria-current={stage.id === current ? 'step' : undefined}
              >
                {content.stageTitles[stage.id]}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="project-process__stages">
        {stages.map((stage) => (
          <article key={stage.id} id={stageAnchor(stage.id)} className="project-process__stage">
            <h3 className="project-process__title">{content.stageTitles[stage.id]}</h3>
            <p className="project-process__body">{stage.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
