import { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LiveClock from '../../components/LiveClock.tsx';
import type { ContactPageContent } from '../../types/site.ts';
import { CONTACT_MEDIA, CONTACT_MOTION } from '../../lib/contactMotion.ts';
import '../../styles/contact/ContactIntro.css';

gsap.registerPlugin(useGSAP);

type ContactIntroProps = {
  content: Pick<ContactPageContent, 'eyebrow' | 'title' | 'clock'>;
};

export default function ContactIntro({ content }: ContactIntroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const { eyebrow, title, clock } = content;

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(CONTACT_MEDIA.fullMotion, () => {
        const intro = CONTACT_MOTION.intro;
        gsap
          .timeline({ defaults: { ease: intro.ease } })
          .from('.contact-intro__eyebrow', { opacity: 0, y: intro.fadeY, duration: intro.eyebrowDuration }, intro.eyebrowAt)
          .from('.contact-intro__line-text', { yPercent: intro.lineRise, duration: intro.line, stagger: intro.stagger }, intro.linesAt);
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="contact-intro" aria-labelledby={titleId}>
      <p className="contact-intro__eyebrow" aria-hidden="true">
        {eyebrow}
      </p>
      <h1 id={titleId} className="contact-intro__title">
        <span className="contact-intro__line">
          <span className="contact-intro__line-text">{title.lead}</span>
        </span>{' '}
        <span className="contact-intro__line">
          <span className="contact-intro__line-text">
            {title.rest} <span className="contact-intro__accent">{title.accent}</span>
          </span>
        </span>
      </h1>

      <LiveClock className="contact-intro__clock" label={clock.label} timeZone={clock.timeZone} />
    </section>
  );
}
