import { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { WorkPageContent } from '../../types/site.ts';
import { padIndex } from '../../lib/text.ts';
import { WORK_MEDIA, WORK_MOTION } from '../../lib/workMotion.ts';
import '../../styles/work/WorkHeading.css';

gsap.registerPlugin(useGSAP);

type WorkHeadingProps = {
  content: WorkPageContent;
  total: number;
};

export default function WorkHeading({ content, total }: WorkHeadingProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(WORK_MEDIA.fullMotion, () => {
        gsap.from('.work-heading__title-text', { yPercent: 100, duration: WORK_MOTION.introTitle, ease: WORK_MOTION.introEase });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="work-heading" aria-labelledby={titleId}>
      <div>
        <p className="work-heading__eyebrow" aria-hidden="true">
          {content.eyebrow}
        </p>
        <h1 id={titleId} className="work-heading__title">
          <span className="work-heading__mask">
            <span className="work-heading__title-text">{content.title}</span>
          </span>
        </h1>
      </div>

      <div className="work-heading__side">
        <p className="work-heading__count">
          <span className="work-heading__count-number">{padIndex(total)}</span> {content.countLabel}
        </p>
        <p className="work-heading__intro">{content.intro}</p>
      </div>
    </section>
  );
}
